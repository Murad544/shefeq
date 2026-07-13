const express = require('express');
const syncController = require('../controllers/syncController');
const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const {
  startLevelRunSchema,
  finishLevelRunSchema,
} = require('../middleware/validation/schemas/syncSchema');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

const router = express.Router();

router.use(UserAuthMiddleware.securityHeaders);

router.get(
  '/get-all',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB, CLIENT_TYPES.GAME],
  }),
  syncController.getAllLevelData,
);

router.post(
  '/start-level-run',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB, CLIENT_TYPES.GAME],
  }),
  ValidationMiddleware.validate(startLevelRunSchema),
  syncController.startMapRun,
);

router.post(
  '/finish-level-run',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB, CLIENT_TYPES.GAME],
  }),
  ValidationMiddleware.validate(finishLevelRunSchema),
  syncController.finishMapRun,
);

module.exports = router;
