---
name: auth-setup
description: Authentication conventions for this project — Better Auth with email + password, the Drizzle adapter over Supabase Postgres, server/client setup, and session handling. Use when wiring up auth, adding sign-in/sign-up, reading the session in Server Components, protecting routes, or reviewing auth code.
---

# auth-setup — Better Auth (email + password)

How this project does authentication. Library: Better Auth. Adapter: Drizzle over
Supabase Postgres (see `api-conventions`).

## Core rules

1. **Email + password** is the auth method.
2. **Drizzle adapter:** `drizzleAdapter(db, { provider: "pg", schema })` — reuse the same Drizzle client from `src/pkg/db`.
3. **`BETTER_AUTH_SECRET`** (min. 32 chars) lives in `.env.local`, read server-side only, **never committed**.
4. **Do not modify Better Auth tables** (its generated schema) without explicit permission.
5. The Drizzle client and server auth instance are **server-only** — never import them into client code.

## File layout

```
src/pkg/auth/
├── auth.ts          # server-side betterAuth() instance (server-only)
├── auth-client.ts   # createAuthClient() for React (browser)
└── index.ts         # public exports
src/app/(api)/api/auth/[...all]/route.ts   # required mount (see below)
```

## Server config (`src/pkg/auth/auth.ts`)

- Create the `betterAuth()` instance with:
  - `database: drizzleAdapter(db, { provider: "pg", schema })` — `db` and `schema` imported from `src/pkg/db`.
  - `emailAndPassword: { enabled: true }`.
  - `secret` from `process.env.BETTER_AUTH_SECRET` (read here, server-side only).
- This module is server-only; importing it from a Client Component must fail at build time.

## Route handler (required for the client to work)

The client and session calls hit `/api/auth/*`, so the catch-all handler must exist:

```
src/app/(api)/api/auth/[...all]/route.ts
```
Mount the Better Auth handler there (e.g. `toNextJsHandler(auth)`), exporting `GET` and `POST`. Without this mount, sign-in/sign-up and session reads will not work.

## Client (`src/pkg/auth/auth-client.ts`)

- Create the client with `createAuthClient()`.
- Expose what the UI needs (e.g. `signIn`, `signUp`, `signOut`, `useSession`).
- This is the only auth surface a Client Component should import — never the server `auth` instance.

## Session handling

- **Server Components / Route Handlers:** read the session from the server `auth` instance (`auth.api.getSession({ headers })`) — do not fetch it through the client.
- **Client Components:** use the client's `useSession()`.
- **Protecting routes:** in a Server Component or layout, get the session server-side; if absent, `redirect()` to the sign-in route. Prefer this over client-side guards.

## Environment

- `BETTER_AUTH_SECRET` (≥ 32 chars) and the DB connection string both live in `.env.local`.
- `.env.local` is git-ignored — verify it is not committed.
- Never expose these to the browser.

## Review checklist (when auditing auth code)

- Server `auth` instance or Drizzle client imported into client code? → flag.
- `BETTER_AUTH_SECRET` missing, under 32 chars, hardcoded, or committed? → flag.
- Adapter not `drizzleAdapter(db, { provider: "pg", schema })`? → flag.
- Session read through the client in a Server Component instead of server-side? → flag.
- Better Auth tables modified without explicit permission? → flag.
- Catch-all `/api/auth/[...all]/route.ts` missing? → flag.
