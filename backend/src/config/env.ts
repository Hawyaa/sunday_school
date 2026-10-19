import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((v) => parseInt(v, 10)).default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ADMIN_INITIAL_EMAIL: z.string().email().optional(),
  ADMIN_INITIAL_PASSWORD: z.string().min(8).optional(),
  ADMIN_INITIAL_NAME: z.string().min(2).optional(),
  ADMIN_INITIAL_ROLE: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).default('SUPER_ADMIN'),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.string().transform((v) => parseInt(v, 10)).default('900000'),
  LOGIN_RATE_LIMIT_MAX: z.string().transform((v) => parseInt(v, 10)).default('10'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
