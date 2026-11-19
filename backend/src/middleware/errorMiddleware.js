const HTTP_STATUS = require('../constants/httpStatus');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Zero-Leakage Global Error Handler
 * Logs full diagnostic trace internally while shielding client from stack traces
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected internal error occurred';
  let errors = err.errors || null;

  // Internal diagnostic logging (Server-side ONLY)
  logger.error({
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
    errors: err.errors
  });

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Resource not found with specified identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `${field} already exists. Please use a unique value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message
    }));
    message = 'Data validation failed. Please check submitted values.';
  }

  // Shield client in production
  if (env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'A secure server error occurred. Our team has been notified.';
    errors = null;
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Route Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found.`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
