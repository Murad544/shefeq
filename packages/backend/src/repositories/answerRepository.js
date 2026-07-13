const db = require('../config/database');

class AnswerRepository {
  async getAnswersByApplicationId(applicationId) {
    const sql = `
      SELECT a.id as answer_id, a.question_id, q.text, a.answer
      FROM answers a
      JOIN questions q ON q.id = a.question_id
      WHERE a.application_id = $1
      ORDER BY a.id ASC
    `;
    const { rows } = await db.query(sql, [applicationId]);
    return rows;
  }

  async createAnswers(client, applicationId, answers) {
    if (!answers?.length) return;

    const values = answers.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',');
    const params = [applicationId, ...answers.flatMap((a) => [a.question_id, a.answer])];
    const sql = `INSERT INTO answers (application_id, question_id, answer) VALUES ${values}`;

    await client.query(sql, params);
  }
}

module.exports = new AnswerRepository();
