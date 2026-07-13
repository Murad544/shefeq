const adminService = require('../services/adminService');
const fileService = require('../services/fileService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler, AppError } = require('../middleware/error/errorMiddleware');

class AdminController {
  listAdmins = ErrorHandler.asyncWrapper(async (req, res) => {
    const admins = await adminService.getAllAdmins();
    sendSuccess(res, { admins }, 'Admins retrieved successfully');
  });

  activateAdmin = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const admin = await adminService.activateAdmin(id);
    sendSuccess(res, { admin }, 'Admin activated successfully');
  });

  deactivateAdmin = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const admin = await adminService.deactivateAdmin(id);
    sendSuccess(res, { admin }, 'Admin deactivated successfully');
  });

  listApplications = ErrorHandler.asyncWrapper(async (req, res) => {
    const { search } = req.query;
    const applications = await adminService.searchApplications(search);
    sendSuccess(res, { applications }, 'Applications retrieved successfully');
  });

  listQuestions = ErrorHandler.asyncWrapper(async (req, res) => {
    const questions = await adminService.getAllQuestions();
    sendSuccess(res, { questions }, 'Questions retrieved successfully');
  });

  getApplicationById = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const application = await adminService.getApplicationById(id);
    sendSuccess(res, { application }, 'Application retrieved successfully');
  });

  getAdminById = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const admin = await adminService.getAdminById(id);
    sendSuccess(res, { admin }, 'Admin retrieved successfully');
  });

  getApplicationFull = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const applicationDetails = await adminService.getApplicationWithDetails(id);
    sendSuccess(res, applicationDetails, 'Application details retrieved successfully');
  });

  getApprovedApplications = ErrorHandler.asyncWrapper(async (req, res) => {
    const { search } = req.query;
    const approvedApplications = await adminService.searchApprovals(search);
    sendSuccess(res, { approvedApplications }, 'Approved applications retrieved successfully');
  });

  getUserEditData = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.getUserEditDataForAdmin(req.user, id);
    sendSuccess(res, result, 'User edit data retrieved successfully');
  });

  updateUserData = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.updateUserDataForAdmin(req.user, id, req.body);
    sendSuccess(res, result, 'User data updated successfully');
  });

  approveApplication = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const adminId = req.user?.id; // Assuming admin ID is in req.user from auth middleware
    const approval = await adminService.approveApplication(id, adminId);
    sendSuccess(res, { approval }, 'Application approved successfully');
  });

  resendActivation = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const adminId = req.user?.id;
    const result = await adminService.resendActivation(id, adminId);
    sendSuccess(res, { result }, 'Activation resent successfully');
  });

  rejectApplication = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await adminService.rejectApplication(id);
    sendSuccess(res, null, 'Application approval removed successfully');
  });

  checkIfApplicationApproved = ErrorHandler.asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const isApproved = await adminService.checkIfApplicationApproved(id);
    sendSuccess(res, { isApproved }, 'Application approval status retrieved successfully');
  });

  downloadFile = ErrorHandler.asyncWrapper(async (req, res) => {
    const { fileId } = req.params;

    if (!fileId || isNaN(parseInt(fileId))) {
      throw AppError.badRequest('Valid file ID is required', 'INVALID_FILE_ID');
    }

    const fileData = await fileService.prepareFileDownload(fileId);

    res.setHeader('Content-Type', fileData.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(fileData.fileName)}`
    );
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (fileData.fileSize) {
      res.setHeader('Content-Length', fileData.fileSize);
    }

    // Stream file from R2
    try {
      const stream = fileData.stream;

      // Handle stream errors
      stream.on('error', (err) => {
        console.error('File stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream file' });
        } else {
          res.end();
        }
      });

      // Pipe the stream to response
      stream.pipe(res);
    } catch (error) {
      console.error('File send error:', error);
      if (!res.headersSent) {
        throw AppError.internal('Failed to send file', 'FILE_SEND_ERROR');
      }
    }
  });
}

module.exports = new AdminController();
