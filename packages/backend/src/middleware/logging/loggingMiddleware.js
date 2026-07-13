const logger = require('../../utils/logger');

class LoggingMiddleware {
  static logRequests(req, res, next) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
      });
    });

    next();
  }

  static logSecurityEvents(event, level = 'warn') {
    return (req, res, next) => {
      logger[level]('Security event', {
        event,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
      });
      next();
    };
  }
}

module.exports = LoggingMiddleware;
