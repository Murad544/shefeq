const questionService = require('../services/questionService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler } = require('../middleware/error/errorMiddleware');

class QuestionController {
  getActiveQuestions = ErrorHandler.asyncWrapper(async (req, res) => {
    const questions = await questionService.getActiveQuestions();
    sendSuccess(res, { questions }, 'Questions retrieved successfully');
  });
}

module.exports = new QuestionController();
