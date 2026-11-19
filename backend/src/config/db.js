const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('Database connection already established.');
    return;
  }

  const options = {
    maxPoolSize: 20, // Concurrency load management: connection pooling
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, options);
    isConnected = true;
    logger.info(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In development or test, we do not abruptly exit so the app can still serve fallback endpoints
    if (env.NODE_ENV === 'production') {
      logger.error('Exiting process due to database connection failure in production.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected. Retrying connection...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB runtime connection error: ${err.message}`);
});

module.exports = connectDB;
