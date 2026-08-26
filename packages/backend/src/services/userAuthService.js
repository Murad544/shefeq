const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const encryptionService = require('./shared/encryptionService');
const jwtService = require('./shared/jwtService');
const tokenBlacklistService = require('./shared/tokenBlacklistService');
const { AppError } = require('../middleware/error/errorMiddleware');
const { CLIENT_TYPES, ALLOWED_CLIENT_TYPES } = require('../middleware/validation/types/types');

/* eslint-disable class-methods-use-this */

class UserAuthService {
  async login(email, password, clientType = CLIENT_TYPES.WEB) {
    if (!ALLOWED_CLIENT_TYPES.includes(clientType)) {
      throw AppError.badRequest('Invalid client type', 'INVALID_CLIENT_TYPE');
    }

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required', 'MISSING_CREDENTIALS');
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !user.is_active) {
      throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await encryptionService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const sessionId = crypto.randomUUID();
    await userRepository.updateSessionId(user.id, sessionId, clientType);

    const userRole = user.role || 'trainee';

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: userRole,
      client_type: clientType,
      sessionId,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwtService.generateToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
        client_type: clientType,
        is_active: user.is_active,
        created_at: user.created_at,
      },
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!userId) {
      throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
    }

    if (!currentPassword || !newPassword) {
      throw AppError.badRequest('Current and new password are required', 'MISSING_PASSWORDS');
    }

    if (newPassword.length < 6) {
      throw AppError.badRequest('New password must be at least 6 characters', 'WEAK_PASSWORD');
    }

    const user = await userRepository.findById(userId);
    if (!user || !user.is_active) {
      throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await encryptionService.verifyPassword(
      currentPassword,
      user.password_hash,
    );
    if (!passwordMatches) {
      throw AppError.unauthorized('Invalid current password', 'INVALID_CURRENT_PASSWORD');
    }

    const newPasswordHash = await encryptionService.hashPassword(newPassword);
    const updatedUser = await userRepository.updateUser(userId, {
      password_hash: newPasswordHash,
    });

    if (!updatedUser) {
      throw AppError.internal('Failed to update password');
    }

    return { updated: true };
  }

  async validateToken(token) {
    const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw AppError.unauthorized('Token has been invalidated', 'TOKEN_BLACKLISTED');
    }

    const decoded = jwtService.verifyToken(token);

    if (!decoded.id || !decoded.email || !decoded.client_type) {
      throw AppError.unauthorized('Invalid token structure', 'INVALID_TOKEN_STRUCTURE');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      await tokenBlacklistService.blacklistToken(token);
      throw AppError.unauthorized('User account not found', 'USER_NOT_FOUND');
    }

    if (!user.is_active) {
      await tokenBlacklistService.blacklistToken(token);
      throw AppError.unauthorized('User account is inactive', 'USER_INACTIVE');
    }

    const isGame = decoded.client_type === CLIENT_TYPES.GAME;
    const currentSessionId = isGame
      ? user.game_session_id
      : (user.web_session_id !== undefined ? user.web_session_id : user.session_id);

    if (currentSessionId && decoded.sessionId !== currentSessionId) {
      await tokenBlacklistService.blacklistToken(token);
      throw AppError.unauthorized(
        'Session terminated. Logged in from another device',
        'SESSION_TERMINATED'
      );
    }

    const role = user.role || decoded.role || 'trainee';

    return {
      user: {
        id: user.id,
        email: user.email,
        role,
        is_active: user.is_active,
      },
      token: {
        ...decoded,
        role,
      },
    };
  }

  async logout(token, userId, clientType) {
    let resolvedClientType = clientType;

    if (token) {
      await tokenBlacklistService.blacklistToken(token);
      if (!resolvedClientType) {
        try {
          const decoded = jwtService.verifyToken(token);
          if (decoded && decoded.client_type) {
            resolvedClientType = decoded.client_type;
          }
        } catch (error) {
          // Token verification might fail if expired or invalid, continue logout
        }
      }
    }

    if (userId) {
      if (resolvedClientType) {
        await userRepository.updateSessionId(userId, null, resolvedClientType);
      } else {
        await userRepository.updateSessionId(userId, null, 'all');
      }
    }

    return { success: true, message: 'Logged out successfully' };
  }
}

module.exports = new UserAuthService();
