const questionRepository = require('../repositories/questionRepository');

class QuestionService {
  async getActiveQuestions() {
    return await questionRepository.getActiveQuestions();
  }

  async getAllQuestions() {
    return await questionRepository.getAllQuestions();
  }
}

module.exports = new QuestionService();
