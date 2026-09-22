const gameService = require('../services/gameService');
const appConfig = require('../config/appConfig');

class SessionCleanupWorker {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  start(
    intervalMs = appConfig.get('gameHeartbeatCleanupIntervalMs') || 15000,
    timeoutSeconds = appConfig.get('gameHeartbeatTimeoutSeconds') || 90,
  ) {
    if (this.intervalId) {
      return;
    }

    this.intervalMs = intervalMs;
    this.timeoutSeconds = timeoutSeconds;

    // Run an initial cleanup immediately upon startup
    this.runCleanup();

    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, this.intervalMs);

    if (this.intervalId && typeof this.intervalId.unref === 'function') {
      this.intervalId.unref();
    }

    console.log(
      `[SessionCleanupWorker] Started background cleanup every ${this.intervalMs / 1000}s (timeout: ${this.timeoutSeconds}s)`,
    );
  }

  async runCleanup() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    try {
      await gameService.endInactiveSessions(this.timeoutSeconds);
    } catch (error) {
      console.error('[SessionCleanupWorker] Error during inactive session cleanup:', error);
    } finally {
      this.isRunning = false;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[SessionCleanupWorker] Stopped background cleanup');
    }
  }
}

module.exports = new SessionCleanupWorker();
