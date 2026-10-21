const db = require('../config/database');

class SyncRepository {
  async getAllMapsForUser(userId) {
    const sql = `
      SELECT
        m.id AS map_id,
        m.code,
        m.name,
        m.description,
        m.required_orb_count,
        m.order_index,
        m.difficulty,
        m.duration_minutes,
        m.image_url,
        m.created_at AS map_created_at,
        mr.id AS run_id,
        mr.game_session_id,
        mr.run_started_at,
        mr.run_ended_at,
        mr.objective_time_seconds,
        mr.collected_orbs,
        mr.completed,
        mr.end_reason,
        mr.created_at AS run_created_at
      FROM maps m
      LEFT JOIN LATERAL (
        SELECT *
        FROM map_runs
        WHERE user_id = $1
          AND map_id = m.id
        ORDER BY run_started_at DESC NULLS LAST, created_at DESC
        LIMIT 1
      ) mr ON TRUE
      WHERE m.is_active = true
      ORDER BY m.order_index ASC NULLS LAST, m.code;
    `;

    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findMapByCode(code) {
    const sql = `SELECT id, code, name FROM maps WHERE code = $1 LIMIT 1`;
    const { rows } = await db.query(sql, [code]);
    return rows[0] || null;
  }

  async findMapById(id) {
    const sql = `SELECT id, code, name FROM maps WHERE id = $1 LIMIT 1`;
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async findMapRunByIdForUser(runId, userId) {
    const sql = `SELECT * FROM map_runs WHERE id = $1 AND user_id = $2 LIMIT 1`;
    const { rows } = await db.query(sql, [runId, userId]);
    return rows[0] || null;
  }

  async findGameSessionByIdForUser(sessionId, userId) {
    const sql = `SELECT id FROM game_sessions WHERE id = $1 AND user_id = $2 LIMIT 1`;
    const { rows } = await db.query(sql, [sessionId, userId]);
    return rows[0] || null;
  }

  async insertMapRun(userId, mapId, payload) {
    const baseColumns = [
      'user_id',
      'map_id',
      'game_session_id',
      'objective_time_seconds',
      'time_ms',
      'collected_orbs',
      'completed',
      'end_reason',
    ];
    const values = [
      userId,
      mapId,
      payload.gameSessionId || payload.sessionId || null,
      payload.objectiveTimeSeconds ?? null,
      payload.timeMs ?? null,
      payload.collectedOrbs ?? 0,
      payload.completed ?? false,
      payload.endReason ?? null,
    ];

    if (payload.runId) {
      baseColumns.unshift('id');
      values.unshift(payload.runId);
    }

    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const sql = `
      INSERT INTO map_runs (${baseColumns.join(', ')})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const { rows } = await db.query(sql, values);
    return rows[0] || null;
  }

  async updateMapRunById(runId, userId, payload, options = {}) {
    const fields = [];
    const values = [];

    const sessionId = payload.sessionId || payload.gameSessionId;
    if (sessionId !== undefined) {
      values.push(sessionId);
      fields.push(`game_session_id = $${values.length}`);
    }
    if ('timeMs' in payload && payload.timeMs !== undefined) {
      values.push(payload.timeMs);
      fields.push(`time_ms = $${values.length}`);
    }
    if ('objectiveTimeSeconds' in payload && payload.objectiveTimeSeconds !== undefined) {
      values.push(payload.objectiveTimeSeconds);
      fields.push(`objective_time_seconds = $${values.length}`);
    }
    if ('collectedOrbs' in payload && payload.collectedOrbs !== undefined) {
      values.push(payload.collectedOrbs);
      fields.push(`collected_orbs = $${values.length}`);
    }
    if ('completed' in payload && payload.completed !== undefined) {
      values.push(payload.completed);
      fields.push(`completed = $${values.length}`);
    }
    if ('endReason' in payload && payload.endReason !== undefined) {
      values.push(payload.endReason);
      fields.push(`end_reason = $${values.length}`);
    }
    if ('mapId' in payload && payload.mapId !== undefined) {
      values.push(payload.mapId);
      fields.push(`map_id = $${values.length}`);
    }
    if (options.setEndedAt) {
      fields.push('run_ended_at = NOW()');
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(runId, userId);
    const sql = `
      UPDATE map_runs
      SET ${fields.join(', ')}
      WHERE id = $${values.length - 1}
        AND user_id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await db.query(sql, values);
    return rows[0] || null;
  }

  async getPersonalBestForUserAndMap(userId, mapId) {
    const sql = `
      SELECT id, time_ms, objective_time_seconds, run_ended_at, created_at
      FROM map_runs
      WHERE user_id = $1
        AND map_id = $2
        AND completed = true
        AND (time_ms IS NOT NULL OR objective_time_seconds IS NOT NULL)
      ORDER BY COALESCE(time_ms, objective_time_seconds * 1000) ASC, run_ended_at ASC
      LIMIT 1;
    `;
    const { rows } = await db.query(sql, [userId, mapId]);
    return rows[0] || null;
  }

  async getPreviousBestExcludingRun(userId, mapId, runId) {
    const sql = `
      SELECT id, time_ms, objective_time_seconds, run_ended_at, created_at
      FROM map_runs
      WHERE user_id = $1
        AND map_id = $2
        AND completed = true
        AND id != $3
        AND (time_ms IS NOT NULL OR objective_time_seconds IS NOT NULL)
      ORDER BY COALESCE(time_ms, objective_time_seconds * 1000) ASC, run_ended_at ASC
      LIMIT 1;
    `;
    const { rows } = await db.query(sql, [userId, mapId, runId]);
    return rows[0] || null;
  }

  async getAllPersonalBestsForUser(userId) {
    const sql = `
      SELECT
        m.code AS map_code,
        MIN(COALESCE(mr.time_ms, mr.objective_time_seconds * 1000)) AS best_time_ms
      FROM maps m
      INNER JOIN map_runs mr ON mr.map_id = m.id
      WHERE mr.user_id = $1
        AND mr.completed = true
        AND (mr.time_ms IS NOT NULL OR mr.objective_time_seconds IS NOT NULL)
      GROUP BY m.id, m.code
      ORDER BY m.code;
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows || [];
  }
}

module.exports = new SyncRepository();
