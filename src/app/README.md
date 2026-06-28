# EasyConstruct — App Architecture (MVC)

This `src/app/` tree organizes the application into a strict MVC layout
with explicit Services and Repositories. TanStack Router owns the files
under `src/routes/`, so route files stay there and act as **thin Views**
that delegate to the layers below.

```
Route file (src/routes/_app.*.tsx)
  └─ View (src/app/views/<workspace>/*)        — pure presentation
      └─ Controller (src/app/controllers/*)     — React hook, no JSX
          └─ Service (src/app/services/*)       — business logic
              └─ Repository (src/app/repositories/*) — data access
                  └─ Model (src/app/models/*)   — types + mock data
```

## Layer responsibilities

| Layer        | Path                       | Rule                                                                     |
| ------------ | -------------------------- | ------------------------------------------------------------------------ |
| Models       | `app/models/<feature>`     | Types, DTOs, Zod schemas, mock fixtures. No React, no I/O.               |
| Repositories | `app/repositories`         | The only place that knows where data lives. Async interface.             |
| Services     | `app/services`             | Business rules, orchestration, validation. No React, no JSX.             |
| Controllers  | `app/controllers/<role>`   | React hooks that expose `{ data, isLoading, actions }`. No JSX.          |
| Views        | `app/views/<role>`         | Presentation. Consumes one controller. No fetching, no business math.    |
| Components   | `app/components/<scope>`   | Role-scoped composites. Shadcn primitives stay in `src/components/ui`.   |
| API          | `app/api/<feature>`        | HTTP request/response shapes + service. Repositories call into this.     |
| Validation   | `app/validation`           | Zod schemas reused by services and forms.                                |
| Permissions  | `app/permissions`          | `roles.ts`, `abilities.ts`, `workspace.ts`. Controllers gate writes.     |
| Utils        | `app/utils`                | Pure helpers (currency, date, formatting).                               |
| Hooks        | `app/hooks`                | Cross-cutting hooks (`usePermissions`, `useTheme`, …).                   |
| State        | `app/state`                | Global / workspace / feature stores.                                     |
| Constants    | `app/constants`            | Enum-like constants and config tables.                                   |

## Communication contract

- **View → Controller** — A view imports exactly one controller hook and
  destructures `{ data, isLoading, error, actions }`. Views never import
  services or repositories directly.
- **Controller → Service** — Controllers call service methods, wrap them
  in React Query / `useMemo`, check permissions via `usePermissions`,
  and surface errors to toasts.
- **Service → Repository** — Services depend on the repository
  *interface*. They validate input with Zod schemas from
  `app/validation` and emit notifications via `notification.service`.
- **Repository → Model / API** — Today every repository returns mock
  fixtures from `app/models/*`. Swapping to live data only requires
  changing the repository body to call `app/api/<feature>/service`.
- **Models** — Shared by every layer. No imports from React, services,
  or repositories.

## Adding a new module (recipe)

1. `app/models/<feature>/` — types, Zod schemas, mock data, `index.ts` barrel.
2. `app/repositories/<feature>.repository.ts` — async CRUD against mock data.
3. `app/services/<feature>.service.ts` — business rules.
4. `app/controllers/<role>/use<Feature>Controller.ts` — React hook.
5. `app/views/<role>/<Feature>View.tsx` — pure presentation.
6. `src/routes/_app.<feature>.tsx` — thin route shell that renders the View.
7. (Optional) add the section to `app/permissions/abilities.ts` and the
   sidebar in `src/lib/workspaces.ts`.

## Constraints

- shadcn UI in `src/components/ui/**` and design tokens in
  `src/styles.css` are **frozen** — never edited by feature work.
- Route filenames under `src/routes/` are owned by TanStack Router and
  cannot be moved into `app/views/`.
- Mock data in `src/lib/hr-data.ts` and `src/lib/pm-data.ts` is the
  source of truth today; the model barrels re-export from it so legacy
  imports keep working during the migration.
