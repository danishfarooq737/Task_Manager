const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Catch Uncaught Synchronous Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down... ${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Establish Database Connection
// connectDB ab error throw karta hai, is liye yahan catch karna zaroori hai
connectDB().catch((err) => {
  logger.error(`❌ Startup DB failure: ${err.message}`);
  // Production mein band kar dein, development mein server chalta rahe
  if (env.NODE_ENV === 'production') {
    logger.error('Exiting process due to database connection failure in production.');
    process.exit(1);
  }
});

// Start HTTP Server
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 DF TaskManager Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`📡 Health Endpoint: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
});

// Handle Unhandled Async Promise Rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! Shutting down server... ${err.name}: ${err.message}`);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful Termination Handlers
const handleGracefulShutdown = (signal) => {
  logger.warn(`${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));