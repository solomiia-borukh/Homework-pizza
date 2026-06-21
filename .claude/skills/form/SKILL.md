---
name: form
description: Form conventions for this project — React Hook Form + shadcn/ui Form components with Zod validation, used for the /login and /register auth forms. Covers schema validation (email format, password min length), Better Auth submit + error handling, and where forms live in the FSD structure. Use when building or reviewing any form.
---

# form — React Hook Form + shadcn/ui + Zod

How this project builds forms. The first users are the `/login` and `/register`
auth forms. Builds on `fsd-slice` (placement), `auth-setup` (auth client), and
`route-handler` (pages that mount the forms).

## Stack & dependencies

- **react-hook-form** — form state.
- **zod** — validation schemas (new dependency).
- **@hookform/resolvers/zod** — wires Zod into RHF (new dependency).
- **shadcn/ui `Form`** components (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`).

## Placement (FSD)

Each auth form is its own slice in the `features` layer (reusable implementation).
The pages only mount them.

```
src/app/features/login-form/
├── login-form.component.tsx      # "use client"
├── login-form.constant.ts        # loginSchema (Zod)
├── login-form.interface.ts       # LoginValues = z.infer<typeof loginSchema>
└── index.ts                      # public API
src/app/features/register-form/
├── register-form.component.tsx   # "use client"
├── register-form.constant.ts     # registerSchema (Zod)
├── register-form.interface.ts
└── index.ts

src/app/(web)/login/page.tsx      # mounts <LoginForm />
src/app/(web)/register/page.tsx   # mounts <RegisterForm />
```

The form components are Client Components (`"use client"`). The pages stay Server Components and only render the form.

## Validation (Zod)

- Define a schema with Zod per form, in that feature's `*.constant.ts`.
- Required rules:
  - **Email** — valid email format (`z.string().email()`).
  - **Password** — minimum length (`z.string().min(...)`); register may add confirm-password matching.
- Derive form value types from the schema, do not hand-write them:
  ```ts
  export type LoginValues = z.infer<typeof loginSchema>;
  ```
- Put inferred types in the feature's `*.interface.ts`.
- **Same-layer rule:** `login-form` and `register-form` are separate slices in the same layer, so they must NOT import each other (no shared schema between them). Keep each schema self-contained; the small overlap (email + password rules) is fine. If a rule must truly be shared, move the primitive to a lower layer (`shared`), never between features.

## Form wiring

- `useForm<Values>({ resolver: zodResolver(schema), defaultValues })`.
- Build the UI with shadcn `Form` + `FormField`; show field errors via `FormMessage`.
- Inputs: shadcn components, `cn()` for conditional classes, no inline styles.
- Disable the submit button and show a pending state while submitting.
- No `any`; explicit types; arrow functions.

## Submit + Better Auth error handling

- On submit, call the Better Auth client from `src/pkg/auth` (see `auth-setup`) — e.g. `signIn.email(...)` / `signUp.email(...)`. Do not call the server `auth` instance from the form.
- **Handle Better Auth errors** returned from the call:
  - Map field-specific errors to the matching field via `setError("email" | "password", ...)`.
  - Map general errors (e.g. invalid credentials, email already in use) to a form-level message via `setError("root", ...)` and render it.
  - Never swallow the error silently; never leak raw internal error text.
- On success, redirect to the appropriate route (e.g. the list page).

## Review checklist (when auditing a form)

- Validation done outside Zod (manual `register` rules) instead of a Zod schema? → flag.
- Form value types hand-written instead of `z.infer`? → flag.
- Form not using shadcn `Form` / `FormField` / `FormMessage`? → flag.
- Submit calling the server `auth` instance instead of the auth client? → flag.
- Better Auth errors not surfaced to the user (field or root)? → flag.
- Page is a Client Component just to host the form? → flag (form is the client leaf, page stays server).
- Missing pending/disabled state on submit? → flag.
