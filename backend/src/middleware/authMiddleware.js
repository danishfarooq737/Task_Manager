const jwt = require('jsonwebtoken');
const HTTP_STATUS = require('../constants/httpStatus');
const AppError = require('../utils/appError');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Require Authentication Middleware
 * Enforces JWT verification via HttpOnly cookie or Authorization Header
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check HttpOnly cookie first (recommended secure browser practice)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', HTTP_STATUS.UNAUTHORIZED));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser || !currentUser.isActive) {
      return next(new AppError('The user belonging to this token no longer exists or is deactivated.', HTTP_STATUS.UNAUTHORIZED));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token.', HTTP_STATUS.UNAUTHORIZED));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED));
    }
    next(err);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to req if token exists, but does not block guests
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id).select('-password');
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    }
    next();
  } catch {
    // Silently continue for guests
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth
};
