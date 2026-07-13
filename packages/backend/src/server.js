require('dotenv').config();
const app = require('./app');
const appConfig = require('./config/appConfig');

const port = appConfig.get('port');

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${appConfig.get('environment')}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
