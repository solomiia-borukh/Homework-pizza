# Pizza Homework

A Next.js 16 pizza catalog with authentication and favorites.

## Stack

- **Next.js 16** — App Router, Server Components
- **Drizzle ORM** — database access (Supabase Postgres)
- **Better Auth** — email/password + Google OAuth
- **TanStack Query** — server state, optimistic updates
- **Tailwind CSS** + shadcn/ui

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string. Go to **Supabase → Project Settings → Database → Connection string (URI)**. Use the **Transaction pooler** URL (port 6543) and append `?pgbouncer=true` to avoid connection limit errors in development. |
| `BETTER_AUTH_SECRET` | Random string, minimum 32 characters. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | Base URL of the app. Use `http://localhost:3000` locally. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. Optional — only needed for Google sign-in. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. Optional. |

> **Never commit `.env.local`.** It is listed in `.gitignore`.

### 3. Run migrations

Generate and apply the database schema:

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Seed the database

Populate the `items` table with sample pizzas:

```bash
pnpm db:seed
```

> Running seed multiple times inserts duplicates. If you need a clean slate, truncate the table first via the Supabase SQL editor: `TRUNCATE TABLE items RESTART IDENTITY;`

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (zero warnings) |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm test` | Run all tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:seed` | Seed the database with sample data |
