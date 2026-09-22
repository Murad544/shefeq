class AppConfig {
  constructor() {
    this.config = {
      port: process.env.PORT || 4000,
      environment: process.env.NODE_ENV || 'development',
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
      bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
      uploadsDir: process.env.UPLOADS_DIR || '../../uploads',
      corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
      // Cloudflare R2 Configuration
      r2: {
        endpoint: process.env.R2_ENDPOINT,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucketName: process.env.R2_BUCKET_NAME,
      },
      gameHeartbeatTimeoutSeconds: parseInt(process.env.GAME_HEARTBEAT_TIMEOUT_SECONDS, 10) || 90,
      gameHeartbeatCleanupIntervalMs:
        parseInt(process.env.GAME_HEARTBEAT_CLEANUP_INTERVAL_MS, 10) || 15000,
    };
  }

  get(key) {
    return this.config[key];
  }

  isDevelopment() {
    return this.config.environment === 'development';
  }

  isProduction() {
    return this.config.environment === 'production';
  }
}

module.exports = new AppConfig();
