const rateLimit = require('express-rate-limit');

class RateLimitMiddleware {
  static auth() {
    return rateLimit({
      windowMs: process.env.AUTH_RATE_LIMIT_WINDOW_MS,
      max: process.env.AUTH_RATE_LIMIT_MAX,
      message: { success: false, message: 'Too many auth attempts' },
      standardHeaders: true,
      trustProxy: true,
      keyGenerator: (req) => req.ip,
    });
  }

  static general() {
    return rateLimit({
      windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      max: process.env.RATE_LIMIT_MAX,
      message: { success: false, message: 'Too many requests' },
      standardHeaders: true,
      trustProxy: true,
      keyGenerator: (req) => req.ip,
    });
  }

  static upload() {
    return rateLimit({
      windowMs: process.env.UPLOAD_RATE_LIMIT_WINDOW_MS,
      max: process.env.UPLOAD_RATE_LIMIT_MAX,
      message: { success: false, message: 'Too many upload attempts' },
      standardHeaders: true,
      trustProxy: true,
      keyGenerator: (req) => req.ip,
    });
  }
}

module.exports = RateLimitMiddleware;
