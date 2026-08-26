jest.mock('../repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updateSessionId: jest.fn(),
  updateUser: jest.fn(),
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

const userAuthService = require('../services/userAuthService');
const userRepository = require('../repositories/userRepository');
const encryptionService = require('../services/shared/encryptionService');
const jwtService = require('../services/shared/jwtService');
const tokenBlacklistService = require('../services/shared/tokenBlacklistService');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

describe('UserAuthService Multi-Client Single Device Session Enforcement', () => {
  const mockUser = {
    id: 'u-1',
    email: 'user@test.com',
    password_hash: 'hashed_pw',
    is_active: true,
    role: 'trainee',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('generates a new web_session_id and saves it for web client login', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(true);
      jwtService.generateToken.mockReturnValue('jwt-token-web');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser, web_session_id: 'new-web-uuid' });

      const result = await userAuthService.login('user@test.com', 'password123', CLIENT_TYPES.WEB);

      expect(userRepository.updateSessionId).toHaveBeenCalledWith(
        'u-1',
        expect.any(String),
        CLIENT_TYPES.WEB,
      );
      expect(jwtService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'u-1',
          client_type: CLIENT_TYPES.WEB,
          sessionId: expect.any(String),
        }),
      );
      expect(result.token).toBe('jwt-token-web');
    });

    it('generates a new game_session_id and saves it for game client login', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(true);
      jwtService.generateToken.mockReturnValue('jwt-token-game');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser, game_session_id: 'new-game-uuid' });

      const result = await userAuthService.login('user@test.com', 'password123', CLIENT_TYPES.GAME);

      expect(userRepository.updateSessionId).toHaveBeenCalledWith(
        'u-1',
        expect.any(String),
        CLIENT_TYPES.GAME,
      );
      expect(jwtService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'u-1',
          client_type: CLIENT_TYPES.GAME,
          sessionId: expect.any(String),
        }),
      );
      expect(result.token).toBe('jwt-token-game');
    });
  });

  describe('validateToken - Concurrent Web and Game Sessions', () => {
    it('allows concurrent web and game sessions for the same user', async () => {
      const webSessionId = 'web-session-123';
      const gameSessionId = 'game-session-456';

      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        web_session_id: webSessionId,
        game_session_id: gameSessionId,
        role: 'trainee',
      });

      // Validate web token
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId: webSessionId,
      });
      const webValidation = await userAuthService.validateToken('web-token');
      expect(webValidation.user.id).toBe('u-1');

      // Validate game token
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'game',
        sessionId: gameSessionId,
      });
      const gameValidation = await userAuthService.validateToken('game-token');
      expect(gameValidation.user.id).toBe('u-1');
    });

    it('rejects old web session when new web session is started, without affecting game session', async () => {
      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        web_session_id: 'new-web-session',
        game_session_id: 'active-game-session',
        role: 'trainee',
      });

      // Old web token should fail
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId: 'old-web-session',
      });
      await expect(userAuthService.validateToken('old-web-token')).rejects.toMatchObject({
        statusCode: 401,
        code: 'SESSION_TERMINATED',
      });
      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('old-web-token');

      // Active game token should still succeed
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'game',
        sessionId: 'active-game-session',
      });
      const gameValidation = await userAuthService.validateToken('active-game-token');
      expect(gameValidation.user.id).toBe('u-1');
    });

    it('rejects old game session when new game session is started, without affecting web session', async () => {
      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        web_session_id: 'active-web-session',
        game_session_id: 'new-game-session',
        role: 'trainee',
      });

      // Old game token should fail
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'game',
        sessionId: 'old-game-session',
      });
      await expect(userAuthService.validateToken('old-game-token')).rejects.toMatchObject({
        statusCode: 401,
        code: 'SESSION_TERMINATED',
      });
      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('old-game-token');

      // Active web token should still succeed
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId: 'active-web-session',
      });
      const webValidation = await userAuthService.validateToken('active-web-token');
      expect(webValidation.user.id).toBe('u-1');
    });

    it('supports backward compatibility with single session_id column if web_session_id is unset', async () => {
      const legacySessionId = 'legacy-session-123';
      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        session_id: legacySessionId,
        role: 'trainee',
      });

      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId: legacySessionId,
      });

      const validation = await userAuthService.validateToken('legacy-token');
      expect(validation.user.id).toBe('u-1');
    });
  });

  describe('logout', () => {
    it('clears only web_session_id when logging out from web', async () => {
      await userAuthService.logout('token-to-logout', 'u-1', CLIENT_TYPES.WEB);

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('token-to-logout');
      expect(userRepository.updateSessionId).toHaveBeenCalledWith('u-1', null, CLIENT_TYPES.WEB);
    });

    it('clears only game_session_id when logging out from game', async () => {
      await userAuthService.logout('token-to-logout', 'u-1', CLIENT_TYPES.GAME);

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('token-to-logout');
      expect(userRepository.updateSessionId).toHaveBeenCalledWith('u-1', null, CLIENT_TYPES.GAME);
    });

    it('infers client_type from token payload when clientType parameter is not explicitly provided', async () => {
      jwtService.verifyToken.mockReturnValueOnce({
        id: 'u-1',
        client_type: CLIENT_TYPES.GAME,
      });

      await userAuthService.logout('game-jwt-token', 'u-1');

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('game-jwt-token');
      expect(userRepository.updateSessionId).toHaveBeenCalledWith('u-1', null, CLIENT_TYPES.GAME);
    });

    it('clears all sessions when clientType cannot be determined and no token is present', async () => {
      await userAuthService.logout(null, 'u-1');

      expect(userRepository.updateSessionId).toHaveBeenCalledWith('u-1', null, 'all');
    });
  });
});
