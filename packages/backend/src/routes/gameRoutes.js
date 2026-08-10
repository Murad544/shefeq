const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const {
  stopGameSessionSchema,
  heartbeatGameSessionSchema,
} = require('../middleware/validation/schemas/gameSchema');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

router.use(UserAuthMiddleware.securityHeaders);

router.post(
  '/session/start',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.GAME],
  }),
  gameController.startGameSession
);
router.post(
  '/session/heartbeat',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.GAME],
  }),
  ValidationMiddleware.validate(heartbeatGameSessionSchema),
  gameController.heartbeatGameSession
);
router.post(
  '/session/end',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.GAME],
  }),
  ValidationMiddleware.validate(stopGameSessionSchema),
  gameController.endGameSession
);

router.get(
  '/session/list',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  gameController.listGameSessions
);

router.get(
  '/stats/maps',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  gameController.getMapStats
);

router.get('/leaderboard', gameController.getLeaderboard);

router.get(
  '/streak',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  gameController.getUserStreak
);

module.exports = router;
