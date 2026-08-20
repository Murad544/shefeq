const db = require('../config/database');

class UserRepository {
  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  /**
   * Find user along with their application and approval (if any)
   * Returns a single row which contains user fields plus application and approval prefixed fields
   */
  async findUserWithApplicationById(id) {
    const sql = `
      SELECT
        u.id,
        u.email,
        u.role,
        u.is_active,
        u.activated_at,
        u.created_at,
        u.updated_at,
        a.id AS application_id,
        a.name AS application_name,
        a.surname AS application_surname,
        a.father_name AS application_father_name,
        a.date_of_birth AS application_date_of_birth,
        a.phone_number AS application_phone_number,
        a.email AS application_email,
        a.education_level AS application_education_level,
        a.university AS application_university,
        a.profession AS application_profession,
        a.role AS application_role,
        a.skills AS application_skills,
        a.place_of_birth AS application_place_of_birth,
        a.created_at AS application_created_at
      FROM users u
      LEFT JOIN application_approvals ap ON u.id = ap.user_id
      LEFT JOIN applications a ON ap.application_id = a.id
      WHERE u.id = $1
      LIMIT 1
    `;

    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1';
    const { rows } = await db.query(sql, [email]);
    return rows[0] || null;
  }

  async createUser(userData) {
    const sql = `
      INSERT INTO users (email, password_hash, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, role, is_active, created_at
    `;

    const { rows } = await db.query(sql, [
      userData.email,
      userData.password_hash,
      userData.role || 'trainee',
      userData.is_active !== undefined ? userData.is_active : true,
    ]);
    return rows[0];
  }

  async updateUser(id, updates) {
    if (!id || !updates || Object.keys(updates).length === 0) return null;

    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
      }
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    values.push(id);
    const { rows } = await db.query(sql, values);
    return rows[0] || null;
  }

  async activateUser(id) {
    return this.updateUser(id, { is_active: true, activated_at: new Date() });
  }

  async deactivateUser(id) {
    return this.updateUser(id, { is_active: false });
  }

  async updateSessionId(id, sessionId) {
    const sql = 'UPDATE users SET session_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const { rows } = await db.query(sql, [sessionId, id]);
    return rows[0] || null;
  }
}

module.exports = new UserRepository();
