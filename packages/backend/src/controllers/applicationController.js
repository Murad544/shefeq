const applicationService = require('../services/applicationService');
const { sendSuccess } = require('../utils/responseHelper');
const { ErrorHandler } = require('../middleware/error/errorMiddleware');

class ApplicationController {
  registerApplication = ErrorHandler.asyncWrapper(async (req, res) => {
    const result = await applicationService.registerApplication(req.body, req.files);
    sendSuccess(res, result, 'Application submitted successfully', 201);
  });
}

module.exports = new ApplicationController();
