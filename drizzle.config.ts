import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL')
}

export default defineConfig({
  schema: ['./src/pkg/db/schema.ts', './src/pkg/db/auth-schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
