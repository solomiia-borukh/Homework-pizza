---
name: fsd-slice
description: Scaffold a new Feature-Sliced Design slice (module, widget, feature, entity, shared) with the project's exact folder structure and naming, or audit existing code for layer-boundary and naming violations. Use when adding a new slice, scaffolding folders, or auditing FSD/naming compliance.
---

# fsd-slice — generate and audit Feature-Sliced Design slices

Applies this project's FSD architecture and naming rules. Two modes:
**generate** (scaffold a slice) and **check** (audit existing code).

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

### Layer dependency order (top imports from below only)

```
(web) / (api)   routing
modules         highest business layer
widgets
features
entities
shared          lowest, no business logic
```

**Boundary rules (NEVER violate):**
- A layer may import ONLY from layers below it (`modules` → `widgets` → `features` → `entities` → `shared`).
- `entities` must NOT import from `features`, `widgets`, `modules`.
- `features` must NOT import from `widgets`, `modules`.
- Slices in the same layer must NOT import each other directly.
- Cross-slice imports go ONLY through the slice's `index.ts` (public API) — never reach into internal files/segments.
- `config/` and `pkg/` are leaf utilities; layers may import them, they import nothing upward.

## Slice anatomy per layer

**modules/<module-name>/** (slice)
```
elements/                         # Optional segment — custom elements
  <element-name>/
    <element-name>.component.tsx
    index.ts
  index.ts
<module-name>.module.ts          # required
<module-name>.service.ts          # optional
<module-name>.store.ts            # optional
<module-name>.constant.ts         # optional
<module-name>.interface.ts        # optional
index.ts                          # public API
```

**widgets/<widget-name>/** (slice) — same shape as modules, but entry is:
```
elements/                         # Optional segment
<widget-name>.component.tsx       # required
<widget-name>.service.ts          # optional
<widget-name>.store.ts            # optional
<widget-name>.constant.ts         # optional
<widget-name>.interface.ts        # optional
index.ts
```

**features/<feature-name>/** (slice) — flat, no elements segment:
```
<feature-name>.component.tsx      # required
<feature-name>.service.ts         # optional
<feature-name>.constant.ts        # optional
<feature-name>.interface.ts       # optional
index.ts
```

**entities/** — two fixed slices:
```
api/
  <api-name>/                     # segment
    <api-name>.api.ts
    <api-name>.query.ts
    <api-name>.mutation.ts
    index.ts
  index.ts
models/
  <model-name>.model.ts
  index.ts
```

**shared/** — fixed segments, each with its own `index.ts`:
```
ui/<ui-name>/<ui-name>.component.tsx
hooks/<hook-name>.hook.ts
store/<store-name>.store.ts
interfaces/<interface-name>.interface.ts
assets/icon/<name>.svg
validation/<name>.constant.ts            # shared Zod schemas (e.g. auth.constant.ts)
providers/<name>-provider.component.tsx  # app-wide React providers (e.g. query-provider)
```

**config/** — segments: `env/` (`env.client.ts`, `env.server.ts`), `fonts/` (`font.ts`), `styles/` (`global.css`).

Only create the segments a slice actually needs. Every segment and slice exposes a public `index.ts`.

### shadcn/ui components (manual copy — no CLI)

Do NOT use the shadcn CLI (`npx shadcn add`). Add a component by copying its source
from the shadcn site into our own file, following the normal `shared/ui` naming:

```
shared/ui/<name>/
├── <name>.component.tsx     # pasted shadcn source
└── index.ts                 # re-export the component(s)
```

- Match the project style/base color (`base-nova` / `neutral`, recorded in `components.json`).
- Fix the import of `cn` to `@/pkg/utils`.
- Keep the pasted primitive otherwise as-is (it is vendored code).
- `cn` lives in `src/pkg/utils.ts`.

## Naming rules

**File suffixes:**
| Type | Pattern |
|---|---|
| Page | `page.tsx` |
| Layout | `layout.tsx` |
| Route handler | `route.ts` |
| Component | `name.component.tsx` |
| Module (business logic) | `name.module.ts` |
| Service | `name.service.ts` |
| Store | `name.store.ts` |
| Hook | `name.hook.ts` |
| Model | `name.model.ts` |
| API | `name.api.ts` |
| Query (TanStack) | `name.query.ts` |
| Mutation (TanStack) | `name.mutation.ts` |
| Constant | `name.constant.ts` |
| Interface | `name.interface.ts` |

**Files & folders:** kebab-case, lowercase, no abbreviations (exceptions: `id`, `api`).
**Folders:** singular for UI components (`button`, `card`), plural for collections (`users`, `orders`).
**Slice names:** domain-first (`billing`, `profile`, `auth`), never named after implementation detail.

---

## Mode: GENERATE

When asked to create a slice / module / widget / feature / entity.

1. **Clarify if not explicit:** slice name (kebab-case, domain-first), target layer, and which optional segments are needed.
2. **Check it doesn't already exist** — if it does, extend the existing slice instead of duplicating.
3. **If a slice already exists in that layer, copy its pattern** (folder shape, `index.ts` style); otherwise use the layout above.
4. **Create folders and files** with correct suffixes and kebab-case. Each file is a minimal valid skeleton.
5. **Add/update `index.ts`** for the slice and any touched segment — export only the public API.
6. **Explain what was created and why** the structure looks that way.

Do not rename unrelated files. Do not place a slice in the wrong layer.

---

## Mode: CHECK

When asked to audit code / `/fsd-slice check`.

Scan `src/` and report violations of:

1. **Layer boundaries** — imports going upward or sideways between same-layer slices (check import paths against the dependency order).
2. **Public-API bypass** — importing a slice's internal files/segments instead of its `index.ts`.
3. **File suffixes** — a logic file missing its required suffix (e.g. `billingForm.tsx` instead of `billing-form.component.tsx`).
4. **Casing** — camelCase/PascalCase/snake_case in file or folder names instead of kebab-case.
5. **Folder plurality** — UI component in a plural folder, or a collection in a singular folder.
6. **Slice naming** — named after implementation detail instead of domain.
7. **Misplaced files** — a file type that belongs to a different layer/segment (e.g. a `.module.ts` outside `modules/`).

**Output:** group findings by type as `path:line — [violation] — how to fix`.
Do not auto-fix unless the user asks.
