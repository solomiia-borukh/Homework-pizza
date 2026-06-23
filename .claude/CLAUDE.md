# Project Overview
- This project follows Feature-Sliced Design (FSD).
- The goal is to keep the codebase simple, maintainable, and easy to understand.
- Favor readability over clever solutions.

---

# Tech Stack
- Next.js 16
- TypeScript
- Drizzle ORM
- Supabase
- Better Auth
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- pnpm (package manager)
- Vitest + React Testing Library (testing)

---

# Architecture
- Follow Feature-Sliced Design.
- Never violate layer boundaries.

## Project structure

```
src/
├── app/
│   ├── (web)/            # Next.js routing (route group): page.tsx, layout.tsx, not-found.tsx, error.tsx, loading.tsx, nested routes
│   ├── (api)/            # Next.js routing (route group): api/[...route]/route.ts
│   ├── modules/          # Layer — main business logic
│   ├── widgets/          # Layer — self-sufficient parts of functionality/interface
│   ├── features/         # Layer — reusable implementations
│   ├── entities/         # Layer — business entities (slices: api/, models/)
│   └── shared/           # Layer — reusable code (segments: ui/, hooks/, store/, interfaces/, assets/, validation/, providers/)
├── config/               # App config (segments: env/, fonts/, styles/)
└── pkg/                  # External packages/utilities
```

## Layer dependency order (a layer imports from below only)

```
(web) / (api)   routing
modules         highest business layer
widgets
features
entities
shared          lowest, no business logic
```

Boundary rules (NEVER violate):
- A layer may import ONLY from layers below it (`modules` → `widgets` → `features` → `entities` → `shared`).
- `entities` must NOT import from `features`, `widgets`, `modules`.
- `features` must NOT import from `widgets`, `modules`.
- Slices in the same layer must NOT import each other directly.
- Cross-slice imports go ONLY through the slice's `index.ts` (public API) — never reach into internal files/segments.
- `config/` and `pkg/` are leaf utilities; layers may import them, they import nothing upward.

---

# Naming Conventions (FSD-aligned)

Naming must be consistent, domain-driven, and aligned with Feature-Sliced Design.

## Files

- Pages: `page.tsx`
- Layouts: `layout.tsx`
- Components: `component-name.component.tsx`
- Modules (main business logic; the `modules` layer, distinct from `features`): `module-name.module.ts`
- Services: `service-name.service.ts`
- Stores: `store-name.store.ts`
- Hooks: `hook-name.hook.ts`
- Models: `model-name.model.ts`
- APIs: `api-name.api.ts`
- Queries (TanStack Query): `api-name.query.ts`
- Mutations (TanStack Query): `api-name.mutation.ts`
- Constants: `constant-name.constant.ts`
- Interfaces: `interface-name.interface.ts`

Rules:
- Use kebab-case for all files
- Use lowercase only
- Avoid abbreviations unless standard (e.g. id, api)

## Directories

- kebab-case: `user-profile`, `order-history`
- Singular for UI components: `button`, `card`
- Plural for collections: `users`, `orders`

## FSD Naming Constraint

- Prefer domain-first naming (e.g. `billing`, `profile`, `auth`)
- Slice names must represent a feature or entity, not implementation detail

---

# Development Workflow
Every task must follow this workflow:

1. Analyze the task and existing code.
2. Ask clarifying questions if information is missing or ambiguous.
3. Create a detailed implementation plan.
4. Wait for approval.
5. Implement only after approval.
6. Explain what was changed and why.
Never start writing code immediately.

---

# Coding Standards
- Use TypeScript.
- Never use any.
- Prefer explicit types.
- Use arrow functions.
- Prefer ComponentProps<'element'> over HTMLAttributes.

---

# Next.js Rules
- Prefer Server Components.
- Use Client Components only when necessary.
- Prefer Route Handlers over Server Actions unless Server Actions are clearly the better choice.
- Prefer redirect() and notFound() where appropriate.
- Avoid unnecessary "use client".

---

# TanStack Query Rules
- Use placeholderData when appropriate.
- Use invalidateQueries after successful mutations.
- Prefer optimistic updates when they improve UX.
- Use hydration whenever server-fetched data is available.
- Throw errors using throwOnError when appropriate.

---

# Better Auth Rules
- Use Better Auth.
- Use drizzleAdapter.
- Do not modify Better Auth tables without explicit permission.

---

# Drizzle Rules
- Use Drizzle for all database access.
- Do not use raw SQL unless explicitly requested.
- Keep schema changes inside migrations.
- Prefer typed queries.

---

# UI Rules
- Use Tailwind CSS.
- Prefer shadcn/ui components.
- Add shadcn/ui components by copying their source manually into `src/app/shared/ui/<name>/<name>.component.tsx` (+ `index.ts`) — do NOT use the shadcn CLI (`npx shadcn add`). Match the project style (`base-nova` / `neutral`, per `components.json`) and import `cn` from `@/pkg/utils`.
- Keep the `shadcn` package in `devDependencies`: the `base-nova` style imports its base CSS preset via `@import "shadcn/tailwind.css"` in `global.css`. It is a build-time style asset, not the CLI workflow — do not remove it.
- Use Lucide icons.
- Use cn() for all conditional class names.
- Avoid inline styles.
- All clickable elements (buttons, links, icon buttons) must have the `cursor-pointer` Tailwind class.
- Every page must be responsive using a **mobile-first** approach. Breakpoints: default (mobile), `sm:` 640px, `md:` 768px, `lg:` 1024px. Never write desktop-first overrides.

---

# Dependency Management
If a dependency might improve the implementation:
- explain why it is needed;
- explain available alternatives;
- explain trade-offs;
- wait for approval before installing anything.

---

# Language
- Write everything in the project in English: code, identifiers, comments, commit messages, documentation, and UI copy.

---

# Communication
- Ask clarifying questions whenever requirements are unclear.
- Do not guess project requirements.
- If multiple implementation options exist, explain them and recommend one.
- When introducing a new API, library, or framework feature, briefly explain why it is being used.

---

# Do Not Do
- Do not refactor unrelated code.
- Do not change architecture without permission.
- Do not rename files unless requested.
- Do not introduce abstractions without a clear reason.
- Do not optimize code prematurely.
- Temporary comments added during implementation should be removed before the task is completed.

---
