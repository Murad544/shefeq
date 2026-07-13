const fileRepository = require('../repositories/fileRepository');
const r2Service = require('./r2Service');
const { AppError } = require('../middleware/error/errorMiddleware');
const logger = require('../utils/logger');

class FileService {
  /**
   * Validate file buffers (PDF and MP4)
   */
  async isPdf(buffer) {
    try {
      if (!buffer || buffer.length < 5) return false;
      return buffer.slice(0, 5).toString() === '%PDF-';
    } catch (error) {
      logger.error('Error validating PDF file:', error);
      return false;
    }
  }

  async isMp4(buffer) {
    try {
      if (!buffer || buffer.length < 16) return false;
      return buffer.slice(4, 8).toString() === 'ftyp';
    } catch (error) {
      logger.error('Error validating MP4 file:', error);
      return false;
    }
  }

  /**
   * Validate files in memory (multer memory storage)
   * Files will be buffers, not file paths
   */
  async validateTmpFiles(mp4Files = [], pdfFiles = []) {
    // Validate PDF files
    for (const file of pdfFiles) {
      // file.buffer is available when using memory storage
      const buffer = file.buffer || (file.path ? await this.readFileBuffer(file.path) : null);
      if (!buffer) {
        throw new Error(`Invalid PDF file: ${file.originalname} - missing buffer`);
      }
      const isValid = await this.isPdf(buffer);
      if (!isValid) {
        throw new Error(`Invalid PDF file: ${file.originalname}`);
      }
    }

    // Validate MP4 files
    for (const file of mp4Files) {
      // file.buffer is available when using memory storage
      const buffer = file.buffer || (file.path ? await this.readFileBuffer(file.path) : null);
      if (!buffer) {
        throw new Error(`Invalid MP4 file: ${file.originalname} - missing buffer`);
      }
      const isValid = await this.isMp4(buffer);
      if (!isValid) {
        throw new Error(`Invalid MP4 file: ${file.originalname}`);
      }
    }

    return { mp4Files, pdfFiles };
  }

  /**
   * Helper to read file buffer (fallback for disk storage during migration)
   */
  async readFileBuffer(filePath) {
    try {
      const fs = require('fs').promises;
      return await fs.readFile(filePath);
    } catch (error) {
      logger.error('Error reading file buffer:', error);
      return null;
    }
  }

  /**
   * Upload files to R2 instead of moving to local filesystem
   */
  async moveFilesToPermanent(mp4Files = [], pdfFiles = []) {
    const movedFiles = { mp4: [], pdf: [] };

    try {
      // Upload PDF files to R2
      for (const file of pdfFiles) {
        const buffer = file.buffer || (file.path ? await this.readFileBuffer(file.path) : null);
        if (!buffer) {
          throw new Error(`Missing buffer for PDF file: ${file.originalname}`);
        }

        const storedName = r2Service.generateFileKey('pdf', file.originalname);
        const contentType = r2Service.getContentType('pdf');

        // Upload to R2
        await r2Service.uploadFile(buffer, storedName, contentType);

        movedFiles.pdf.push({
          originalname: file.originalname,
          storedName, // This is the R2 key
          fileSize: file.size || buffer.length,
        });
      }

      // Upload MP4 files to R2
      for (const file of mp4Files) {
        const buffer = file.buffer || (file.path ? await this.readFileBuffer(file.path) : null);
        if (!buffer) {
          throw new Error(`Missing buffer for MP4 file: ${file.originalname}`);
        }

        const storedName = r2Service.generateFileKey('mp4', file.originalname);
        const contentType = r2Service.getContentType('mp4');

        // Upload to R2
        await r2Service.uploadFile(buffer, storedName, contentType);

        movedFiles.mp4.push({
          originalname: file.originalname,
          storedName, // This is the R2 key
          fileSize: file.size || buffer.length,
        });
      }

      return movedFiles;
    } catch (error) {
      await this.cleanupMovedFiles(movedFiles);
      throw error;
    }
  }

  /**
   * Prepare file download from R2
   */
  async prepareFileDownload(fileId) {
    const file = await fileRepository.findById(fileId);
    if (!file) {
      throw AppError.notFound('File not found', 'FILE_NOT_FOUND');
    }

    // Check if file exists in R2
    const exists = await r2Service.fileExists(file.stored_name);
    if (!exists) {
      logger.error(`File not found in R2: ${file.stored_name}`);
      throw AppError.notFound('File not found in storage', 'FILE_MISSING');
    }

    // Get file metadata and stream
    const metadata = await r2Service.getFileMetadata(file.stored_name);
    const stream = await r2Service.getFileStream(file.stored_name);

    return {
      stream, // R2 file stream
      fileName: file.original_name,
      contentType: metadata.contentType || this.getContentType(file.file_type),
      fileSize: file.file_size || metadata.contentLength,
      r2Key: file.stored_name, // Store R2 key for reference
    };
  }

  getContentType(fileType) {
    return r2Service.getContentType(fileType);
  }

  /**
   * Cleanup tmp files (no-op for memory storage, but kept for compatibility)
   */
  async cleanupTmpFiles(mp4Files = [], pdfFiles = []) {
    // With memory storage, buffers are automatically garbage collected
    // No cleanup needed, but we keep this method for compatibility
    logger.debug('Cleanup tmp files called (no-op with memory storage)');
  }

  /**
   * Cleanup uploaded files from R2 (rollback on error)
   */
  async cleanupMovedFiles(movedFiles) {
    // Cleanup uploaded PDF files from R2
    for (const file of movedFiles.pdf || []) {
      try {
        await r2Service.deleteFile(file.storedName);
      } catch (error) {
        logger.warn('Failed to cleanup moved PDF file from R2:', error);
      }
    }

    // Cleanup uploaded MP4 files from R2
    for (const file of movedFiles.mp4 || []) {
      try {
        await r2Service.deleteFile(file.storedName);
      } catch (error) {
        logger.warn('Failed to cleanup moved MP4 file from R2:', error);
      }
    }
  }
}

module.exports = new FileService();
