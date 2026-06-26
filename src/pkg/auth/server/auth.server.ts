import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import {
  account,
  session,
  user,
  verification,
} from '@/app/entities/schemas/auth.schema'
import { db } from '@/config/db'

const secret = process.env.BETTER_AUTH_SECRET
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is not set in .env.local')
}

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local',
  )
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false,
    },
  },
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
})

export const authServer = {
  getSession: async () => {
    return await auth.api.getSession({ headers: await headers() })
  },
}
