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
    sendSuccess(res, { mapRun }, 'Map run initiated successfully');
  });

  finishMapRun = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const mapRun = await syncService.finishMapRun(userId, req.body);
    sendSuccess(res, { mapRun }, 'Map run finished successfully');
  });
}

module.exports = new SyncController();
