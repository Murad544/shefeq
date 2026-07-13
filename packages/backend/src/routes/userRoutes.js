const express = require('express');
const userController = require('../controllers/userController');
const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const { passwordChangeSchema } = require('../middleware/validation/schemas/userSchemas');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

const router = express.Router();

router.post(
  '/login',
  UserAuthMiddleware.checkIfAlreadyAuthenticated(),
  // ValidationMiddleware.validate(ValidationMiddleware.schemas?.login || {}),
  userController.login
);

router.get('/me', userController.me);
router.get(
  '/profile',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  userController.profile
);

router.patch(
  '/password',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  ValidationMiddleware.validate(passwordChangeSchema),
  userController.changePassword
);

module.exports = router;
