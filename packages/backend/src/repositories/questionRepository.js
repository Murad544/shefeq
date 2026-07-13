const db = require('../config/database');

class QuestionRepository {
  async getActiveQuestions() {
    const sql =
      'SELECT id, position, text FROM questions WHERE active = TRUE ORDER BY position ASC';
    const { rows } = await db.query(sql);
    return rows;
  }

  async getAllQuestions() {
    const sql = 'SELECT id, position, text, active FROM questions ORDER BY position ASC';
    const { rows } = await db.query(sql);
    return rows;
  }
}

module.exports = new QuestionRepository();
