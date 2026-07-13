const db = require('../config/database');

class ApplicationRepository {
  async findById(id) {
    const sql = 'SELECT * FROM applications WHERE id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = 'SELECT * FROM applications WHERE email = $1 LIMIT 1';
    const { rows } = await db.query(sql, [email]);
    return rows[0] || null;
  }

  async findByUserId(userId) {
    const sql = `
      SELECT a.*
      FROM applications a
      JOIN application_approvals ap ON ap.application_id = a.id
      WHERE ap.user_id = $1
      LIMIT 1
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows[0] || null;
  }

  async updateApplication(id, updates) {
    if (!id || !updates || Object.keys(updates).length === 0) return null;

    const fields = [];
    const values = [];
    let index = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index += 1;
    });

    const sql = `UPDATE applications SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    values.push(id);
    const { rows } = await db.query(sql, values);
    return rows[0] || null;
  }

  async findByNationalId(nationalId) {
    const sql = 'SELECT * FROM applications WHERE national_id_num = $1 LIMIT 1';
    const { rows } = await db.query(sql, [nationalId]);
    return rows[0] || null;
  }

  async searchApplications(searchTerm = '', options = {}) {
    let sql = `
    SELECT
      a.*,
      (
        SELECT COALESCE(SUM(gs.duration_seconds), 0)
        FROM application_approvals ap
        JOIN game_sessions gs ON gs.user_id = ap.user_id
        WHERE ap.application_id = a.id
      ) AS total_duration_seconds
    FROM applications a
    WHERE a.deleted_at IS NULL
  `;

    const params = [];

    if (searchTerm.trim()) {
      params.push(`%${searchTerm}%`);
      sql += `
      AND (a.name ILIKE $1 OR a.surname ILIKE $1 OR a.father_name ILIKE $1)
    `;
    }

    sql += ` ORDER BY a.created_at DESC`;

    const { rows } = await db.query(sql, params);
    return rows;
  }

  async createApplication(client, applicationData) {
    const sql = `
      INSERT INTO applications (
        name, surname, father_name, date_of_birth, sex, place_of_birth,
        national_serial_num, national_id_num, phone_number, email,
        education_level, university, profession, skills,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()
      )
      RETURNING id, created_at
    `;

    const params = [
      applicationData.name,
      applicationData.surname,
      applicationData.fatherName,
      applicationData.dateOfBirth,
      applicationData.sex,
      applicationData.placeOfBirth,
      applicationData.nationalSerialNumber,
      applicationData.nationalIdNumber,
      applicationData.phoneNumber,
      applicationData.email,
      applicationData.educationLevel,
      applicationData.university,
      applicationData.profession,
      applicationData.skills || [],
    ];

    const { rows } = await client.query(sql, params);
    return rows[0];
  }
}

module.exports = new ApplicationRepository();
