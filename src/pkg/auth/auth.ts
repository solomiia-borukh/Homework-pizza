import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/pkg/db'
import { account, session, user, verification } from '@/pkg/db/auth-schema'

const secret = process.env.BETTER_AUTH_SECRET

if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is not set in .env.local')
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  emailAndPassword: { enabled: true },
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
})
