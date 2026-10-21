const { ErrorHandler } = require('../middleware/error/errorMiddleware');
const { sendSuccess } = require('../utils/responseHelper');
const syncService = require('../services/syncService');

class SyncController {
  getAllLevelData = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const levels = await syncService.getAllLevelData(userId);
    sendSuccess(res, { levels }, 'Level data retrieved successfully');
  });

  startMapRun = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const mapRun = await syncService.startMapRun(userId, req.body);
    sendSuccess(
      res,
      {
        run: {
          id: mapRun.id,
        },
      },
      'Map run initiated successfully',
    );
  });

  finishMapRun = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const result = await syncService.finishMapRun(userId, req.body);
    sendSuccess(
      res,
      {
        run: result.run,
        personalBest: result.personalBest,
        isNewPersonalBest: result.isNewPersonalBest,
      },
      'Run finished',
    );
  });

  getPersonalBest = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const { mapCode } = req.query;
    const personalBest = await syncService.getPersonalBest(userId, mapCode);
    sendSuccess(
      res,
      {
        personalBest,
      },
      'Personal best retrieved successfully',
    );
  });

  getAllPersonalBests = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const items = await syncService.getAllPersonalBests(userId);
    sendSuccess(
      res,
      {
        items,
      },
      'Personal bests retrieved successfully',
    );
  });
}

module.exports = new SyncController();
