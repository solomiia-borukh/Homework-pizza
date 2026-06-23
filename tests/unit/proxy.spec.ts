import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { proxy } from '@/proxy'

vi.mock('better-auth/cookies')

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

    test('it redirects /favorites to /login', () => {
      const res = run('/favorites')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/login`)
    })

    test('it redirects nested /favorites paths to /login', () => {
      const res = run('/favorites/42')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/login`)
    })

    test('it lets go to /login', () => {
      const res = run('/login')

      expect(res.headers.get('location')).toBeNull()
    })

    test('it lets go to /register', () => {
      const res = run('/register')

      expect(res.headers.get('location')).toBeNull()
    })
  })

  describe('With a session cookie', () => {
    beforeEach(() => setSession(true))

    test('it redirects /login to /', () => {
      const res = run('/login')

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${ORIGIN}/`)
    })

    test('it redirects /register to /', () => {
      const res = run('/register')

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
