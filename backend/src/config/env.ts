import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1).default('__sup33r@s3cr3t__'),
  DRIZZLE_OUT: z.string().optional(),
  DRIZZLE_SCHEMA: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

process.env = Object.create({ ...process.env, ...envSchema.parse(process.env) })