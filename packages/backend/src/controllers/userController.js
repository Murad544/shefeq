/* eslint-disable class-methods-use-this */
const userService = require('../services/userService');
const userAuthService = require('../services/userAuthService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler, AppError } = require('../middleware/error/errorMiddleware');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

class UserController {
  login(req, res, next) {
    const handler = ErrorHandler.asyncWrapper(async (request, response) => {
      const {
        email,
        password,
        clientType = request.body.client_type || CLIENT_TYPES.WEB,
      } = request.body;
      const result = await userAuthService.login(email, password, clientType);
      if (!result) throw AppError.internal('Login failed');

      const responseData = {
        token: result.token,
        expiresAt: result.expiresAt,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        session: {
          id: result.session?.id || result.sessionId,
        },
      };

      sendSuccess(response, responseData, 'Login successful');
    });

    return handler(req, res, next);
  }

  me(req, res, next) {
    const handler = ErrorHandler.asyncWrapper(async (request, response) => {
      const authHeader = request.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppError.unauthorized('Authorization token required', 'TOKEN_EXPIRED');
      }
      const token = authHeader.substring(7);
      const validation = await userAuthService.validateToken(token);
      const sessionId = validation.token && validation.token.sessionId;
      const user = {
        id: validation.user.id,
        email: validation.user.email,
        role: validation.user.role,
      };
      sendSuccess(
        response,
        {
          user,
          session: {
            id: sessionId,
          },
        },
        'User retrieved successfully',
      );
    });

    return handler(req, res, next);
  }

  // Returns user details along with linked application data based on token
  profile(req, res, next) {
    const handler = ErrorHandler.asyncWrapper(async (request, response) => {
      const userId = request.user && request.user.id;
      if (!userId) {
        throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
      }

      const profile = await userService.profileWithApplication(userId);
      if (!profile) throw AppError.notFound('User not found');

      sendSuccess(response, profile, 'Profile retrieved successfully');
    });

    return handler(req, res, next);
  }

  changePassword(req, res, next) {
    const handler = ErrorHandler.asyncWrapper(async (request, response) => {
      const userId = request.user && request.user.id;
      if (!userId) {
        throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
      }

      const { currentPassword, newPassword } = request.body;
      const result = await userAuthService.changePassword(userId, currentPassword, newPassword);
      sendSuccess(response, result, 'Password changed successfully');
    });

    return handler(req, res, next);
  }

  logout(req, res, next) {
    const handler = ErrorHandler.asyncWrapper(async (request, response) => {
      const token = request.token;
      const userId = request.user && request.user.id;
      const clientType = request.tokenData?.client_type || request.body?.client_type;
      const result = await userAuthService.logout(token, userId, clientType);
      sendSuccess(response, result, 'Logged out successfully');
    });

    return handler(req, res, next);
  }
}

module.exports = new UserController();
