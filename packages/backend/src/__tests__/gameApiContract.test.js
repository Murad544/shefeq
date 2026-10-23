// Mock dependencies
jest.mock('../config/database', () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

jest.mock('../repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updateSessionId: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock('../repositories/gameRepository', () => ({
  startSession: jest.fn(),
  updateHeartbeat: jest.fn(),
  endSession: jest.fn(),
  endInactiveSessions: jest.fn(),
  endUserActiveSessions: jest.fn(),
  listGameSessions: jest.fn(),
  findActiveSessionForUser: jest.fn(),
}));

jest.mock('../repositories/syncRepository', () => ({
  findMapByCode: jest.fn(),
  findMapById: jest.fn(),
  findMapRunByIdForUser: jest.fn(),
  findGameSessionByIdForUser: jest.fn(),
  insertMapRun: jest.fn(),
  updateMapRunById: jest.fn(),
  getPersonalBestForUserAndMap: jest.fn(),
  getPreviousBestExcludingRun: jest.fn(),
  getAllPersonalBestsForUser: jest.fn(),
  getAllMapsForUser: jest.fn(),
}));

jest.mock('../repositories/refreshTokenRepository', () => ({
  create: jest.fn(),
  findByTokenHash: jest.fn(),
  markAsUsed: jest.fn(),
  revokeByTokenHash: jest.fn(),
  revokeAllForUser: jest.fn(),
}));

jest.mock('../services/adminService', () => ({
  searchApprovals: jest.fn().mockResolvedValue([]),
}));

jest.mock('../utils/realtime', () => ({
  broadcastSessions: jest.fn(),
  broadcastApprovedApplications: jest.fn(),
}));

