# State

- `global/` — app-wide stores: auth/session, theme, notifications.
- `workspace/` — per-workspace selection (active role, sidebar collapsed).
- `feature/` — feature-scoped stores (e.g. payroll batch editor).

Today the project relies on React Query (loaders) and local `useState`.
Add Zustand / Jotai stores here only when state genuinely needs to be
shared across unrelated views.
