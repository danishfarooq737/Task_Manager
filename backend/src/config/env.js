const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/df_taskmanager'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_COOKIE_EXPIRES_DAYS: z.string().transform(Number).default('7'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('200'),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('15'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ FATAL: Invalid backend environment configuration:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  // FIX (Vercel serverless): process.exit(1) yahan NAHI chal sakta.
  // Serverless function mein process.exit container ko abruptly kill karta
  // hai aur Vercel har request par 500 FUNCTION_INVOCATION_FAILED deta hai.
  // Error throw karein taake Vercel logs mein saaf wajah nazar aaye.
  // (Render/local par server.js ka apna handling waise hi kaam karta hai.)
  throw new Error(
    'Invalid backend environment configuration — check Vercel env vars (JWT_SECRET kam se kam 16 characters ka hona chahiye)'
  );
}

module.exports = Object.freeze(parsedEnv.data);
