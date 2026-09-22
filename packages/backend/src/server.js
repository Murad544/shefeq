require('dotenv').config();
const app = require('./app');
const appConfig = require('./config/appConfig');

const sessionCleanupWorker = require('./workers/sessionCleanupWorker');

const port = appConfig.get('port');

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${appConfig.get('environment')}`);
  sessionCleanupWorker.start();
});

const gracefulShutdown = () => {
  sessionCleanupWorker.stop();
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  gracefulShutdown();
});

module.exports = server;
