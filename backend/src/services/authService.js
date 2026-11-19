const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../constants/httpStatus');
const env = require('../config/env');

class AuthService {
  /**
   * Generate JWT Token
   */
  static generateToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });
  }

  /**
   * Set secure HttpOnly cookie on response
   */
  static attachAuthCookie(res, token) {
    const isProduction = env.NODE_ENV === 'production';
    const cookieOptions = {
      expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
      httpOnly: true, // Prevents XSS client script access
      secure: isProduction, // HTTPS in production
      sameSite: isProduction ? 'strict' : 'lax'
    };

    res.cookie('token', token, cookieOptions);
  }

  /**
   * Register User
   */
  static async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', HTTP_STATUS.CONFLICT);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = this.generateToken(user._id);
    return { user, token };
  }

  /**
   * Login User
   */
  static async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Intentionally generic message to avoid email enumeration attacks
      throw new AppError('Invalid email or password credentials.', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials.', HTTP_STATUS.UNAUTHORIZED);
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = this.generateToken(user._id);
    return { user, token };
  }
}

module.exports = AuthService;
