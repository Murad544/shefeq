const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const encryptionService = require('./shared/encryptionService');
const jwtService = require('./shared/jwtService');
const tokenBlacklistService = require('./shared/tokenBlacklistService');
const { AppError } = require('../middleware/error/errorMiddleware');
const { CLIENT_TYPES, ALLOWED_CLIENT_TYPES } = require('../middleware/validation/types/types');

/* eslint-disable class-methods-use-this */

class UserAuthService {
  async login(email, password, clientType = CLIENT_TYPES.WEB, rememberMe = false) {
    if (!ALLOWED_CLIENT_TYPES.includes(clientType)) {
      throw AppError.badRequest('Invalid client type', 'VALIDATION_ERROR');
    }

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required', 'VALIDATION_ERROR');
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !user.is_active) {
      throw AppError.unauthorized('Email or password is wrong', 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await encryptionService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw AppError.unauthorized('Email or password is wrong', 'INVALID_CREDENTIALS');
    }

    const sessionId = crypto.randomUUID();
    await userRepository.updateSessionId(user.id, sessionId, clientType);

    if (clientType === CLIENT_TYPES.GAME) {
      try {
        const gameRepository = require('../repositories/gameRepository');
        await gameRepository.endUserActiveSessions({ userId: user.id, endReason: 'disconnect' });
        await gameRepository.startSession({ userId: user.id, sessionId });
      } catch (err) {
        // Safe for test environments
      }
    }

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

    let refreshToken = null;
    let refreshExpiresAt = null;

    if (Boolean(rememberMe && rememberMe !== 'false')) {
      refreshToken = crypto.randomBytes(32).toString('base64url');
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await refreshTokenRepository.create({
        userId: user.id,
        tokenHash,
        clientType,
        expiresAt: refreshExpiresAt,
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
        client_type: clientType,
        sessionId,
        session_id: sessionId,
        is_active: user.is_active,
        created_at: user.created_at,
      },
      token,
      sessionId,
      session_id: sessionId,
      session: {
        id: sessionId,
      },
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      refreshToken,
      refreshExpiresAt,
    };
  }

  async refreshToken(rawRefreshToken) {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken || storedToken.revoked_at) {
      throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Reuse detection: If token was already used, revoke all tokens for this user
    if (storedToken.used_at) {
      await refreshTokenRepository.revokeAllForUser(storedToken.user_id);
      throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Check expiration
    if (new Date(storedToken.expires_at) <= new Date()) {
      throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const user = await userRepository.findById(storedToken.user_id);
    if (!user || !user.is_active) {
      throw AppError.unauthorized('User account is inactive or not found', 'USER_INACTIVE');
    }

    // Consume old token
    await refreshTokenRepository.markAsUsed(storedToken.id);

    // Rotate: generate new refresh token
    const clientType = storedToken.client_type || CLIENT_TYPES.GAME;
    const newRefreshToken = crypto.randomBytes(32).toString('base64url');
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const newRefreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newTokenHash,
      clientType,
      expiresAt: newRefreshExpiresAt,
    });

    // Fresh session creation (same lifecycle as login)
    const sessionId = crypto.randomUUID();
    await userRepository.updateSessionId(user.id, sessionId, clientType);

    if (clientType === CLIENT_TYPES.GAME) {
      try {
        const gameRepository = require('../repositories/gameRepository');
        await gameRepository.endUserActiveSessions({ userId: user.id, endReason: 'disconnect' });
        await gameRepository.startSession({ userId: user.id, sessionId });
      } catch (err) {
        // Safe for test environments
      }
    }

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
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      refreshToken: newRefreshToken,
      refreshExpiresAt: newRefreshExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
      },
      session: {
        id: sessionId,
      },
      sessionId,
      session_id: sessionId,
    };
  }

  async revokeToken(rawRefreshToken) {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      return null;
    }

    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    await refreshTokenRepository.revokeByTokenHash(tokenHash);
    return null;
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
      throw AppError.unauthorized('Giriş məlumatları yanlışdır', 'INVALID_CREDENTIALS');
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

    await refreshTokenRepository.revokeAllForUser(userId);

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
        'SESSION_TERMINATED',
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

  async logout(token, userId, clientType, rawRefreshToken) {
    let resolvedClientType = clientType;

    if (rawRefreshToken) {
      await this.revokeToken(rawRefreshToken);
    }

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
