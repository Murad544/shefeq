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
          throw AppError.validationError('Validation failed', error.errors);
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
