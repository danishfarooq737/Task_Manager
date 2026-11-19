const express = require('express');
const AuthController = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { requireAuth } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiterMiddleware');
const idempotency = require('../middleware/idempotencyMiddleware');

const router = express.Router();

// Public Authentication endpoints with Anti-Brute Force rate limiting
router.post('/register', authLimiter, idempotency, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, idempotency, validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

// Protected session profile
router.get('/me', requireAuth, AuthController.getMe);

module.exports = router;
