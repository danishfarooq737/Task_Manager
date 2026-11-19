const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Higher-Order Middleware for Zod Schema Validation
 * Validates req.body, req.query, or req.params and formats error payload
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req[source]);
      req[source] = validatedData; // sanitize and replace with parsed values
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));

        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
          success: false,
          statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
          message: 'Input validation failed. Please correct the highlighted errors.',
          errors: formattedErrors
        });
      }
      next(err);
    }
  };
};

module.exports = validate;
