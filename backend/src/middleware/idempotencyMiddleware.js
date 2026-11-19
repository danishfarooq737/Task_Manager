const IdempotencyLog = require('../models/IdempotencyLog');
const logger = require('../utils/logger');

/**
 * Idempotency Middleware
 * Prevents duplicate state changes caused by rapid double-clicks or network retries
 */
const idempotency = async (req, res, next) => {
  // Only apply to state-modifying requests (POST, PUT, PATCH, DELETE)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];

  if (!idempotencyKey) {
    // If no key provided, continue normally
    return next();
  }

  try {
    // Check if key already processed in IdempotencyLog collection
    const existingRecord = await IdempotencyLog.findOne({ key: idempotencyKey });

    if (existingRecord) {
      logger.info(`Idempotency hit: Returning cached response for key ${idempotencyKey}`);
      res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');
      return res.status(existingRecord.statusCode).json(existingRecord.responseBody);
    }

    // Intercept res.json to capture response payload
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only cache successful or client-controlled outcomes
      if (res.statusCode >= 200 && res.statusCode < 500) {
        IdempotencyLog.create({
          key: idempotencyKey,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          responseBody: body
        }).catch((err) => {
          logger.error(`Failed to store idempotency record: ${err.message}`);
        });
      }

      return originalJson(body);
    };

    next();
  } catch (error) {
    logger.error(`Idempotency check error: ${error.message}`);
    next();
  }
};

module.exports = idempotency;
