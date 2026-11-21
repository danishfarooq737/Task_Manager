const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const sanitizeInputs = require('./middleware/sanitizeMiddleware');
const { apiLimiter } = require('./middleware/rateLimiterMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Trust proxy for secure cookies and rate limiting behind reverse proxies (Render, Vercel, Nginx)
app.set('trust proxy', 1);

// ---- Allowed origins (shared by CORS and CSP) ----
// CORS_ORIGIN may contain one or more origins separated by commas.
// Spaces and trailing slashes are removed so the match is exact.
const configuredOrigins = (env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// Allows every Vercel deployment of this project (production + previews),
// e.g. https://taskmanager-8prvogdsm-gro-internship.vercel.app
const vercelPreviewPattern = /^https:\/\/taskmanager-[a-z0-9-]+-gro-internship\.vercel\.app$/;

// 1. Helmet Security Headers (OWASP Mitigation)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...allowedOrigins]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// 2. Strict CORS Policy (Zero Trust - No Wildcards)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        vercelPreviewPattern.test(origin) ||
        env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }

      // Rejected origin: log it and respond WITHOUT CORS headers.
      // (Passing an Error here would turn the preflight into a 500.)
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true, // Allow HttpOnly authentication cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Requested-With'],
    optionsSuccessStatus: 204
  })
);

// 3. Request Logging via Morgan & Winston
const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// 4. Body Parser with 10kb limit to mitigate payload-based Denial of Service
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. Data Sanitization against NoSQL injection
app.use(mongoSanitize({ replaceWith: '_' }));

// 6. Zero-Trust XSS & Prototype Pollution Sanitization
app.use(sanitizeInputs);

// 6.5 Database connection (serverless-friendly: checked on every request, connection is reused)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// 7. Global API Rate Limiting
app.use(env.API_PREFIX, apiLimiter);

// 8. Route Mounting
app.use(`${env.API_PREFIX}/health`, healthRoutes);
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/tasks`, taskRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'DF TaskManager Backend API',
    version: '1.0.0',
    documentation: `${env.API_PREFIX}/health`,
    status: 'online'
  });
});

// 9. 404 Route Not Found Handler
app.use(notFoundHandler);

// 10. Global Silent-Failure Error Handler
app.use(errorHandler);

module.exports = app;
