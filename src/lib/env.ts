import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters for secure session hashing'),
  OPEN_METEO_BASE_URL: z.string().url().default('https://api.open-meteo.com'),
  GEMINI_API_KEY: z.string().optional(),
  TOMTOM_API_KEY: z.string().optional(),
  MAPBOX_ACCESS_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration. Check your .env file against .env.example.');
  }
  return result.data;
}

export const env = getEnv();
