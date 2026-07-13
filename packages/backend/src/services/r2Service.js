const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { AppError } = require('../middleware/error/errorMiddleware');
const logger = require('../utils/logger');

class R2Service {
  constructor() {
    // Cloudflare R2 is S3-compatible
    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME;
    // this.publicUrl = process.env.R2_PUBLIC_URL; // Optional: if you have a public domain/CDN

    if (!this.bucketName) {
      logger.warn('R2_BUCKET_NAME not configured. R2 service may not work correctly.');
    }
  }

  /**
   * Generate a unique key for storing files in R2
   * Format: {fileType}/{timestamp}-{random}.{ext}
   */
  generateFileKey(fileType, originalName) {
    const ext = originalName.match(/\.[^.]+$/)?.[0] || (fileType === 'pdf' ? '.pdf' : '.mp4');
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    return `${fileType}/${timestamp}-${random}${ext}`;
  }

  /**
   * Upload a file buffer to R2
   * @param {Buffer} buffer - File buffer
   * @param {string} key - R2 object key
   * @param {string} contentType - MIME type
   * @returns {Promise<string>} - The R2 key (stored_name)
   */
  async uploadFile(buffer, key, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Optional: Add metadata
        Metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);
      logger.info(`File uploaded to R2: ${key}`);
      return key;
    } catch (error) {
      logger.error('Error uploading file to R2:', error);
      throw new AppError('Failed to upload file to storage', 'R2_UPLOAD_ERROR', 500);
    }
  }

  /**
   * Get a file stream from R2
   * @param {string} key - R2 object key
   * @returns {Promise<import('stream').Readable>} - File stream
   */
  async getFileStream(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);

      // AWS SDK v3 for Node.js returns Body as a Node.js Readable stream
      // This can be directly piped to Express response
      const stream = response.Body;

      if (!stream) {
        throw new AppError('Empty file stream from storage', 'R2_EMPTY_STREAM', 500);
      }

      return stream;
    } catch (error) {
      if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
        logger.warn(`File not found in R2: ${key}`);
        throw new AppError('File not found in storage', 'FILE_NOT_FOUND', 404);
      }
      logger.error('Error getting file from R2:', error);
      throw new AppError('Failed to retrieve file from storage', 'R2_GET_ERROR', 500);
    }
  }

  /**
   * Check if a file exists in R2
   * @param {string} key - R2 object key
   * @returns {Promise<boolean>}
   */
  async fileExists(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      logger.error('Error checking file existence in R2:', error);
      throw error;
    }
  }

  /**
   * Get file metadata from R2
   * @param {string} key - R2 object key
   * @returns {Promise<{contentType: string, contentLength: number}>}
   */
  async getFileMetadata(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const response = await this.client.send(command);
      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new AppError('File not found in storage', 'FILE_NOT_FOUND', 404);
      }
      logger.error('Error getting file metadata from R2:', error);
      throw new AppError('Failed to retrieve file metadata', 'R2_METADATA_ERROR', 500);
    }
  }

  /**
   * Delete a file from R2
   * @param {string} key - R2 object key
   */
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      logger.info(`File deleted from R2: ${key}`);
    } catch (error) {
      logger.error('Error deleting file from R2:', error);
      // Don't throw - cleanup operations should be lenient
    }
  }

  /**
   * Generate a presigned URL for direct access (optional)
   * @param {string} key - R2 object key
   * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
   * @returns {Promise<string>} - Presigned URL
   */
  async getPresignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error('Error generating presigned URL:', error);
      throw new AppError('Failed to generate file access URL', 'R2_PRESIGNED_URL_ERROR', 500);
    }
  }

  /**
   * Get content type based on file type
   */
  getContentType(fileType) {
    return fileType === 'pdf' ? 'application/pdf' : 'video/mp4';
  }
}

module.exports = new R2Service();
