const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Auth Controller handles HTTP transport concerns for authentication
 */
class AuthController {
  static async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      AuthService.attachAuthCookie(res, token);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.CREATED,
        message: 'Account registered successfully.',
        data: { user, token }
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.login(req.body);
      AuthService.attachAuthCookie(res, token);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Logged in successfully.',
        data: { user, token }
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    });

    return ApiResponse.success(res, {
      statusCode: HTTP_STATUS.OK,
      message: 'Logged out successfully.'
    });
  }

  static async getMe(req, res) {
    return ApiResponse.success(res, {
      statusCode: HTTP_STATUS.OK,
      message: 'Current authenticated session profile',
      data: { user: req.user }
    });
  }
}

module.exports = AuthController;