jest.mock('../services/shared/encryptionService', () => ({
  verifyPassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock('../services/shared/jwtService', () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
}));

jest.mock('../services/shared/tokenBlacklistService', () => ({
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
  blacklistToken: jest.fn().mockResolvedValue(true),
}));

const userRepository = require('../repositories/userRepository');
const gameRepository = require('../repositories/gameRepository');
const syncRepository = require('../repositories/syncRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const encryptionService = require('../services/shared/encryptionService');
const jwtService = require('../services/shared/jwtService');

const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const syncController = require('../controllers/syncController');
const gameService = require('../services/gameService');
const syncService = require('../services/syncService');
const userAuthService = require('../services/userAuthService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { AppError, ErrorHandler } = require('../middleware/error/errorMiddleware');
const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Game API Response Contract (Oct 19, 2026)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'pilot@shefeq.az',
    password_hash: 'hashed_password',
    role: 'trainee',
    is_active: true,
  };

  describe('Response Envelope & Error Codes', () => {
    it('sendSuccess produces envelope with success: true, code, message, and data', () => {
      const res = createMockRes();
      sendSuccess(res, { foo: 'bar' }, 'Custom success message', 200, 'OK');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          message: 'Custom success message',
          data: { foo: 'bar' },
          timestamp: expect.any(String),
        }),
      );
    });

    it('sendError produces envelope with success: false, code, message, and data: null', () => {
      const res = createMockRes();
      sendError(res, 'Custom error message', 400, 'VALIDATION_ERROR');

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Custom error message',
          data: null,
          timestamp: expect.any(String),
        }),
      );
    });

    it('ErrorHandler.handleError standardizes 400 to VALIDATION_ERROR and data: null', () => {
      const res = createMockRes();
      const err = AppError.validationError('Field is required', [{ path: 'mapCode', message: 'Required' }]);
      ErrorHandler.handleError(err, {}, res, () => {});

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Field is required',
          data: null,
          details: [{ path: 'mapCode', message: 'Required' }],
        }),
      );
    });

    it('ErrorHandler.handleError standardizes 401 to TOKEN_EXPIRED by default with data: null', () => {
      const res = createMockRes();
      const err = AppError.unauthorized('Invalid bearer token');
      ErrorHandler.handleError(err, {}, res, () => {});

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Invalid bearer token',
          data: null,
        }),
      );
    });

    it('ErrorHandler.handleError standardizes 404 to NOT_FOUND with data: null', () => {
      const res = createMockRes();
      const err = AppError.notFound('Map not found');
      ErrorHandler.handleError(err, {}, res, () => {});

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'NOT_FOUND',
          message: 'Map not found',
          data: null,
        }),
      );
    });

    it('ErrorHandler.handleError standardizes 500 to SERVER_ERROR with data: null', () => {
      const res = createMockRes();
      const err = new Error('Database connection crashed');
      ErrorHandler.handleError(err, {}, res, () => {});

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'SERVER_ERROR',
          message: 'Database connection crashed',
          data: null,
        }),
      );
    });
  });

  describe('POST /api/users/login', () => {
    it('returns token, expiresAt, user {id, email, role}, and session {id}', async () => {
      const req = {
        body: {
          email: 'pilot@shefeq.az',
          password: 'password123',
          clientType: 'game',
        },
      };
      const res = createMockRes();

      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(true);
      jwtService.generateToken.mockReturnValue('jwt-token-game');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser });
      gameRepository.endUserActiveSessions.mockResolvedValue([]);
      gameRepository.startSession.mockResolvedValue({
        id: '22222222-2222-4222-a222-222222222222',
      });

      await userController.login(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          message: 'Login successful',
          data: {
            token: 'jwt-token-game',
            expiresAt: expect.any(String),
            refreshToken: null,
            refreshExpiresAt: null,
            user: {
              id: mockUser.id,
              email: mockUser.email,
              role: 'trainee',
            },
            session: {
              id: expect.any(String),
            },
          },
        }),
      );

      const responsePayload = res.json.mock.calls[0][0];
      expect(responsePayload.data.sessionId).toBeUndefined();
      expect(responsePayload.data.session_id).toBeUndefined();
      expect(responsePayload.data.user.sessionId).toBeUndefined();
      expect(responsePayload.data.user.session_id).toBeUndefined();
    });

    it('returns refreshToken and refreshExpiresAt when rememberMe is true', async () => {
      const req = {
        body: {
          email: 'pilot@shefeq.az',
          password: 'password123',
          clientType: 'game',
          rememberMe: true,
        },
      };
      const res = createMockRes();

      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(true);
      jwtService.generateToken.mockReturnValue('jwt-token-game');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser });
      refreshTokenRepository.create.mockResolvedValue({ id: 'rt-1' });

      await userController.login(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: expect.objectContaining({
            token: 'jwt-token-game',
            refreshToken: expect.any(String),
            refreshExpiresAt: expect.any(String),
            user: expect.objectContaining({ id: mockUser.id }),
            session: expect.objectContaining({ id: expect.any(String) }),
          }),
        }),
      );
      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          tokenHash: expect.any(String),
          clientType: 'game',
          expiresAt: expect.any(String),
        }),
      );
    });

    it('throws 401 INVALID_CREDENTIALS when credentials do not match', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(false);

      await expect(
        userAuthService.login('pilot@shefeq.az', 'wrongpassword', 'game'),
      ).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Email or password is wrong',
      });
    });
  });

  describe('POST /api/users/refresh', () => {
    it('rotates refresh token and returns fresh token, session, user', async () => {
      const req = {
        body: {
          refreshToken: 'valid-refresh-token-xyz-1234567890',
        },
      };
      const res = createMockRes();

      const storedToken = {
        id: 'token-uuid-1',
        user_id: mockUser.id,
        client_type: 'game',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        used_at: null,
        revoked_at: null,
      };

      refreshTokenRepository.findByTokenHash.mockResolvedValue(storedToken);
      userRepository.findById.mockResolvedValue(mockUser);
      refreshTokenRepository.markAsUsed.mockResolvedValue({ ...storedToken, used_at: new Date() });
      refreshTokenRepository.create.mockResolvedValue({ id: 'token-uuid-2' });
      jwtService.generateToken.mockReturnValue('jwt-token-refreshed');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser });

      await userController.refreshToken(req, res, () => {});

      expect(refreshTokenRepository.markAsUsed).toHaveBeenCalledWith('token-uuid-1');
      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          clientType: 'game',
          expiresAt: expect.any(String),
          tokenHash: expect.any(String),
        }),
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            token: 'jwt-token-refreshed',
            expiresAt: expect.any(String),
            refreshToken: expect.any(String),
            refreshExpiresAt: expect.any(String),
            user: {
              id: mockUser.id,
              email: mockUser.email,
              role: 'trainee',
            },
            session: {
              id: expect.any(String),
            },
          },
        }),
      );
    });

    it('detects token reuse, revokes all user tokens, and returns 401 INVALID_REFRESH_TOKEN', async () => {
      const storedReusedToken = {
        id: 'token-reused',
        user_id: mockUser.id,
        client_type: 'game',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        used_at: new Date(Date.now() - 3600000).toISOString(),
        revoked_at: null,
      };

      refreshTokenRepository.findByTokenHash.mockResolvedValue(storedReusedToken);

      await expect(
        userAuthService.refreshToken('reused-token'),
      ).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });

      expect(refreshTokenRepository.revokeAllForUser).toHaveBeenCalledWith(mockUser.id);
    });

    it('rejects expired or revoked refresh token with 401 INVALID_REFRESH_TOKEN', async () => {
      const storedExpiredToken = {
        id: 'token-expired',
        user_id: mockUser.id,
        client_type: 'game',
        expires_at: new Date(Date.now() - 1000).toISOString(),
        used_at: null,
        revoked_at: null,
      };

      refreshTokenRepository.findByTokenHash.mockResolvedValue(storedExpiredToken);

      await expect(
        userAuthService.refreshToken('expired-token'),
      ).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    });
  });

  describe('POST /api/users/revoke', () => {
    it('revokes the refresh token and returns OK with data: null', async () => {
      const req = {
        body: {
          refreshToken: 'token-to-revoke',
        },
      };
      const res = createMockRes();

      await userController.revokeToken(req, res, () => {});

      expect(refreshTokenRepository.revokeByTokenHash).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: null,
        }),
      );
    });

    it('returns OK with data: null even if token was already invalid or missing', async () => {
      const req = {
        body: {},
      };
      const res = createMockRes();

      await userController.revokeToken(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: null,
        }),
      );
    });
  });

  describe('POST /api/game/session/start', () => {
    it('returns session {id} with SESSION_RESUMED if an active session exists', async () => {
      const activeSession = {
        id: '33333333-3333-4333-a333-333333333333',
        user_id: mockUser.id,
        session_started_at: new Date().toISOString(),
        last_heartbeat_at: new Date().toISOString(),
      };
      gameRepository.findActiveSessionForUser.mockResolvedValue(activeSession);
      gameRepository.updateHeartbeat.mockResolvedValue(activeSession);
      gameRepository.listGameSessions.mockResolvedValue([]);

      const req = { user: { id: mockUser.id } };
      const res = createMockRes();

      await gameController.startGameSession(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'SESSION_RESUMED',
          message: 'Active session resumed',
          data: {
            session: {
              id: activeSession.id,
            },
          },
        }),
      );
    });

    it('returns session {id} with OK if creating a new session', async () => {
      gameRepository.findActiveSessionForUser.mockResolvedValue(null);
      gameRepository.endUserActiveSessions.mockResolvedValue([]);
      const newSession = {
        id: '44444444-4444-4444-a444-444444444444',
        user_id: mockUser.id,
        session_started_at: new Date().toISOString(),
      };
      gameRepository.startSession.mockResolvedValue(newSession);
      gameRepository.listGameSessions.mockResolvedValue([]);

      const req = { user: { id: mockUser.id } };
      const res = createMockRes();

      await gameController.startGameSession(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          message: 'Game session started successfully',
          data: {
            session: {
              id: newSession.id,
            },
          },
        }),
      );
    });
  });

  describe('POST /api/game/session/heartbeat', () => {
    it('returns session {id, lastHeartbeatAt} on successful heartbeat', async () => {
      const sessionId = '44444444-4444-4444-a444-444444444444';
      const heartbeatDate = new Date('2026-10-19T14:00:00.000Z');
      gameRepository.updateHeartbeat.mockResolvedValue({
        id: sessionId,
        last_heartbeat_at: heartbeatDate,
      });

      const req = { body: { sessionId } };
      const res = createMockRes();

      await gameController.heartbeatGameSession(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            session: {
              id: sessionId,
              lastHeartbeatAt: '2026-10-19T14:00:00.000Z',
            },
          },
        }),
      );
    });

    it('throws 401 SESSION_EXPIRED when heartbeat times out or session is dropped', async () => {
      const sessionId = 'dropped-session';
      gameRepository.updateHeartbeat.mockResolvedValue(null);
      gameRepository.endInactiveSessions.mockResolvedValue([]);

      await expect(gameService.updateHeartbeat({ sessionId })).rejects.toMatchObject({
        statusCode: 401,
        code: 'SESSION_EXPIRED',
        message: 'Session dropped or expired',
      });
    });
  });

  describe('POST /api/game/session/end', () => {
    it('returns session {id} on session end', async () => {
      const sessionId = '44444444-4444-4444-a444-444444444444';
      gameRepository.endSession.mockResolvedValue({
        id: sessionId,
        user_id: mockUser.id,
      });
      gameRepository.listGameSessions.mockResolvedValue([]);

      const req = { body: { sessionId, endReason: 'quit' } };
      const res = createMockRes();

      await gameController.endGameSession(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            session: {
              id: sessionId,
            },
          },
        }),
      );
    });

    it('throws 404 NOT_FOUND when session is not found', async () => {
      gameRepository.endSession.mockResolvedValue(null);

      await expect(
        gameService.endSession({ sessionId: 'unknown', endReason: 'quit' }),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('POST /api/sync/start-level-run', () => {
    it('returns run {id} at data.run.id', async () => {
      const sessionId = '44444444-4444-4444-a444-444444444444';
      const mapCode = 'drone_training_01';
      syncRepository.findMapByCode.mockResolvedValue({ id: 'm-1', code: mapCode });
      syncRepository.findGameSessionByIdForUser.mockResolvedValue({ id: sessionId });
      syncRepository.insertMapRun.mockResolvedValue({ id: 'run-999' });

      const req = { user: { id: mockUser.id }, body: { sessionId, mapCode } };
      const res = createMockRes();

      await syncController.startMapRun(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            run: {
              id: 'run-999',
            },
          },
        }),
      );
      const payload = res.json.mock.calls[0][0];
      expect(payload.data.mapRun).toBeUndefined();
    });

    it('throws 404 NOT_FOUND for unknown mapCode', async () => {
      syncRepository.findMapByCode.mockResolvedValue(null);

      await expect(
        syncService.startMapRun(mockUser.id, { mapCode: 'unknown_map' }),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('POST /api/sync/finish-level-run', () => {
    it('returns run {id, timeMs}, personalBest, and isNewPersonalBest: true when new PB is set', async () => {
      const runId = '55555555-5555-4555-a555-555555555555';
      const sessionId = '44444444-4444-4444-a444-444444444444';
      const mapId = '66666666-6666-4666-a666-666666666666';

      syncRepository.findMapRunByIdForUser.mockResolvedValue({
        id: runId,
        user_id: mockUser.id,
        map_id: mapId,
      });
      syncRepository.findGameSessionByIdForUser.mockResolvedValue({ id: sessionId });
      syncRepository.getPreviousBestExcludingRun.mockResolvedValue({
        id: 'old-best',
        time_ms: 45000,
      });
      syncRepository.updateMapRunById.mockResolvedValue({
        id: runId,
        time_ms: 41973,
      });
      syncRepository.getPersonalBestForUserAndMap.mockResolvedValue({
        id: runId,
        time_ms: 41973,
        run_ended_at: new Date('2026-10-19T14:02:11Z'),
      });

      const req = {
        user: { id: mockUser.id },
        body: {
          sessionId,
          runId,
          timeMs: 41973,
          completed: true,
        },
      };
      const res = createMockRes();

      await syncController.finishMapRun(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          message: 'Run finished',
          data: {
            run: {
              id: runId,
              timeMs: 41973,
            },
            personalBest: {
              timeMs: 41973,
              runId,
              achievedAt: '2026-10-19T14:02:11.000Z',
            },
            isNewPersonalBest: true,
          },
        }),
      );
    });

    it('returns isNewPersonalBest: false when run is slower than previous best', async () => {
      const runId = '55555555-5555-4555-a555-555555555555';
      const mapId = '66666666-6666-4666-a666-666666666666';

      syncRepository.findMapRunByIdForUser.mockResolvedValue({
        id: runId,
        user_id: mockUser.id,
        map_id: mapId,
      });
      syncRepository.getPreviousBestExcludingRun.mockResolvedValue({
        id: '77777777-7777-4777-a777-777777777777',
        time_ms: 40210,
      });
      syncRepository.updateMapRunById.mockResolvedValue({
        id: runId,
        time_ms: 41973,
      });
      syncRepository.getPersonalBestForUserAndMap.mockResolvedValue({
        id: '77777777-7777-4777-a777-777777777777',
        time_ms: 40210,
        run_ended_at: new Date('2026-10-18T14:02:11Z'),
      });

      const req = {
        user: { id: mockUser.id },
        body: {
          runId,
          timeMs: 41973,
          completed: true,
        },
      };
      const res = createMockRes();

      await syncController.finishMapRun(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            run: {
              id: runId,
              timeMs: 41973,
            },
            personalBest: {
              timeMs: 40210,
              runId: '77777777-7777-4777-a777-777777777777',
              achievedAt: '2026-10-18T14:02:11.000Z',
            },
            isNewPersonalBest: false,
          },
        }),
      );
    });

    it('returns personalBest: null and isNewPersonalBest: false when not completed and no previous PB exists', async () => {
      const runId = '55555555-5555-4555-a555-555555555555';
      const mapId = '66666666-6666-4666-a666-666666666666';

      syncRepository.findMapRunByIdForUser.mockResolvedValue({
        id: runId,
        user_id: mockUser.id,
        map_id: mapId,
      });
      syncRepository.getPreviousBestExcludingRun.mockResolvedValue(null);
      syncRepository.updateMapRunById.mockResolvedValue({
        id: runId,
        time_ms: 12000,
        completed: false,
      });
      syncRepository.getPersonalBestForUserAndMap.mockResolvedValue(null);

      const req = {
        user: { id: mockUser.id },
        body: {
          runId,
          timeMs: 12000,
          completed: false,
        },
      };
      const res = createMockRes();

      await syncController.finishMapRun(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            run: {
              id: runId,
              timeMs: 12000,
            },
            personalBest: null,
            isNewPersonalBest: false,
          },
        }),
      );
    });
  });

  describe('GET /api/sync/personal-best?mapCode=X', () => {
    it('returns personalBest {timeMs, runId, achievedAt} when completed', async () => {
      const mapCode = 'drone_training_01';
      syncRepository.findMapByCode.mockResolvedValue({ id: 'm-1', code: mapCode });
      syncRepository.getPersonalBestForUserAndMap.mockResolvedValue({
        id: 'pb-run-1',
        time_ms: 40210,
        run_ended_at: new Date('2026-10-18T14:02:11Z'),
      });

      const req = { user: { id: mockUser.id }, query: { mapCode } };
      const res = createMockRes();

      await syncController.getPersonalBest(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            personalBest: {
              timeMs: 40210,
              runId: 'pb-run-1',
              achievedAt: '2026-10-18T14:02:11.000Z',
            },
          },
        }),
      );
    });

    it('returns personalBest: null when account has not completed map', async () => {
      const mapCode = 'drone_training_02';
      syncRepository.findMapByCode.mockResolvedValue({ id: 'm-2', code: mapCode });
      syncRepository.getPersonalBestForUserAndMap.mockResolvedValue(null);

      const req = { user: { id: mockUser.id }, query: { mapCode } };
      const res = createMockRes();

      await syncController.getPersonalBest(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            personalBest: null,
          },
        }),
      );
    });

    it('throws 404 NOT_FOUND for unknown mapCode', async () => {
      syncRepository.findMapByCode.mockResolvedValue(null);

      await expect(
        syncService.getPersonalBest(mockUser.id, 'unknown_map'),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('GET /api/sync/personal-bests', () => {
    it('returns items [{mapCode, timeMs}] for every map account finished', async () => {
      syncRepository.getAllPersonalBestsForUser.mockResolvedValue([
        { map_code: 'drone_training_01', best_time_ms: 40210 },
        { map_code: 'drone_training_02', best_time_ms: 55100 },
      ]);

      const req = { user: { id: mockUser.id } };
      const res = createMockRes();

      await syncController.getAllPersonalBests(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: 'OK',
          data: {
            items: [
              { mapCode: 'drone_training_01', timeMs: 40210 },
              { mapCode: 'drone_training_02', timeMs: 55100 },
            ],
          },
        }),
      );
    });
  });

  describe('UserAuthMiddleware ensureUser', () => {
    it('throws 401 TOKEN_EXPIRED when Authorization header is missing', async () => {
      const req = { get: jest.fn().mockReturnValue(null), query: {}, cookies: {} };
      const res = createMockRes();
      const next = jest.fn();

      const middleware = UserAuthMiddleware.ensureUser();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: 'TOKEN_EXPIRED',
        }),
      );
    });
  });
});
