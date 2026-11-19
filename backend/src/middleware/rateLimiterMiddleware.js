const rateLimit = require('express-rate-limit');
const HTTP_STATUS = require('../constants/httpStatus');
const env = require('../config/env');

/**
 * Standard API Global Rate Limiter
 * Guards against Denial of Service and API scraping
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: 'Too many requests from this IP address. Please try again after 15 minutes.'
    });
  }
});

/**
 * Strict Auth Rate Limiter
 * Guards against credential stuffing and brute force password attempts
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.AUTH_RATE_LIMIT_MAX_REQUESTS, // 15 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: 'Too many authentication attempts. Please wait 15 minutes before retrying.'
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
