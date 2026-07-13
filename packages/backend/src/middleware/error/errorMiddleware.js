class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  static notFound(message = 'Not Found', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }

  static conflict(message = 'Conflict', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }

  static validationError(message, details) {
    return new AppError(message, 400, 'VALIDATION_ERROR', details);
  }

  static internal(message = 'Internal Server Error') {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }
}

class ErrorHandler {
  static handleError(error, req, res, next) {
    if (!(error instanceof AppError)) {
      error = AppError.internal(error.message);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
  }

  static asyncWrapper(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static notFound(req, res, next) {
    next(AppError.notFound(`Route ${req.originalUrl} not found`));
  }
}

module.exports = { AppError, ErrorHandler };
