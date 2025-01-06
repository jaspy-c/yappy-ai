import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema' // Import the schema
import { env } from '@/data/server'

neonConfig.fetchConnectionCache = true

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const sql = neon(env.DATABASE_URL)

const db = drizzle(sql, { schema }) // Register schema with drizzle

export default db
