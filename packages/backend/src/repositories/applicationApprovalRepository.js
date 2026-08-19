const db = require('../config/database');

class ApplicationApprovalRepository {
  async findByApplicationId(applicationId) {
    const sql = 'SELECT * FROM application_approvals WHERE application_id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [applicationId]);
    return rows[0] || null;
  }

  async findByUserId(userId) {
    const sql = 'SELECT * FROM application_approvals WHERE user_id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [userId]);
    return rows[0] || null;
  }

  async findApprovalDetails(applicationId) {
    const sql = 'SELECT * FROM application_approvals_details WHERE application_id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [applicationId]);
    return rows[0] || null;
  }

  async getAllApprovals() {
    const sql = `
      SELECT
        aad.*,
        -- most recent session start time for user
        (
          SELECT gs.session_started_at
          FROM game_sessions gs
          WHERE gs.user_id = aad.user_id
          ORDER BY gs.session_started_at DESC
          LIMIT 1
        ) AS last_session_started_at,
        -- whether user's last session is still open (online)
        COALESCE((
          SELECT (gs.session_ended_at IS NULL
            AND gs.last_heartbeat_at >= NOW() - INTERVAL '2 minutes')
          FROM game_sessions gs
          WHERE gs.user_id = aad.user_id
          ORDER BY gs.session_started_at DESC
          LIMIT 1
        ), false) AS is_online
      FROM application_approvals_details aad
      ORDER BY is_online DESC, last_session_started_at DESC NULLS LAST, aad.accepted_at DESC
    `;
    const { rows } = await db.query(sql);
    return rows;
  }

  async getAllApprovalsBasic() {
    const sql = 'SELECT * FROM application_approvals ORDER BY accepted_at DESC';
    const { rows } = await db.query(sql);
    return rows;
  }

  async searchApprovals(searchTerm = '') {
    if (!searchTerm.trim()) {
      return this.getAllApprovals();
    }

    const term = `%${searchTerm}%`;
    const sql = `
      SELECT
        aad.*,
        (
          SELECT gs.session_started_at
          FROM game_sessions gs
          WHERE gs.user_id = aad.user_id
          ORDER BY gs.session_started_at DESC
          LIMIT 1
        ) AS last_session_started_at,
        COALESCE((
          SELECT (gs.session_ended_at IS NULL
            AND gs.last_heartbeat_at >= NOW() - INTERVAL '2 minutes')
          FROM game_sessions gs
          WHERE gs.user_id = aad.user_id
          ORDER BY gs.session_started_at DESC
          LIMIT 1
        ), false) AS is_online
      FROM application_approvals_details aad
      WHERE aad.name ILIKE $1 OR aad.surname ILIKE $1 OR aad.father_name ILIKE $1
      ORDER BY is_online DESC, last_session_started_at DESC NULLS LAST, aad.accepted_at DESC
    `;
    const { rows } = await db.query(sql, [term]);
    return rows;
  }

  async approveApplication(
    applicationId,
    acceptedBy = null,
    secretKey,
    notes = null,
    activationTokenHash = null,
    activationExpiresAt = null,
  ) {
    const applicationCheckSql = 'SELECT id FROM applications WHERE id = $1 AND deleted_at IS NULL';
    const { rows: applicationRows } = await db.query(applicationCheckSql, [applicationId]);

    if (applicationRows.length === 0) {
      throw new Error('Application does not exist or is deleted');
    }

    const existingApproval = await this.findByApplicationId(applicationId);
    if (existingApproval) {
      throw new Error('Application is already approved');
    }

    const sql = `
      INSERT INTO application_approvals (
        application_id, accepted_by, secret_key, notes, activation_token_hash, activation_expires_at, accepted_at, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
      RETURNING application_id, accepted_at, accepted_by, secret_key, notes, activation_token_hash, activation_expires_at
    `;

    const { rows } = await db.query(sql, [
      applicationId,
      acceptedBy,
      secretKey,
      notes,
      activationTokenHash,
      activationExpiresAt,
    ]);
    return rows[0];
  }

  async findByActivationTokenHash(tokenHash) {
    const sql = 'SELECT * FROM application_approvals WHERE activation_token_hash = $1 LIMIT 1';
    const { rows } = await db.query(sql, [tokenHash]);
    return rows[0] || null;
  }

  async markActivationUsed(applicationId, userId) {
    const sql = `
      UPDATE application_approvals
      SET activation_used_at = NOW(), user_id = $1, updated_at = NOW()
      WHERE application_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(sql, [userId, applicationId]);
    return rows[0] || null;
  }

  async resendActivation(applicationId, newTokenHash, newExpiresAt) {
    const sql = `
      UPDATE application_approvals
      SET activation_token_hash = $1, activation_expires_at = $2, activation_used_at = NULL, updated_at = NOW()
      WHERE application_id = $3
      RETURNING *
    `;
    const { rows } = await db.query(sql, [newTokenHash, newExpiresAt, applicationId]);
    return rows[0] || null;
  }

  async removeApproval(applicationId) {
    try {
      const existingApproval = await this.findByApplicationId(applicationId);
      if (!existingApproval) {
        throw new Error('Application is not approved');
      }

      const sql = 'DELETE FROM application_approvals WHERE application_id = $1 RETURNING *';
      await db.query(sql, [applicationId]);
      return true;
    } catch (error) {
      throw new Error('Application approval can not be removed');
    }
  }

  async isApplicationApproved(applicationId) {
    const approval = await this.findByApplicationId(applicationId);
    return !!approval;
  }

  async linkUserToApplication(applicationId, userId) {
    const sql = `
      UPDATE application_approvals 
      SET user_id = $1, updated_at = NOW()
      WHERE application_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(sql, [userId, applicationId]);
    return rows[0] || null;
  }
}

module.exports = new ApplicationApprovalRepository();
