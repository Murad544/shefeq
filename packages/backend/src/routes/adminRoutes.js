const express = require('express');
const adminController = require('../controllers/adminController');
const AuthMiddleware = require('../middleware/auth/authMiddleware');
const ValidationMiddleware = require('../middleware/validation/validationMiddleware');
const { idSchema, fileIdSchema } = require('../middleware/validation/schemas/commonSchemas');
const { adminUserEditSchema } = require('../middleware/validation/schemas/adminSchemas');

const router = express.Router();

router.use(AuthMiddleware.ensureAdmin());
router.use(AuthMiddleware.securityHeaders);

router.get('/admins', adminController.listAdmins);
router.post('/admins/:id/activate', adminController.activateAdmin);
router.post('/admins/:id/deactivate', adminController.deactivateAdmin);
router.get('/applications', adminController.listApplications);
router.get('/questions', adminController.listQuestions);

router.get(
  '/applications/:id',
  ValidationMiddleware.validateParams(idSchema),
  adminController.getApplicationById
);

router.get(
  '/applications/:id/full',
  ValidationMiddleware.validateParams(idSchema),
  adminController.getApplicationFull
);

router.get(
  '/files/:fileId/download',
  ValidationMiddleware.validateParams(fileIdSchema),
  adminController.downloadFile
);

router.get('/approved-applications', adminController.getApprovedApplications);

router.get(
  '/users/:id/edit-data',
  ValidationMiddleware.validateParams(idSchema),
  adminController.getUserEditData
);

router.patch(
  '/users/:id/edit',
  ValidationMiddleware.validateParams(idSchema),
  ValidationMiddleware.validate(adminUserEditSchema),
  adminController.updateUserData
);

router.post(
  '/applications/:id/approve',
  ValidationMiddleware.validateParams(idSchema),
  adminController.approveApplication
);

router.post(
  '/applications/:id/resend-activation',
  ValidationMiddleware.validateParams(idSchema),
  adminController.resendActivation
);

router.post(
  '/applications/:id/reject',
  ValidationMiddleware.validateParams(idSchema),
  adminController.rejectApplication
);

router.get(
  '/applications/:id/approved',
  ValidationMiddleware.validateParams(idSchema),
  adminController.checkIfApplicationApproved
);

module.exports = router;
