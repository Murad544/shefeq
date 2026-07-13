const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const AuthMiddleware = require('../middleware/auth/authMiddleware');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const RateLimitMiddleware = require('../middleware/rateLimit/rateLimitMiddleware');
const SecurityMiddleware = require('../middleware/security/securityMiddleware');
const { loginSchema, createAdminSchema } = require('../middleware/validation/schemas/adminSchemas');

const router = express.Router();

router.post(
  '/login',
  AuthMiddleware.checkIfAlreadyAuthenticated(),
  RateLimitMiddleware.auth(),
  SecurityMiddleware.sanitizeInput,
  ValidationMiddleware.validate(loginSchema),
  adminAuthController.login
);

router.post('/logout', AuthMiddleware.ensureAdmin(), adminAuthController.logout);

router.get('/me', AuthMiddleware.ensureAdmin(), adminAuthController.me);

router.post(
  '/bootstrap',
  AuthMiddleware.checkIfAdminCreateAllowed(['superadmin']),
  AuthMiddleware.ensureAdmin(),
  RateLimitMiddleware.auth(),
  ValidationMiddleware.validate(createAdminSchema),
  adminAuthController.createAdmin
);

router.delete(
  '/delete',
  AuthMiddleware.checkIfAdminCreateAllowed(['superadmin']),
  AuthMiddleware.ensureAdmin(),
  RateLimitMiddleware.auth(),
  ValidationMiddleware.validate(createAdminSchema),
  adminAuthController.deleteAdmin
);

module.exports = router;
