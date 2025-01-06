import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'
import { env } from './data/server';
dotenv.config({path: '.env'})


export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});