const applicationRepository = require('../repositories/applicationRepository');
const applicationApprovalRepository = require('../repositories/applicationApprovalRepository');
const answerRepository = require('../repositories/answerRepository');
const fileRepository = require('../repositories/fileRepository');
const fileService = require('./fileService');
const encryptionService = require('./shared/encryptionService');
const db = require('../config/database');
const logger = require('../utils/logger');
const mapPostgresError = require('../utils/postgresErrorMapper');

class ApplicationService {
  async registerApplication(userData, files) {
    const { mp4Files = [], pdfFiles = [] } = files || {};
    let movedFiles = null;

    try {
      // Step 1: Validate files in tmp directory
      await fileService.validateTmpFiles(mp4Files, pdfFiles);

      const secretKey = encryptionService.generateSecretKey();

      // Step 2: Database transaction (files still in tmp)
      const result = await db.withTransaction(async (client) => {
        // Create application (form submission)
        const application = await applicationRepository.createApplication(client, {
          ...userData,
        });

        // Create answers for the application
        if (Array.isArray(userData.answers) && userData.answers.length) {
          await answerRepository.createAnswers(client, application.id, userData.answers);
        }

        return application;
      });

      // Step 3: Move files to permanent location (only after successful DB transaction)
      movedFiles = await fileService.moveFilesToPermanent(mp4Files, pdfFiles);

      // Step 4: Save file records to database
      await db.withTransaction(async (client) => {
        if (movedFiles.mp4.length) {
          await fileRepository.createFiles(client, result.id, movedFiles.mp4, 'mp4');
        }
        if (movedFiles.pdf.length) {
          await fileRepository.createFiles(client, result.id, movedFiles.pdf, 'pdf');
        }
      });

      logger.info('User registration completed successfully', {
        applicationId: result.id,
        mp4Count: movedFiles.mp4.length,
        pdfCount: movedFiles.pdf.length,
      });

      return {
        id: result.id,
      };
    } catch (error) {
      logger.error('User registration failed:', {
        error,
        constraint: error.constraint,
        code: error.code,
      });

      if (movedFiles) {
        await fileService.cleanupMovedFiles(movedFiles);
      }

      const mappedError = mapPostgresError(error);
      if (mappedError) {
        throw mappedError;
      }
      throw error;
    }
  }
}

module.exports = new ApplicationService();
