import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as authSchema from '@/app/entities/schemas'
import * as appSchema from '@/app/entities/schemas'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env.local')
}

const schema = { ...appSchema, ...authSchema }

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
