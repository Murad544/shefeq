const express = require('express');
const trainingController = require('../controllers/trainingController');
const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

const router = express.Router();
router.use(UserAuthMiddleware.securityHeaders);

router.get(
  '/modules',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  trainingController.getTrainingModules,
);

router.post(
  '/progress/lessons/:lessonId',
  UserAuthMiddleware.ensureUser({
    allowedClientTypes: [CLIENT_TYPES.WEB],
  }),
  trainingController.setLessonProgress,
);

module.exports = router;
