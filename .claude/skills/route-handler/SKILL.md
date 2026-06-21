---
name: route-handler
description: Routing and API conventions for this project — Next.js 16 App Router, Server Components for initial render, route handlers under (api)/, the Better Auth catch-all, and protecting /favorites via proxy.ts. Use when adding pages or API routes, rendering list/detail data, wiring auth routing, protecting routes, or reviewing routing code.
---

# route-handler — Next.js 16 App Router & API routes

Routing conventions for this project. Builds on `fsd-slice` (where routes live),
`auth-setup` (the auth handler), and `api-conventions` (data access).

## Core rules

1. **App Router** (Next.js 16) for all routing.
2. **Server Components for initial render** of the list and the details views — fetch their data on the server through Drizzle. Avoid `"use client"` for the initial render.
3. **Route handlers** live under the `(api)` route group; reads/writes go through Drizzle only (see `api-conventions`).
4. **Protect `/favorites`** — primary approach is `proxy.ts`; server-side session check is the alternative (see below).

## Routing layout

```
proxy.ts                                   # root — Next.js 16 replacement for middleware
src/app/
├── (web)/                                 # pages
│   ├── page.tsx                           # list (Server Component, initial render)
│   ├── layout.tsx
│   ├── loading.tsx / error.tsx / not-found.tsx   # optional
│   ├── <item>/page.tsx                    # detail (Server Component, initial render)
│   ├── favorites/page.tsx                 # protected
│   ├── login/page.tsx
│   └── register/page.tsx
└── (api)/api/
    ├── auth/[...all]/route.ts             # Better Auth catch-all (see auth-setup)
    └── favorites/route.ts                 # data route handler
```

## Initial render (Server Components)

- The list page and detail page are Server Components.
- Fetch their data on the server via the entity's Drizzle queries (`entities/api/...`), not client-side.
- Pass data down as props; add `"use client"` only for the interactive leaves that need it.

## Auth route handler

`/api/auth/[...all]/route.ts` mounts Better Auth via `toNextJsHandler(auth)` and exports `GET`/`POST`. Full details live in `auth-setup` — do not redefine them here.

## Protecting `/favorites`

**Primary — `proxy.ts`** (root, replaces middleware in Next.js 16):
- Check the session; if absent, redirect to `/login`.
- Scope it to the protected paths (e.g. matcher/condition for `/favorites`), not the whole app.

**Alternative — server-side check** (when route-level logic is clearer):
- In the `/favorites` Server Component (or its layout), read the session server-side; if absent, `redirect("/login")`.

Pick one per route; do not double-guard the same path redundantly.

## Data route handler conventions

For data routes such as `/api/favorites`:

- One `route.ts` per resource; export named HTTP methods (`GET`, `POST`, `DELETE`, …) as arrow functions.
- **Check the session first** — reject unauthenticated requests before touching data.
- **Validate input** before use; on invalid input return a 4xx with a clear error.
- **Data access through Drizzle only** — typed queries from `entities/api`, no raw SQL, no supabase-js.
- **Consistent response shape** — return typed JSON and meaningful status codes; never leak internal errors.
- No `any`; explicit types; arrow functions.

## Review checklist (when auditing routing code)

- List/detail initial render done client-side instead of in a Server Component? → flag.
- `"use client"` on a component that does not need interactivity? → flag.
- Data route accessing the DB without Drizzle (raw SQL / supabase-js)? → flag.
- Data route handler missing a session check or input validation? → flag.
- `/favorites` unprotected (no `proxy.ts` rule and no server-side redirect)? → flag.
- The same path guarded twice redundantly? → flag.
- Auth handler details duplicated here instead of referencing `auth-setup`? → flag.
