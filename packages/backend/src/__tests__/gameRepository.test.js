jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const db = require('../config/database');
const gameRepository = require('../repositories/gameRepository');

describe('GameRepository - Session and Heartbeat Timeout Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateHeartbeat', () => {
    it('executes UPDATE query checking timeout and session_ended_at IS NULL', async () => {
      const mockSession = {
        id: 'session-1',
        user_id: 'user-1',
        last_heartbeat_at: new Date(),
      };
      db.query.mockResolvedValue({ rows: [mockSession] });

      const result = await gameRepository.updateHeartbeat({
        sessionId: 'session-1',
        timeoutSeconds: 90,
      });

      expect(db.query).toHaveBeenCalledTimes(1);
      const [sql, params] = db.query.mock.calls[0];
      expect(sql).toContain('UPDATE game_sessions');
      expect(sql).toContain('SET last_heartbeat_at = NOW()');
      expect(sql).toContain('session_ended_at IS NULL');
      expect(sql).toContain("INTERVAL '1 second'");
      expect(params).toEqual(['session-1', 90]);
      expect(result).toEqual(mockSession);
    });

    it('returns null when query returns no rows (e.g. expired or ended)', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await gameRepository.updateHeartbeat({
        sessionId: 'session-expired',
        timeoutSeconds: 90,
      });

      expect(result).toBeNull();
    });
  });

  describe('endInactiveSessions', () => {
    it('executes UPDATE query ending all sessions inactive past timeout', async () => {
      const mockEndedSessions = [
        {
          id: 'session-1',
          user_id: 'user-1',
          session_started_at: new Date(Date.now() - 300000),
          session_ended_at: new Date(Date.now() - 100000),
          duration_seconds: 200,
          end_reason: 'timeout',
        },
      ];
      db.query.mockResolvedValue({ rows: mockEndedSessions });

      const result = await gameRepository.endInactiveSessions(90);

      expect(db.query).toHaveBeenCalledTimes(1);
      const [sql, params] = db.query.mock.calls[0];
      expect(sql).toContain('UPDATE game_sessions');
      expect(sql).toContain("end_reason = 'timeout'");
      expect(sql).toContain('session_ended_at IS NULL');
      expect(params).toEqual([90]);
      expect(result).toEqual(mockEndedSessions);
    });

    it('returns empty array if no sessions were inactive', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await gameRepository.endInactiveSessions(90);

      expect(result).toEqual([]);
    });
  });

  describe('endUserActiveSessions', () => {
    it('ends any active session for a specific user', async () => {
      const mockEndedSessions = [
        {
          id: 'session-prev',
          user_id: 'user-1',
          duration_seconds: 120,
        },
      ];
      db.query.mockResolvedValue({ rows: mockEndedSessions });

      const result = await gameRepository.endUserActiveSessions({
        userId: 'user-1',
        endReason: 'disconnect',
      });

      expect(db.query).toHaveBeenCalledTimes(1);
      const [sql, params] = db.query.mock.calls[0];
      expect(sql).toContain('UPDATE game_sessions');
      expect(sql).toContain('user_id = $1 AND session_ended_at IS NULL');
      expect(params).toEqual(['user-1', 'disconnect']);
      expect(result).toEqual(mockEndedSessions);
    });
  });
});
