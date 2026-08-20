const adminRepository = require('../repositories/adminRepository');
const applicationRepository = require('../repositories/applicationRepository');
const applicationApprovalRepository = require('../repositories/applicationApprovalRepository');
const questionRepository = require('../repositories/questionRepository');
const answerRepository = require('../repositories/answerRepository');
const fileRepository = require('../repositories/fileRepository');
const userRepository = require('../repositories/userRepository');
const encryptionService = require('./shared/encryptionService');
const { AppError } = require('../middleware/error/errorMiddleware');
const gameRepository = require('../repositories/gameRepository');

class AdminService {
  async getAllAdmins() {
    return await adminRepository.getAllAdmins();
  }

  async getAdminById(id) {
    return await adminRepository.findById(id);
  }

  async searchApplications(searchTerm) {
    return await applicationRepository.searchApplications(searchTerm);
  }

  async getAllQuestions() {
    return await questionRepository.getAllQuestions();
  }

  async getApplicationById(id) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw AppError.notFound('Application not found');
    }
    return application;
  }

  async getApplicationWithDetails(id) {
    const application = await applicationRepository.findById(id);
    console.log(application);
    if (!application) {
      throw AppError.notFound('Application not found');
    }

    const [answers, files] = await Promise.all([
      answerRepository.getAnswersByApplicationId(id),
      fileRepository.getFilesByApplicationId(id),
    ]);

    // Real game account data
    const gameData = await gameRepository.getGameAccountByApplicationId(id);
    const totalSeconds = gameData.sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalPlayTime = `${totalHours} saat ${totalMinutes} dəq`;
    const sessions = gameData.sessions.map((s) => ({
      id: s.id,
      date: s.session_started_at,
      login: s.session_started_at,
      logout: s.session_ended_at,
      duration: s.duration_seconds
        ? `${Math.floor(s.duration_seconds / 3600)} saat ${Math.floor((s.duration_seconds % 3600) / 60)} dəq`
        : '-',
    }));
    const gameAccount = {
      totalPlayTime,
      sessions,
    };
    return {
      application,
      answers,
      files,
      summary: {
        totalAnswers: answers.length,
        totalFiles: files.length,
      },
      gameAccount,
    };
  }

  async searchApprovals(searchTerm) {
    return await applicationApprovalRepository.searchApprovals(searchTerm);
  }

  async getUserEditDataForAdmin(admin, userId) {
    console.log(admin);
    if (!admin || admin.role !== 'superadmin') {
      throw AppError.forbidden('Only superadmin can edit user data', 'SUPERADMIN_REQUIRED');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const application = await applicationRepository.findByUserId(userId);
    if (!application) {
      throw AppError.notFound('User application not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      application: {
        id: application.id,
        name: application.name,
        surname: application.surname,
        father_name: application.father_name,
        phone_number: application.phone_number,
        education_level: application.education_level,
        university: application.university,
        profession: application.profession,
      },
    };
  }

  async updateUserDataForAdmin(admin, userId, payload) {
    if (!admin || admin.role !== 'superadmin') {
      throw AppError.forbidden('Only superadmin can edit user data', 'SUPERADMIN_REQUIRED');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const application = await applicationRepository.findByUserId(userId);
    if (!application) {
      throw AppError.notFound('User application not found');
    }

    const updatePayload = {};
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.surname !== undefined) updatePayload.surname = payload.surname;
    if (payload.fatherName !== undefined) updatePayload.father_name = payload.fatherName;
    if (payload.educationLevel !== undefined) { updatePayload.education_level = payload.educationLevel; }
    if (payload.university !== undefined) updatePayload.university = payload.university;
    if (payload.profession !== undefined) updatePayload.profession = payload.profession;
    if (payload.phoneNumber !== undefined) updatePayload.phone_number = payload.phoneNumber;

    if (Object.keys(updatePayload).length > 0) {
      await applicationRepository.updateApplication(application.id, updatePayload);
    }

    if (payload.password) {
      if (payload.password.length < 6) {
        throw AppError.badRequest('Password must be at least 6 characters', 'WEAK_PASSWORD');
      }

      const passwordHash = await encryptionService.hashPassword(payload.password);
      await userRepository.updateUser(userId, { password_hash: passwordHash });
    }

    return { updated: true };
  }

  async approveApplication(id, acceptedBy) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw AppError.notFound('Application not found');
    }

    const isApplicationApproved = await applicationApprovalRepository.isApplicationApproved(id);
    if (isApplicationApproved) {
      throw AppError.badRequest('Application is already approved');
    }

    // Generate secret key for the approval and a one-time activation token
    const crypto = require('crypto');
    const secretKey = crypto.randomBytes(8).toString('hex').toUpperCase();

    // activation token (plain) sent to user; we store only the hash
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenHash = require('crypto')
      .createHash('sha256')
      .update(activationToken)
      .digest('hex');
    const tokenTTLHours = parseInt(process.env.ACTIVATION_TOKEN_TTL_HOURS || '168', 10); // default 7 days
    const activationExpiresAt = new Date(Date.now() + tokenTTLHours * 3600 * 1000);

    const approval = await applicationApprovalRepository.approveApplication(
      id,
      acceptedBy,
      secretKey,
      null, // notes
      activationTokenHash,
      activationExpiresAt,
    );
    if (!approval) {
      throw AppError.internal('Application could not be approved');
    }

    // Build activation URL and send email
    const emailService = require('../utils/emailService');
    const frontendBase = process.env.FRONTEND_BASE_URL || process.env.BACKEND_PUBLIC_URL || 'http://localhost:3000';
    const activationUrl = `${frontendBase.replace(/\/$/, '')}/activate/${activationToken}`;

    try {
      await emailService.sendActivationEmail(application.email, activationUrl);
    } catch (err) {
      // Log and continue; approval record exists
      const logger = require('../utils/logger');
      logger.error('Failed to send activation email', err);
    }

    // Return approval details (do not include plain token)
    return approval;
  }

  async deactivateAdmin(id) {
    const admin = await adminRepository.findById(id);
    if (!admin) {
      throw AppError.notFound('Admin not found');
    }

    if (!admin.is_active) {
      throw AppError.badRequest('Admin is already inactive');
    }

    await adminRepository.updateAdmin(id, { is_active: false });
    return { message: 'Admin deactivated successfully' };
  }

  async activateAdmin(id) {
    const admin = await adminRepository.findById(id);
    if (!admin) {
      throw AppError.notFound('Admin not found');
    }

    if (admin.is_active) {
      throw AppError.badRequest('Admin is already active');
    }

    await adminRepository.updateAdmin(id, { is_active: true });
    return { message: 'Admin activated successfully' };
  }

  async rejectApplication(id) {
    const isApplicationApproved = await applicationApprovalRepository.isApplicationApproved(id);
    if (!isApplicationApproved) {
      throw AppError.notFound('Application is not approved');
    }

    return await applicationApprovalRepository.removeApproval(id);
  }

  async checkIfApplicationApproved(id) {
    return await applicationApprovalRepository.isApplicationApproved(id);
  }

  async resendActivation(applicationId, requestedBy) {
    const approval = await applicationApprovalRepository.findByApplicationId(applicationId);
    if (!approval) {
      throw AppError.notFound('Application is not approved');
    }

    // Generate new activation token and expiry
    const crypto = require('crypto');
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenHash = require('crypto')
      .createHash('sha256')
      .update(activationToken)
      .digest('hex');
    const tokenTTLHours = parseInt(process.env.ACTIVATION_TOKEN_TTL_HOURS || '168', 10);
    const activationExpiresAt = new Date(Date.now() + tokenTTLHours * 3600 * 1000);

    const updated = await applicationApprovalRepository.resendActivation(
      applicationId,
      activationTokenHash,
      activationExpiresAt,
    );
    if (!updated) throw AppError.internal('Failed to update activation token');

    // Send email to applicant
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw AppError.notFound('Application not found');

    const emailService = require('../utils/emailService');
    const frontendBase = process.env.FRONTEND_BASE_URL || process.env.BACKEND_PUBLIC_URL || 'http://localhost:3000';
    const activationUrl = `${frontendBase.replace(/\/$/, '')}/activate/${activationToken}`;

    try {
      await emailService.sendActivationEmail(application.email, activationUrl, {
        subject: 'Activation link (resend)',
      });
    } catch (err) {
      const logger = require('../utils/logger');
      logger.error('Failed to resend activation email', err);
    }

    return { ok: true };
  }
}

module.exports = new AdminService();
