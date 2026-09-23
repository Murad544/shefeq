const db = require('../config/database');

class GameRepository {
  async startSession({ userId }) {
    const sql = 'INSERT INTO game_sessions (user_id) VALUES($1) RETURNING *';
    const { rows } = await db.query(sql, [userId]);
    return rows[0] || null;
  }

  async updateHeartbeat({ sessionId, timeoutSeconds = 90 }) {
    const sql = `UPDATE game_sessions
      SET last_heartbeat_at = NOW()
      WHERE id = $1 
        AND session_ended_at IS NULL
        AND COALESCE(last_heartbeat_at, session_started_at) >= NOW() - ($2 * INTERVAL '1 second')
      RETURNING id, user_id, session_started_at, session_ended_at, duration_seconds, end_reason, created_at`;
    const { rows } = await db.query(sql, [sessionId, timeoutSeconds]);
    return rows[0] || null;
  }

  async endInactiveSessions(timeoutSeconds = 90) {
    const sql = `UPDATE game_sessions
      SET 
        session_ended_at = COALESCE(last_heartbeat_at, NOW()),
        duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM (COALESCE(last_heartbeat_at, NOW()) - session_started_at))::INT),
        end_reason = 'timeout'
      WHERE 
        session_ended_at IS NULL
        AND COALESCE(last_heartbeat_at, session_started_at) < NOW() - ($1 * INTERVAL '1 second')
      RETURNING id, user_id, session_started_at, session_ended_at, duration_seconds, end_reason`;
    const { rows } = await db.query(sql, [timeoutSeconds]);
    return rows || [];
  }

  async endUserActiveSessions({ userId, endReason = 'disconnect' }) {
    const sql = `UPDATE game_sessions
      SET 
        session_ended_at = COALESCE(last_heartbeat_at, NOW()),
        duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM (COALESCE(last_heartbeat_at, NOW()) - session_started_at))::INT),
        end_reason = $2
      WHERE 
        user_id = $1 AND session_ended_at IS NULL
      RETURNING id, user_id, duration_seconds`;
    const { rows } = await db.query(sql, [userId, endReason]);
    return rows || [];
  }

  async endSession({ sessionId, endReason }) {
    const sql = `UPDATE game_sessions
    SET 
        session_ended_at  = NOW(),
        duration_seconds = EXTRACT(EPOCH FROM (NOW() - session_started_at))::INT,
        end_reason = $2
    WHERE
        id = $1 AND session_ended_at IS NULL
    RETURNING id, user_id, duration_seconds`;
    const { rows } = await db.query(sql, [sessionId, endReason]);
    return rows[0] || null;
  }

  async listGameSessions({ userId }) {
    const sql = `SELECT id, session_started_at, session_ended_at, last_heartbeat_at, duration_seconds, end_reason, created_at
                 FROM game_sessions gs
                 WHERE gs.user_id = $1
                 ORDER BY session_started_at DESC`;
    const { rows } = await db.query(sql, [userId]);
    return rows || null;
  }

