const { ZodError } = require('zod');
const { AppError } = require('../error/errorMiddleware');

class ValidationMiddleware {
  static validate(schema) {
    return (req, res, next) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          // Map Zod errors to friendly shape: { path: string, message: string }
          const details = error.errors.map((e) => ({
            path: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          }));

          throw AppError.validationError('Validation failed', details);
        }
        next(error);
      }
    };
  }

  static validateParams(schema) {
    return (req, res, next) => {
      try {
        req.params = schema.parse(req.params);
        next();
      } catch (error) {
        next(AppError.badRequest('Invalid parameters'));
      }
    };
  }

  static validateQuery(schema) {
    return (req, res, next) => {
      try {
        req.query = schema.parse(req.query);
        next();
      } catch (error) {
        next(AppError.badRequest('Invalid query parameters'));
      }
    };
  }
}

module.exports = ValidationMiddleware;
