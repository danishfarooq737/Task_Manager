const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Standardized API Response Structure
 * Ensures uniform JSON responses across all endpoints
 */
class ApiResponse {
  /**
   * Send Success Response
   */
  static success(res, { statusCode = HTTP_STATUS.OK, message = 'Success', data = null, meta = null }) {
    const payload = {
      success: true,
      statusCode,
      message,
      data
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  /**
   * Send Error Response (For controlled, non-exception returns)
   */
  static error(res, { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Internal Error', errors = null }) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors && { errors })
    });
  }
}

module.exports = ApiResponse;
