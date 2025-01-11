import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { singleton } from './singleton'

export const db = singleton('db', getDrizzleClient)

function getDrizzleClient() {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  const client = postgres(connectionString, { prepare: false })
  return drizzle(client, { schema })
}
