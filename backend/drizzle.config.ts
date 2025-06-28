import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: process.env.DRIZZLE_OUT || './src/db/migrations',
  schema: process.env.DRIZZLE_SCHEMA || './src/db/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    prefix: 'timestamp'
  },
}) satisfies Config;
