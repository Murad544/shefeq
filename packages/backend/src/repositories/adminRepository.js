const db = require('../config/database');

class AdminRepository {
  async findByEmail(email) {
    const sql = 'SELECT id, email, password_hash, name, role, is_active FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1';
    const { rows } = await db.query(sql, [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const sql = 'SELECT id, email, name, is_active, role, last_login_at, created_at FROM admins WHERE id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async getAllAdmins() {
    const sql = 'SELECT id, email, name, is_active, role, last_login_at, created_at FROM admins ORDER BY id ASC';
    const { rows } = await db.query(sql);
    return rows;
  }

  async createAdmin(adminData) {
    const sql = `
      INSERT INTO admins (email, password_hash, name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
      RETURNING id, email, name, role, is_active, created_at
    `;
    const { rows } = await db.query(sql, [
      adminData.email,
      adminData.password_hash,
      adminData.name,
      adminData.role,
    ]);
    return rows[0];
  }

  async updateLastLogin(id) {
    const sql = 'UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1';
    await db.query(sql, [id]);
  }

  async updateLogoutTimestamp(id) {
    const sql = 'UPDATE admins SET last_logout_at = NOW(), updated_at = NOW() WHERE id = $1';
    await db.query(sql, [id]);
  }

  async updateAdmin(id, data) {
    if (!id || !data || Object.keys(data).length === 0) return;
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in data) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }
    const sql = `UPDATE admins SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index}`;
    values.push(id);
    await db.query(sql, values);
  }
}

module.exports = new AdminRepository();
