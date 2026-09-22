jest.mock('../repositories/gameRepository', () => ({
  startSession: jest.fn(),
  updateHeartbeat: jest.fn(),
  endSession: jest.fn(),
  endInactiveSessions: jest.fn(),
  endUserActiveSessions: jest.fn(),
  listGameSessions: jest.fn(),
}));

jest.mock('../services/adminService', () => ({
  searchApprovals: jest.fn(),
}));

jest.mock('../utils/realtime', () => ({
  broadcastSessions: jest.fn(),
  broadcastApprovedApplications: jest.fn(),
}));

const gameService = require('../services/gameService');
const gameRepository = require('../repositories/gameRepository');
const adminService = require('../services/adminService');
const realtimeManager = require('../utils/realtime');
const sessionCleanupWorker = require('../workers/sessionCleanupWorker');

describe('Game Session Heartbeat Timeout and Inactive Session Cleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gameService.startSession', () => {
    it('ends any previous active sessions for the user before starting a new session', async () => {
      const userId = 'user-123';
      gameRepository.endUserActiveSessions.mockResolvedValue([
        { id: 'old-session-1', user_id: userId, duration_seconds: 120 },
      ]);
      gameRepository.startSession.mockResolvedValue({
        id: 'new-session-1',
        user_id: userId,
        session_started_at: new Date().toISOString(),
      });

      const session = await gameService.startSession({ userId });

      expect(gameRepository.endUserActiveSessions).toHaveBeenCalledWith({
        userId,
        endReason: 'disconnect',
      });
      expect(gameRepository.startSession).toHaveBeenCalledWith({ userId });
      expect(session.id).toBe('new-session-1');
    });
  });

  describe('gameService.updateHeartbeat', () => {
    it('successfully updates heartbeat when session is within timeout window', async () => {
      const sessionId = 'session-123';
      const mockSession = {
        id: sessionId,
        user_id: 'user-123',
        last_heartbeat_at: new Date().toISOString(),
      };
      gameRepository.updateHeartbeat.mockResolvedValue(mockSession);

      const result = await gameService.updateHeartbeat({ sessionId });

      expect(gameRepository.updateHeartbeat).toHaveBeenCalledWith({
        sessionId,
        timeoutSeconds: 90,
      });
      expect(result).toEqual(mockSession);
    });

    it('triggers inactive session cleanup and throws 404 when session heartbeat is expired or not found', async () => {
      const sessionId = 'session-expired';
      gameRepository.updateHeartbeat.mockResolvedValue(null);
      gameRepository.endInactiveSessions.mockResolvedValue([]);

      await expect(gameService.updateHeartbeat({ sessionId })).rejects.toMatchObject({
        statusCode: 404,
        code: 'SESSION_NOT_FOUND',
      });

      expect(gameRepository.endInactiveSessions).toHaveBeenCalledWith(90);
    });
  });

  describe('gameService.endInactiveSessions', () => {
    it('broadcasts real-time updates when inactive sessions are ended', async () => {
      const mockEndedSessions = [
        { id: 's1', user_id: 'user-1', end_reason: 'timeout', duration_seconds: 90 },
        { id: 's2', user_id: 'user-2', end_reason: 'timeout', duration_seconds: 180 },
        { id: 's3', user_id: 'user-1', end_reason: 'timeout', duration_seconds: 60 },
      ];
      gameRepository.endInactiveSessions.mockResolvedValue(mockEndedSessions);
      gameRepository.listGameSessions.mockResolvedValue([{ id: 's1' }]);
      adminService.searchApprovals.mockResolvedValue([{ id: 'app-1', is_online: false }]);

      const result = await gameService.endInactiveSessions(90);

      expect(result).toEqual(mockEndedSessions);
      expect(gameRepository.endInactiveSessions).toHaveBeenCalledWith(90);

      // Should broadcast to each unique user
      expect(gameRepository.listGameSessions).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(gameRepository.listGameSessions).toHaveBeenCalledWith({ userId: 'user-2' });
      expect(realtimeManager.broadcastSessions).toHaveBeenCalledTimes(2);

      // Should broadcast approved applications list once to admins
      expect(adminService.searchApprovals).toHaveBeenCalledWith('');
      expect(realtimeManager.broadcastApprovedApplications).toHaveBeenCalledTimes(1);
    });

    it('does not broadcast when no inactive sessions were ended', async () => {
      gameRepository.endInactiveSessions.mockResolvedValue([]);

      const result = await gameService.endInactiveSessions(90);

      expect(result).toEqual([]);
      expect(realtimeManager.broadcastSessions).not.toHaveBeenCalled();
      expect(realtimeManager.broadcastApprovedApplications).not.toHaveBeenCalled();
    });
  });

  describe('sessionCleanupWorker', () => {
    beforeEach(() => {
      sessionCleanupWorker.stop();
    });

    afterEach(() => {
      sessionCleanupWorker.stop();
    });

    it('starts worker, runs initial cleanup, and stops cleanly', async () => {
      const spyEndInactive = jest.spyOn(gameService, 'endInactiveSessions').mockResolvedValue([]);

      sessionCleanupWorker.start(50, 90);
      expect(sessionCleanupWorker.intervalId).not.toBeNull();
      expect(spyEndInactive).toHaveBeenCalledWith(90);

      sessionCleanupWorker.stop();
      expect(sessionCleanupWorker.intervalId).toBeNull();
    });

    it('handles cleanup errors gracefully without throwing', async () => {
      jest.spyOn(gameService, 'endInactiveSessions').mockRejectedValue(new Error('DB error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await sessionCleanupWorker.runCleanup();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
