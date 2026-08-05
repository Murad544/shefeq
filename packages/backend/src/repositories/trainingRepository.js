const db = require('../config/database');

class TrainingRepository {
  async getAllModulesWithLessons(userId) {
    const sql = `
      SELECT
        m.id AS module_id,
        m.title AS module_title,
        m.description AS module_description,
        m.sort_order AS module_sort_order,
        l.id AS lesson_id,
        l.title AS lesson_title,
        l.type AS lesson_type,
        l.link AS lesson_link,
        l.sort_order AS lesson_sort_order,
        COALESCE(utp.completed, false) AS completed
      FROM training_modules m
      LEFT JOIN training_lessons l ON l.module_id = m.id
      LEFT JOIN user_training_progress utp
        ON utp.lesson_id = l.id AND utp.user_id = $1
      ORDER BY m.sort_order, l.sort_order;
    `;

    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findLessonById(lessonId) {
    const sql = 'SELECT id, module_id FROM training_lessons WHERE id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [lessonId]);
    return rows[0] || null;
  }

  async upsertLessonProgress(userId, lessonId, completed) {
    const sql = `
      INSERT INTO user_training_progress (user_id, lesson_id, completed, completed_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET completed = EXCLUDED.completed, completed_at = NOW()
      RETURNING lesson_id, completed;
    `;
    const { rows } = await db.query(sql, [userId, lessonId, completed]);
    return rows[0];
  }
}

module.exports = new TrainingRepository();
