import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema/index'

const drizzleClient = drizzle(process.env.DATABASE_URL!, { schema })

export type DB = typeof drizzleClient

export const db = drizzleClient