  async getUserMapStats({ userId }) {
    const sql = `
      SELECT 
        m.id as map_id,
        m.name as map_name,
        m.code as map_code,
        m.required_orb_count,
        (SELECT objective_time_seconds FROM map_runs 
         WHERE map_id = m.id AND user_id = $1 AND completed = true 
         ORDER BY objective_time_seconds ASC NULLS LAST 
         LIMIT 1) as objective_time_seconds,
        COUNT(mr.id) as times_played,
        MIN(EXTRACT(EPOCH FROM (mr.run_ended_at - mr.run_started_at))) as best_time_seconds
      FROM maps m
      LEFT JOIN map_runs mr ON m.id = mr.map_id AND mr.user_id = $1 AND mr.completed = true
      GROUP BY m.id, m.name, m.code, m.required_orb_count
      ORDER BY m.id
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows || [];
  }

  // Get top leaders overall (by best time across all maps)
  async getTopLeaders(limit = 10) {
    const sql = `
      SELECT 
        u.id as user_id,
        COALESCE(a.name || ' ' || a.surname, u.email) as name,
        MIN(mr.objective_time_seconds) as best_time_seconds
      FROM users u
      LEFT JOIN application_approvals aa ON u.id = aa.user_id
      LEFT JOIN applications a ON aa.application_id = a.id
      INNER JOIN map_runs mr ON u.id = mr.user_id AND mr.completed = true
      GROUP BY u.id, a.name, a.surname, u.email
      HAVING MIN(mr.objective_time_seconds) IS NOT NULL
      ORDER BY MIN(mr.objective_time_seconds) ASC
      LIMIT $1
    `;
    const { rows } = await db.query(sql, [limit]);
    return rows || [];
  }

  // Get top leaders for a specific map
  async getTopLeadersByMap(mapId, limit = 10) {
    const sql = `
      SELECT 
        u.id as user_id,
        COALESCE(a.name || ' ' || a.surname, u.email) as name,
        m.name as map_name,
        mr.objective_time_seconds as time_seconds,
        ROW_NUMBER() OVER (ORDER BY mr.objective_time_seconds ASC) as rank
      FROM users u
      LEFT JOIN application_approvals aa ON u.id = aa.user_id
      LEFT JOIN applications a ON aa.application_id = a.id
      INNER JOIN map_runs mr ON u.id = mr.user_id AND mr.completed = true
      INNER JOIN maps m ON mr.map_id = m.id
      WHERE mr.map_id = $1 AND mr.objective_time_seconds IS NOT NULL
      ORDER BY mr.objective_time_seconds ASC
      LIMIT $2
    `;
    const { rows } = await db.query(sql, [mapId, limit]);
    return rows || [];
  }

  // Get all maps with their top leaders
  async getAllMapsWithLeaders(limit = 5) {
    // First get all maps
    const mapsSQL = 'SELECT id, name, code FROM maps ORDER BY name';
    const { rows: maps } = await db.query(mapsSQL);

    // For each map, get top leaders
    const result = [];
    for (const map of maps) {
      const leadersSQL = `
        SELECT 
          u.id as user_id,
          COALESCE(a.name || ' ' || a.surname, u.email) as name,
          mr.objective_time_seconds as time_seconds
        FROM users u
        LEFT JOIN application_approvals aa ON u.id = aa.user_id
        LEFT JOIN applications a ON aa.application_id = a.id
        INNER JOIN map_runs mr ON u.id = mr.user_id AND mr.completed = true
        WHERE mr.map_id = $1 AND mr.objective_time_seconds IS NOT NULL
        ORDER BY mr.objective_time_seconds ASC
        LIMIT $2
      `;
      const { rows: leaders } = await db.query(leadersSQL, [map.id, limit]);

      result.push({
        map_id: map.id,
        map_name: map.name,
        map_code: map.code,
        leaders: leaders || [],
      });
    }

    return result;
  }

  // Calculate user's current and best streak
  async getUserStreak(userId) {
    // Get all dates the user completed at least one map run
    const datesSQL = `
      SELECT DISTINCT DATE(run_ended_at AT TIME ZONE 'UTC') as play_date
      FROM map_runs
      WHERE user_id = $1 AND completed = true AND run_ended_at IS NOT NULL
      ORDER BY play_date DESC
    `;

    const { rows: dates } = await db.query(datesSQL, [userId]);

    if (dates.length === 0) {
      return {
        current_streak: 0,
        best_streak: 0,
        last_play_date: null,
        note: 'Hələ oynama yoxdur',
      };
    }

    // Calculate current streak (consecutive days from today going backward)
    let currentStreak = 0;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const playDate = new Date(dates[i].play_date);
      playDate.setUTCHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (playDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i - 1].play_date);
      const prevDate = new Date(dates[i].play_date);

      currentDate.setUTCHours(0, 0, 0, 0);
      prevDate.setUTCHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const lastPlayDate = dates[0].play_date;
    const lastPlayString = new Date(lastPlayDate).toLocaleDateString('az-AZ');

    let note = '';
    if (currentStreak === 0) {
      note = `Axırıncı oyun: ${lastPlayString}`;
    } else if (currentStreak === 1) {
      note = 'Bugün oynamısız';
    } else {
      note = `Son ${currentStreak} gündür ardıcıl oynama`;
    }

    return {
      current_streak: currentStreak,
      best_streak: bestStreak,
      last_play_date: lastPlayDate,
      note,
    };
  }

  // Fetch game account data by application ID (user_id)
  async getGameAccountByApplicationId(applicationId) {
    const sql = `
      SELECT gs.id, gs.session_started_at, gs.session_ended_at, gs.last_heartbeat_at, gs.duration_seconds, gs.end_reason, gs.created_at
      FROM game_sessions gs
      INNER JOIN application_approvals aa ON aa.user_id = gs.user_id
      WHERE aa.application_id = $1
      ORDER BY gs.session_started_at DESC
    `;
    const { rows } = await db.query(sql, [applicationId]);
    return { sessions: rows };
  }
}

module.exports = new GameRepository();
