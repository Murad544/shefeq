const applicationApprovalRepository = require('../repositories/applicationApprovalRepository');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const encryptionService = require('../services/shared/encryptionService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler, AppError } = require('../middleware/error/errorMiddleware');

class ActivationController {
  getActivation = ErrorHandler.asyncWrapper(async (req, res) => {
    const { token } = req.params;
    if (!token) throw AppError.badRequest('Token is required');

    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const approval = await applicationApprovalRepository.findByActivationTokenHash(tokenHash);
    if (!approval) throw AppError.notFound('Invalid or expired activation token');

    if (approval.activation_expires_at && new Date(approval.activation_expires_at) < new Date()) {
      throw AppError.badRequest('Activation token has expired');
    }

    if (approval.activation_used_at) {
      throw AppError.badRequest('Activation token has already been used');
    }

    const application = await applicationRepository.findById(approval.application_id);
    if (!application) throw AppError.notFound('Application not found');

    // Return minimal application info for activation UI
    sendSuccess(
      res,
      {
        application: {
          id: application.id,
          name: application.name,
          surname: application.surname,
          email: application.email,
        },
        canActivate: true,
      },
      'Activation token is valid'
    );
  });

  postActivation = ErrorHandler.asyncWrapper(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) throw AppError.badRequest('Token is required');
    if (!password) throw AppError.badRequest('Password is required');

    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const approval = await applicationApprovalRepository.findByActivationTokenHash(tokenHash);
    if (!approval) throw AppError.notFound('Invalid or expired activation token');

    if (approval.activation_expires_at && new Date(approval.activation_expires_at) < new Date()) {
      throw AppError.badRequest('Activation token has expired');
    }

    if (approval.activation_used_at) {
      throw AppError.badRequest('Activation token has already been used');
    }

    const application = await applicationRepository.findById(approval.application_id);
    if (!application) throw AppError.notFound('Application not found');

    // Create user account
    const passwordHash = await encryptionService.hashPassword(password);
    const createdUser = await userRepository.createUser({
      email: application.email,
      password_hash: passwordHash,
      role: application.role || 'trainee',
    });

    // Link user to application approval and mark activation used
    await applicationApprovalRepository.linkUserToApplication(
      approval.application_id,
      createdUser.id
    );
    await applicationApprovalRepository.markActivationUsed(approval.application_id, createdUser.id);

    sendSuccess(
      res,
      { user: { id: createdUser.id, email: createdUser.email } },
      'Account activated successfully'
    );
  });
}

module.exports = new ActivationController();
