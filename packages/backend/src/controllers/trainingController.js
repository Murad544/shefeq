const trainingService = require('../services/trainingService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler, AppError } = require('../middleware/error/errorMiddleware');

class TrainingController {
  getTrainingModules = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) {
      throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
    }

    const modules = await trainingService.getTrainingModules(userId);
    sendSuccess(res, { modules }, 'Training modules retrieved successfully');
  });

  setLessonProgress = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) {
      throw AppError.unauthorized('Authorization token required', 'NO_TOKEN');
    }

    const lessonId = Number(req.params.lessonId);
    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      throw AppError.badRequest('Invalid lessonId parameter');
    }

    const { completed = true } = req.body;
    const normalizedCompleted = completed === true || completed === 'true';

    const result = await trainingService.markLessonCompletion(
      userId,
      lessonId,
      normalizedCompleted
    );

    sendSuccess(res, result, 'Lesson progress updated successfully');
  });
}

module.exports = new TrainingController();
