const { AppError } = require('../error/errorMiddleware');

class SecurityMiddleware {
  static sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
      req.body = SecurityMiddleware.sanitizeObject(req.body);
    }
    next();
  }

  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove null bytes and control characters
        sanitized[key] = value.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string'
            ? item.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static preventMaliciousRequests(req, res, next) {
    const requestData = JSON.stringify({
      url: req.originalUrl,
      body: req.body,
      query: req.query,
    });

    const maliciousPatterns = [/\.\./g, /<script/gi, /union\s+select/gi, /exec\(/gi];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(requestData)) {
        console.warn('Malicious request detected', {
          ip: req.ip,
          url: req.originalUrl,
          pattern: pattern.toString(),
        });
        return next(AppError.badRequest('Malicious request detected', 'SECURITY_VIOLATION'));
      }
    }

    next();
  }
}

module.exports = SecurityMiddleware;
