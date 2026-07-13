const adminAuthService = require('../services/adminAuthService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler } = require('../middleware/error/errorMiddleware');

class AdminAuthController {
  login = ErrorHandler.asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const clientInfo = { ip: req.ip, userAgent: req.get('User-Agent') };

    const result = await adminAuthService.login(email, password, clientInfo);
    sendSuccess(res, result, 'Login successful');
  });

  logout = ErrorHandler.asyncWrapper(async (req, res) => {
    const clientInfo = { ip: req.ip, userAgent: req.get('User-Agent') };
    await adminAuthService.logout(req.token, req.user.id, clientInfo);
    sendSuccess(res, null, 'Logout successful');
  });

  me = ErrorHandler.asyncWrapper(async (req, res) => {
    const admin = await adminAuthService.getCurrentAdmin(req.user.id);
    sendSuccess(res, { admin }, 'Admin data retrieved');
  });

  createAdmin = ErrorHandler.asyncWrapper(async (req, res) => {
    const admin = await adminAuthService.createAdmin(req);
    sendSuccess(res, { admin }, 'Admin created successfully', 201);
  });

  deleteAdmin = ErrorHandler.asyncWrapper(async (req, res) => {
    const admin = await adminAuthService.deleteAdmin(req);
    sendSuccess(res, { admin }, 'Admin deleted successfully');
  });
}

module.exports = new AdminAuthController();
