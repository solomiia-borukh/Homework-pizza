import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { proxy } from '@/proxy'

vi.mock('better-auth/cookies')
vi.mock('next-intl/middleware', () => ({
  default: () => () => new Response(null, { status: 200 }),
}))
vi.mock('@/pkg/locale', () => ({
  routing: { locales: ['en'], defaultLocale: 'en', localePrefix: 'as-needed' },
}))

const ORIGIN = 'http://localhost:3000'

const run = (path: string) =>
  proxy(new NextRequest(new URL(`${ORIGIN}${path}`)))

const setSession = (present: boolean) =>
  vi.mocked(getSessionCookie).mockReturnValue(present ? 'session-token' : '')

beforeEach(() => {
  vi.mocked(getSessionCookie).mockReset()
})

describe('Unit | Page | Proxy', () => {
  describe('Without a session cookie', () => {
    beforeEach(() => setSession(false))

    test('it redirects /favorites to /sign-in', () => {
      const res = run('/favorites')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/sign-in`)
    })

    test('it redirects nested /favorites paths to /sign-in', () => {
      const res = run('/favorites/42')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/sign-in`)
    })

    test('it lets go to /sign-in', () => {
      const res = run('/sign-in')

      expect(res.headers.get('location')).toBeNull()
    })

    test('it lets go to /sign-up', () => {
      const res = run('/sign-up')

      expect(res.headers.get('location')).toBeNull()
    })
  })

  describe('With a session cookie', () => {
    beforeEach(() => setSession(true))

    test('it redirects /sign-in to /', () => {
      const res = run('/sign-in')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/`)
    })

    test('it redirects /sign-up to /', () => {
      const res = run('/sign-up')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/`)
    })

    test('it lets go to /favorites', () => {
      const res = run('/favorites')

      expect(res.headers.get('location')).toBeNull()
    })

    test('it lets nested go to /favorites paths', () => {
      const res = run('/favorites/42')

      expect(res.headers.get('location')).toBeNull()
    })
  })
})
