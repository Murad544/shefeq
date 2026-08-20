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

describe('UserAuthService Single Device Session Enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('generates a new session_id and saves it on user record upon login', async () => {
      const mockUser = {
        id: 'u-1',
        email: 'user@test.com',
        password_hash: 'hashed_pw',
        is_active: true,
        role: 'trainee',
        created_at: new Date().toISOString(),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      encryptionService.verifyPassword.mockResolvedValue(true);
      jwtService.generateToken.mockReturnValue('jwt-token-new');
      userRepository.updateSessionId.mockResolvedValue({ ...mockUser, session_id: 'new-uuid' });

      const result = await userAuthService.login('user@test.com', 'password123');

      expect(userRepository.updateSessionId).toHaveBeenCalledWith(
        'u-1',
        expect.any(String),
      );
      expect(jwtService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'u-1',
          sessionId: expect.any(String),
        }),
      );
      expect(result.token).toBe('jwt-token-new');
    });
  });

  describe('validateToken', () => {
    it('validates successfully when token sessionId matches DB session_id', async () => {
      const sessionId = 'session-123';
      jwtService.verifyToken.mockReturnValue({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId,
      });

      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        session_id: sessionId,
        role: 'trainee',
      });

      const validation = await userAuthService.validateToken('valid-token');
      expect(validation.user.id).toBe('u-1');
    });

    it('rejects with SESSION_TERMINATED and blacklists token when sessionId does not match DB session_id', async () => {
      jwtService.verifyToken.mockReturnValue({
        id: 'u-1',
        email: 'user@test.com',
        client_type: 'web',
        sessionId: 'old-session-from-device-1',
      });

      userRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'user@test.com',
        is_active: true,
        session_id: 'new-session-from-device-2',
        role: 'trainee',
      });

      await expect(userAuthService.validateToken('old-token')).rejects.toMatchObject({
        statusCode: 401,
        code: 'SESSION_TERMINATED',
      });

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('old-token');
    });
  });

  describe('logout', () => {
    it('clears session_id in database and blacklists token', async () => {
      await userAuthService.logout('token-to-logout', 'u-1');

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith('token-to-logout');
      expect(userRepository.updateSessionId).toHaveBeenCalledWith('u-1', null);
    });
  });
});
