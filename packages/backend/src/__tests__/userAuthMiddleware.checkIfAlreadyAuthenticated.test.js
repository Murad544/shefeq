const UserAuthMiddleware = require('../middleware/auth/userAuthMiddleWare');
const userAuthService = require('../services/userAuthService');
const { CLIENT_TYPES } = require('../middleware/validation/types/types');

jest.mock('../services/userAuthService');

describe('UserAuthMiddleware.checkIfAlreadyAuthenticated', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      get: jest.fn(),
      cookies: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('bypasses check and calls next() when email and password credentials are provided', async () => {
    req.body = { email: 'test@example.com', password: 'password123', client_type: CLIENT_TYPES.GAME };
    req.get.mockReturnValue('Bearer valid.jwt.token');

    const middleware = UserAuthMiddleware.checkIfAlreadyAuthenticated();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
    expect(userAuthService.validateToken).not.toHaveBeenCalled();
  });

  it('calls next() when no token is present and no credentials provided', async () => {
    req.body = {};
    req.get.mockReturnValue(null);

    const middleware = UserAuthMiddleware.checkIfAlreadyAuthenticated();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns ALREADY_AUTHENTICATED with sessionId, token, and game redirect settings for game client', async () => {
    req.body = { client_type: CLIENT_TYPES.GAME };
    req.get.mockReturnValue('Bearer valid.jwt.token');

    userAuthService.validateToken.mockResolvedValue({
      user: {
        id: 'u-1',
        email: 'user@example.com',
        role: 'trainee',
        is_active: true,
      },
      token: {
        id: 'u-1',
        email: 'user@example.com',
        role: 'trainee',
        client_type: CLIENT_TYPES.GAME,
        sessionId: 'test-session-uuid-1234',
      },
    });

    const middleware = UserAuthMiddleware.checkIfAlreadyAuthenticated();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Already authenticated',
      code: 'ALREADY_AUTHENTICATED',
      data: {
        user: {
          id: 'u-1',
          email: 'user@example.com',
          role: 'trainee',
          is_active: true,
          sessionId: 'test-session-uuid-1234',
        },
        token: 'valid.jwt.token',
        session: {
          id: 'test-session-uuid-1234',
        },
        shouldRedirect: false,
        redirectTo: null,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns ALREADY_AUTHENTICATED with shouldRedirect true and /profile redirectTo for web client', async () => {
    req.body = {};
    req.get.mockReturnValue('Bearer valid.jwt.token');

    userAuthService.validateToken.mockResolvedValue({
      user: {
        id: 'u-2',
        email: 'web@example.com',
        role: 'trainee',
        is_active: true,
      },
      token: {
        id: 'u-2',
        email: 'web@example.com',
        role: 'trainee',
        client_type: CLIENT_TYPES.WEB,
        sessionId: 'web-session-uuid-5678',
      },
    });

    const middleware = UserAuthMiddleware.checkIfAlreadyAuthenticated();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Already authenticated',
      code: 'ALREADY_AUTHENTICATED',
      data: {
        user: {
          id: 'u-2',
          email: 'web@example.com',
          role: 'trainee',
          is_active: true,
          sessionId: 'web-session-uuid-5678',
        },
        token: 'valid.jwt.token',
        session: {
          id: 'web-session-uuid-5678',
        },
        shouldRedirect: true,
        redirectTo: '/profile',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when token validation fails', async () => {
    req.get.mockReturnValue('Bearer invalid.jwt.token');
    userAuthService.validateToken.mockRejectedValue(new Error('Invalid token'));

    const middleware = UserAuthMiddleware.checkIfAlreadyAuthenticated();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });
});
