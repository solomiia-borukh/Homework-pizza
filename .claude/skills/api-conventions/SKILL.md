---
name: api-conventions
description: Data-access conventions for this project — Supabase (Postgres) accessed only through Drizzle ORM, schema in a dedicated file, and migrations via Drizzle Kit. Use when adding or changing database tables, writing queries/mutations for items or favorites, setting up the Drizzle client, or reviewing data-access code.
---

# api-conventions — Supabase + Drizzle data access

The single source of truth for how this project reads and writes data.
Database: Supabase (Postgres). ORM: Drizzle ORM + Drizzle Kit.

## Core rules

1. **No external APIs for app data.** List data lives in our own Supabase table and is read through Drizzle. Do not call third-party APIs for it.
2. **All access to `items` and `favorites` goes through Drizzle only.** No raw SQL and no `supabase-js` client for these tables. supabase-js is not used for data access at all — Supabase is only the Postgres host.
3. **No raw SQL** unless the user explicitly requests it (incl. Drizzle's `sql` template). Prefer typed queries.
4. **Schema lives in a dedicated file.** Schema changes are kept in migrations, never applied ad hoc.
5. **The Drizzle client is server-only.** Never import it into a Client Component or any code that ships to the browser.

## File layout

```
drizzle.config.ts            # Drizzle Kit config (schema path, out dir, dialect, dbCredentials)
src/pkg/db/
├── schema.ts                # all table definitions (the dedicated schema file)
├── client.ts                # the Drizzle client instance (server-only)
└── index.ts                 # public exports
drizzle/                     # generated migration SQL + meta (committed to the repo)
```

Queries/mutations belong in the FSD entities layer, per `fsd-slice`:
```
src/app/entities/api/<name>/
├── <name>.api.ts            # query/mutation functions using the Drizzle client
├── <name>.query.ts          # TanStack Query options
├── <name>.mutation.ts       # TanStack mutations
└── index.ts
```

## Schema conventions (`src/pkg/db/schema.ts`)

- Define every table with Drizzle's `pgTable`. One dedicated schema file (split only if it grows large, keeping it under `src/pkg/db/`).
- Derive types from the schema — do not hand-write row types:
  ```ts
  export type Item = typeof items.$inferSelect;
  export type NewItem = typeof items.$inferInsert;
  ```
- Feed these inferred types into the entity's `*.interface.ts` rather than duplicating shapes.
- Do not modify Better Auth tables without explicit permission.

## Client conventions (`src/pkg/db/client.ts`)

- Create one Drizzle client instance and reuse it (no per-request connection churn).
- Connect to Supabase Postgres via the connection string in `.env.local`. Read it server-side only; never expose it to the browser.
- Mark the module server-only so accidental client imports fail at build time.

## Query conventions

- All `items` / `favorites` reads and writes are typed Drizzle queries in `*.api.ts`.
- Wrap them in TanStack Query (`*.query.ts` / `*.mutation.ts`): `invalidateQueries` after a successful mutation, `placeholderData` where useful, optimistic updates where they improve UX, `throwOnError` where appropriate.
- No raw SQL string concatenation. Use Drizzle's query builder and operators (`eq`, `and`, `desc`, etc.).

## Migrations workflow (Drizzle Kit)

Schema changes MUST go through generated migration files committed to the repo.
`generate` + `migrate` is the one and only path — it keeps SQL migrations in the
repo, reproducible and safe for the team/production.

1. Edit `src/pkg/db/schema.ts`.
2. **Generate** the migration: `drizzle-kit generate` → writes SQL into `drizzle/`.
3. **Apply** it: `drizzle-kit migrate`.
4. Commit the generated SQL together with the schema change.

## Review checklist (when auditing data-access code)

- Any `items`/`favorites` access bypassing Drizzle (raw SQL, supabase-js)? → flag.
- Drizzle client imported into a Client Component / browser code? → flag.
- Row types hand-written instead of `$inferSelect`/`$inferInsert`? → flag.
- Schema changed without a generated migration in `drizzle/`? → flag.
- Mutation without `invalidateQueries` on success? → flag.
- Better Auth tables modified without explicit permission? → flag.
