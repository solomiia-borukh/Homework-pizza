---
name: testing
description: Testing conventions for this project — Vitest + React Testing Library, behavior-focused, deterministic tests with minimal mocking. Covers what to test, file placement/naming, mocking rules, coverage targets, and the plan-first testing workflow. Use when writing, structuring, or reviewing tests.
---

# testing — Vitest + React Testing Library

Tools: **Vitest** (runner, integration + unit), **React Testing Library** (component/page
behavior), **jsdom** environment. Tests import via the `@/*` alias, so Vitest must resolve
it (e.g. `vite-tsconfig-paths` or a `test.alias`).

## General principles

- Use Vitest for all tests.
- Prefer testing **behavior** over implementation details.
- Tests must be **deterministic** and **independent** (no shared state, no ordering deps).
- Avoid unnecessary mocking.
- Keep tests simple and readable.
- Follow **Arrange → Act → Assert**.

## Test location & naming

Tests live in a top-level `tests/` directory:

```
tests/
├── integration/
│   ├── pages/        # page behavior via React Testing Library  → *.spec.tsx
│   └── api/          # route-handler integration                → *.spec.ts
└── unit/             # pure logic, mirrors the slice path        → *.spec.ts
```

- **Suffix:** `*.spec.tsx` for tests that render JSX (pages, components, hooks-with-render); `*.spec.ts` for pure logic (no JSX).
- `tests/unit/` mirrors the source path of what it tests, e.g. a service in `entities/.../order.service.ts` → `tests/unit/entities/.../order.service.spec.ts`.
- kebab-case file names, consistent with the source file they cover.

## What to test

Priority order:

1. Business logic
2. Services
3. Utilities
4. Validation logic (Zod schemas)
5. Custom hooks

For each, cover: **success cases, edge cases, error cases**. Every non-trivial
function gets tests for both valid and invalid input.

## What NOT to test

- Framework internals.
- Simple React rendering wrappers.
- Tailwind classes / styling.
- Implementation details.
- Third-party library behavior.

## Mocking rules

- Prefer real implementations.
- Mock **external dependencies only** — never pure functions.
- Mock: network requests, the database (the Drizzle client in `@/pkg/db`), authentication providers (`@/pkg/auth` / Better Auth), and external APIs.
- Do not mock our own pure functions, validation schemas, or utilities — test them for real.
- **Do not mock TanStack Query** (`useQuery`, `useMutation`, `useInfiniteQuery`, etc.). Mock the underlying fetch/API call instead — TanStack Query is an implementation detail that should work transparently in tests.

## React testing

- Use React Testing Library; test user-visible behavior.
- Query by **role, label, or text** — never by class name or implementation detail.

```ts
// Preferred
screen.getByRole('button', { name: /submit/i })

// Avoid
container.querySelector('.submit-button')
```

## Coverage

- Target: **100% of all logic** — business logic, services, utilities, validation, hooks.
- **Exclude from coverage** (consistent with "What NOT to test"): UI components (`shared/ui/**`), page/layout/route-group shells (`app/**` routing files), `config/**`, generated code (`drizzle/**`, `.next/**`), and the test files themselves.
- Never raise coverage with meaningless tests. Coverage is a side effect of testing real behavior, not the goal.

## Test structure

### Test function

Always use `test(...)`, never `it(...)`. Every test name must start with `"it "`:

```ts
test('it creates an order successfully', () => {})
test('it throws when the cart is empty', () => {})
```

### Top-level describe

The outermost `describe` follows this exact format:

```
"<TestType> | <ComponentType> | <ComponentName>"
```

- **TestType:** `Unit` or `Integration`
- **ComponentType:** `Page` (full-page integration tests) or `Component` (isolated component / widget / feature tests)
- **ComponentName:** PascalCase name of the component under test, e.g. `ItemCard`, `ItemsList`, `LoginPage`

Examples:

```ts
describe('Unit | Component | ItemCard', () => { ... })
describe('Integration | Page | LoginPage', () => { ... })
describe('Integration | Component | ItemsList', () => { ... })
describe('Integration | Component | ToggleFavoriteButton', () => { ... })
```

Nested `describe` blocks group related cases and use plain English labels (no format constraint):

```ts
describe('Unit | Component | ItemCard', () => {
  test('it renders the title', () => {})

  describe('Edge cases', () => {
    test('it shows an em dash when description is null', () => {})
  })
})
```

- One behavior per test.
- Descriptive test names (state the expected behavior, not the method name alone).

## Before writing tests (plan first)

Every testing task follows this — never start writing tests immediately:

1. Analyze the implementation.
2. Identify critical paths.
3. Identify edge cases.
4. Create a test plan.
5. Wait for approval.
6. Implement the tests.
