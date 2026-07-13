const express = require('express');
const userController = require('../controllers/userController');
const UploadMiddleware = require('../middleware/upload/uploadMiddleware');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const SecurityMiddleware = require('../middleware/security/securityMiddleware');
const RateLimitMiddleware = require('../middleware/rateLimit/rateLimitMiddleware');
const { registerSchema } = require('../middleware/validation/schemas/userSchemas');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.post(
  '/register',
  RateLimitMiddleware.upload(),
  UploadMiddleware.configure(),
  UploadMiddleware.validateFiles,
  UploadMiddleware.parseJsonFields,
  SecurityMiddleware.sanitizeInput,
  ValidationMiddleware.validate(registerSchema),
  applicationController.registerApplication
);

module.exports = router;
