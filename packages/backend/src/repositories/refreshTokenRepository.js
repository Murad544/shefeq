const db = require('../config/database');

class RefreshTokenRepository {
  async create({ userId, tokenHash, clientType = 'game', expiresAt }) {
    const sql = `
      INSERT INTO refresh_tokens (user_id, token_hash, client_type, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(sql, [userId, tokenHash, clientType, expiresAt]);
    return rows[0];
  }

  async findByTokenHash(tokenHash) {
    const sql = `
      SELECT *
      FROM refresh_tokens
      WHERE token_hash = $1
      LIMIT 1
    `;
    const { rows } = await db.query(sql, [tokenHash]);
    return rows[0] || null;
  }

  async markAsUsed(id) {
    const sql = `
      UPDATE refresh_tokens
      SET used_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async revokeByTokenHash(tokenHash) {
    const sql = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1 AND revoked_at IS NULL
      RETURNING *
    `;
    const { rows } = await db.query(sql, [tokenHash]);
    return rows[0] || null;
  }

  async revokeAllForUser(userId) {
    const sql = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE user_id = $1 AND revoked_at IS NULL
      RETURNING *
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows || [];
  }
}

module.exports = new RefreshTokenRepository();
