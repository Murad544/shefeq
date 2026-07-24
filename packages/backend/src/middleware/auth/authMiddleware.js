const adminAuthService = require('../../services/adminAuthService');
const { AppError } = require('../error/errorMiddleware');

class AuthMiddleware {
  static ensureAdmin(options = {}) {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);
        if (!token) {
          throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
        }

        const validation = await adminAuthService.validateToken(token);
        req.user = validation.admin;
        req.token = token;
        req.tokenData = validation.token;

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

  static checkIfAdminCreateAllowed(roles) {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);
        if (!token) {
          return next();
        }

        const validation = await adminAuthService.validateToken(token);
        if (!roles.includes(validation.token.role)) {
          return next(
            AppError.forbidden('Admin creation not allowed', 'ADMIN_CREATION_NOT_ALLOWED')
          );
        }
        next();
      } catch (error) {
        next();
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

        const validation = await adminAuthService.validateToken(token);
        if (validation.admin && validation.admin.isActive) {
          return res.status(200).json({
            success: true,
            message: 'Already authenticated',
            code: 'ALREADY_AUTHENTICATED',
            data: {
              admin: validation.admin,
              shouldRedirect: true,
              redirectTo: '/admin',
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

    const queryToken = req.query?.token;
    if (queryToken && this.isValidTokenFormat(queryToken)) {
      return queryToken;
    }

    const cookieToken = req.cookies?.admin_session;
    if (cookieToken && this.isValidTokenFormat(cookieToken)) {
      return cookieToken;
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

module.exports = AuthMiddleware;
