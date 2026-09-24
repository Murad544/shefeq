const adminRepository = require('../repositories/adminRepository');
const encryptionService = require('./shared/encryptionService');
const jwtService = require('./shared/jwtService');
const tokenBlacklistService = require('./shared/tokenBlacklistService');
const { AppError } = require('../middleware/error/errorMiddleware');

class AdminAuthService {
  async login(email, password, clientInfo) {
    if (!email || !password) {
      throw AppError.badRequest('Email and password are required', 'MISSING_CREDENTIALS');
    }

    const admin = await adminRepository.findByEmail(email);
    if (!admin || !admin.is_active) {
      throw AppError.unauthorized('Giriş məlumatları yanlışdır', 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await encryptionService.verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      throw AppError.unauthorized('Giriş məlumatları yanlışdır', 'INVALID_CREDENTIALS');
    }

    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      kind: 'admin',
      iat: Math.floor(Date.now() / 1000),
      role: admin.role,
    };

    const token = jwtService.generateToken(tokenPayload);
    await adminRepository.updateLastLogin(admin.id);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        isActive: admin.is_active,
        role: admin.role,
      },
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
  }

  async logout(token, adminId, clientInfo) {
    if (token) {
      await tokenBlacklistService.blacklistToken(token);
    }
    if (adminId) {
      await adminRepository.updateLogoutTimestamp(adminId);
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async validateToken(token) {
    const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw AppError.unauthorized('Token has been invalidated', 'TOKEN_BLACKLISTED');
    }

    const decoded = jwtService.verifyToken(token);

    if (!decoded.id || !decoded.email || decoded.kind !== 'admin') {
      throw AppError.unauthorized('Invalid token structure', 'INVALID_TOKEN_STRUCTURE');
    }

    const admin = await adminRepository.findById(decoded.id);
    if (!admin) {
      await tokenBlacklistService.blacklistToken(token);
      throw AppError.unauthorized('Admin account not found', 'ADMIN_NOT_FOUND');
    }

    if (!admin.is_active) {
      await tokenBlacklistService.blacklistToken(token);
      throw AppError.unauthorized('Admin account is inactive', 'ADMIN_INACTIVE');
    }

    return {
      admin,
      token: decoded,
    };
  }

  async getCurrentAdmin(adminId) {
    if (!adminId || !Number.isInteger(Number(adminId)) || Number(adminId) <= 0) {
      throw AppError.badRequest('Valid admin ID is required', 'INVALID_ADMIN_ID');
    }

    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      throw AppError.notFound('Admin not found', 'ADMIN_NOT_FOUND');
    }

    if (!admin.is_active) {
      throw AppError.unauthorized('Admin account is inactive', 'ADMIN_INACTIVE');
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      is_active: admin.is_active,
      last_login_at: admin.last_login_at,
      created_at: admin.created_at,
    };
  }

  async createAdmin(req) {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required', 'MISSING_CREDENTIALS');
    }

    if (!role) {
      throw AppError.badRequest('Role is required', 'MISSING_ROLE');
    }

    if (password.length < 6) {
      throw AppError.badRequest('Password must be at least 6 characters', 'WEAK_PASSWORD');
    }

    const existingAdmin = await adminRepository.findByEmail(email);
    if (existingAdmin) {
      throw AppError.conflict('Admin with this email already exists', 'ADMIN_EXISTS');
    }

    const password_hash = await encryptionService.hashPassword(password);

    const admin = await adminRepository.createAdmin({
      email: email.toLowerCase().trim(),
      password_hash,
      name: name?.trim() || null,
      role: role,
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      is_active: admin.is_active,
      created_at: admin.created_at,
    };
  }

  async deleteAdmin(adminId) {
    if (!adminId || !Number.isInteger(Number(adminId)) || Number(adminId) <= 0) {
      throw AppError.badRequest('Valid admin ID is required', 'INVALID_ADMIN_ID');
    }

    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      throw AppError.notFound('Admin not found', 'ADMIN_NOT_FOUND');
    }

    if (!admin.is_active) {
      throw AppError.badRequest('Admin is already inactive', 'ADMIN_ALREADY_INACTIVE');
    }

    // Soft delete by setting is_active to false
    await adminRepository.updateAdmin(adminId, { is_active: false });

    return { success: true, message: 'Admin deleted successfully' };
  }
}

module.exports = new AdminAuthService();
