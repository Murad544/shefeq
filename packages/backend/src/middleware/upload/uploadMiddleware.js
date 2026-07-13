const multer = require('multer');
const { AppError } = require('../error/errorMiddleware');

class UploadMiddleware {
  static configure() {
    // Use memory storage instead of disk storage for R2 uploads
    // Files will be stored in memory as buffers and uploaded directly to R2
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
      const allowedTypes = {
        mp4Files: ['video/mp4'],
        pdfFiles: ['application/pdf'],
      };

      const allowed = allowedTypes[file.fieldname];
      if (!allowed || !allowed.includes(file.mimetype)) {
        return cb(AppError.badRequest(`Invalid file type for ${file.fieldname}`));
      }
      cb(null, true);
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 20,
      },
    }).fields([
      { name: 'mp4Files', maxCount: 10 },
      { name: 'pdfFiles', maxCount: 10 },
    ]);
  }

  static validateFiles(req, res, next) {
    const mp4Count = req.files.mp4Files?.length || 0;
    const pdfCount = req.files.pdfFiles?.length || 0;

    if (mp4Count > 10) throw AppError.badRequest('Too many MP4 files');
    if (pdfCount > 10) throw AppError.badRequest('Too many PDF files');
    if (mp4Count + pdfCount > 20) throw AppError.badRequest('Too many total files');

    next();
  }

  static parseJsonFields(req, res, next) {
    try {
      if (req.body.skills && typeof req.body.skills === 'string') {
        try {
          req.body.skills = JSON.parse(req.body.skills);
        } catch (error) {
          req.body.skills = [];
        }
      }

      if (req.body.answers && typeof req.body.answers === 'string') {
        try {
          req.body.answers = JSON.parse(req.body.answers);
        } catch (error) {
          req.body.answers = [];
        }
      }

      next();
    } catch (error) {
      next(AppError.badRequest('Invalid JSON in form data'));
    }
  }
}

module.exports = UploadMiddleware;
