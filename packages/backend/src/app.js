const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const corsMiddleware = require('./middleware/cors/corsMiddleware');
const routes = require('./routes');
const { ErrorHandler } = require('./middleware/error/errorMiddleware');
const LoggingMiddleware = require('./middleware/logging/loggingMiddleware');
const SecurityMiddleware = require('./middleware/security/securityMiddleware');
const RateLimitMiddleware = require('./middleware/rateLimit/rateLimitMiddleware');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.set('trust proxy', true);

    this.app.use(corsMiddleware);

    // Security
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'none'"],
            connectSrc: ["'self'"],
            fontSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'none'"],
            frameSrc: ["'none'"],
          },
        },
      })
    );

    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '5mb' }));

    // Custom middleware
    this.app.use(LoggingMiddleware.logRequests);
    this.app.use(SecurityMiddleware.preventMaliciousRequests);
    this.app.use('/api', RateLimitMiddleware.general());
  }

  setupRoutes() {
    this.app.use('/api', routes);

    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        service: 'semadaki-gozler-api',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
      });
    });
  }

  setupErrorHandling() {
    this.app.use(ErrorHandler.notFound);
    this.app.use(ErrorHandler.handleError);
  }

  listen(port) {
    return this.app.listen(port);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
module.exports.App = App;
