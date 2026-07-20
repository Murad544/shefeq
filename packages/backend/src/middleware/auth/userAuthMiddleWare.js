const userAuthService = require('../../services/userAuthService');
const { AppError } = require('../error/errorMiddleware');
const { ALLOWED_CLIENT_TYPES } = require('../validation/types/types');

class UserAuthMiddleware {
  static ensureUser(options = {}) {
    const {
      allowedClientTypes = null, // ['web', 'game']
    } = options;
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);
        if (!token) {
          throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
        }

        const validation = await userAuthService.validateToken(token);

        // 🔐 Client type enforcement
        if (allowedClientTypes && !allowedClientTypes.includes(validation.token.client_type)) {
          throw AppError.forbidden(
            'Client type not allowed for this endpoint',
            'CLIENT_TYPE_NOT_ALLOWED'
          );
        }

        req.user = validation.user;
        req.token = token;
        req.tokenData = validation.token || validation;

        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return next(AppError.unauthorized('Token has expired', 'TOKEN_EXPIRED'));
        }
        if (error.name === 'JsonWebTokenError') {
          return next(AppError.unauthorized('Invalid token', 'TOKEN_INVALID'));
        }
        next(error);
      }
    };
  }

  static checkIfAlreadyAuthenticated() {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);
        if (!token) {
          return next();
        }

        const validation = await userAuthService.validateToken(token);
        if (validation.user && validation.user.is_active) {
          return res.status(200).json({
            success: true,
            message: 'Already authenticated',
            code: 'ALREADY_AUTHENTICATED',
            data: {
              user: validation.user,
              shouldRedirect: true,
              redirectTo: '/profile',
            },
          });
        }
        next();
      } catch (error) {
        next();
      }
    };
  }

  static extractToken(req) {
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (this.isValidTokenFormat(token)) {
        return token;
      }
    }

    const cookieToken = req.cookies?.user_session;
    if (cookieToken && this.isValidTokenFormat(cookieToken)) {
      return cookieToken;
    }

    const queryToken = req.query?.token;
    if (queryToken && this.isValidTokenFormat(queryToken)) {
      return queryToken;
    }

    return null;
  }

  static isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    return parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part));
  }

  static securityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  }
}

module.exports = UserAuthMiddleware;
