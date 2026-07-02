# Finance Budget Module — Backend & Integration Blueprint

Non-executable spec that mirrors the frontend MVC. It documents the target
PostgreSQL schema, REST endpoints, and Refine.dev integration boundary. When
Lovable Cloud (Postgres) is enabled, port these into migrations under
`supabase/migrations/`.

## Refine.dev integration plan

Refine will own list/detail/form data flow via `dataProvider`, but stay
decoupled from UI. Wrap each Refine hook inside a feature-specific hook.

```
src/features/finance/budgets/hooks/
  use-budget-list.ts        → wraps useTable({ resource: "budgets" })
  use-budget-details.ts     → wraps useShow({ resource: "budgets", id })
  use-budget-form.ts        → wraps useForm({ resource: "budgets" })
  use-budget-mutations.ts   → wraps useCreate/useUpdate/useDelete
  use-budget-analytics.ts   → wraps useCustom for /analytics
```

Resources registered on <Refine>:
- `budgets`, `budget_allocations`, `budget_adjustments`,
  `budget_history`, `budget_approval_steps`, `budget_comments`,
  `budget_documents`, `budget_categories`, `budget_transactions`,
  `budget_forecasts`.

`notificationProvider` → shadcn `sonner`.
`dataProvider` → REST adapter pointing at `/api/finance/*`.

## PostgreSQL schema (target)

```sql
create type budget_approval_state as enum (
  'draft','pending-review','finance-review','manager-review',
  'approved','rejected','returned','cancelled'
);
create type budget_adjustment_kind as enum (
  'increase','decrease','transfer','emergency'
);
create type budget_tx_type as enum ('commitment','actual','release');

create table budget_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  parent_id uuid references budget_categories(id),
  color text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,           -- e.g. BUD-2401
  project_id uuid not null,
  category_id uuid references budget_categories(id),
  fiscal_year text not null,
  planned numeric(14,2) not null,
  committed numeric(14,2) not null default 0,
  spent numeric(14,2) not null default 0,
  owner_id uuid not null,
  status budget_approval_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index budgets_project_idx on budgets(project_id);
create index budgets_fy_idx on budgets(fiscal_year);

create table budget_allocations (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  category_id uuid not null references budget_categories(id),
  department text not null,
  amount numeric(14,2) not null,
  consumed numeric(14,2) not null default 0,
  percentage numeric(5,2),
  owner_id uuid not null,
  status budget_approval_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index alloc_budget_idx on budget_allocations(budget_id);

create table budget_adjustments (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  kind budget_adjustment_kind not null,
  original_amount numeric(14,2) not null,
  adjustment_amount numeric(14,2) not null,
  new_amount numeric(14,2) not null,
  transfer_from_id uuid references budget_allocations(id),
  transfer_to_id uuid references budget_allocations(id),
  reason text not null,
  requested_by uuid not null,
  requested_at timestamptz not null default now(),
  approved_by uuid,
  approved_at timestamptz,
  status budget_approval_state not null default 'pending-review',
  deleted_at timestamptz
);
create index adj_budget_idx on budget_adjustments(budget_id);

create table budget_approval_steps (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  adjustment_id uuid references budget_adjustments(id) on delete cascade,
  stage budget_approval_state not null,
  approver_id uuid not null,
  role text not null,
  decision text check (decision in ('approve','reject','return')),
  decided_at timestamptz,
  comments text,
  created_at timestamptz not null default now()
);
create index step_budget_idx on budget_approval_steps(budget_id);

create table budget_history (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  action text not null,
  field text,
  old_value jsonb,
  new_value jsonb,
  reason text,
  actor_id uuid not null,
  at timestamptz not null default now()
);
create index history_budget_idx on budget_history(budget_id, at desc);

create table budget_comments (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  author_id uuid not null,
  body text not null,
  at timestamptz not null default now(),
  deleted_at timestamptz
);

create table budget_documents (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  name text not null,
  kind text not null,
  storage_path text not null,
  size_bytes bigint,
  uploaded_by uuid not null,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table budget_transactions (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  allocation_id uuid references budget_allocations(id),
  txn_date date not null,
  vendor text not null,
  category text not null,
  description text,
  amount numeric(14,2) not null,
  type budget_tx_type not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index tx_budget_idx on budget_transactions(budget_id, txn_date desc);

create table budget_forecasts (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references budgets(id) on delete cascade,
  month date not null,
  planned numeric(14,2) not null,
  actual numeric(14,2),
  forecast numeric(14,2) not null,
  unique (budget_id, month)
);
```

## Express-style REST endpoints

```
GET    /budgets                     list + filters
GET    /budgets/:id                 detail
POST   /budgets                     create
PATCH  /budgets/:id                 update
DELETE /budgets/:id                 soft delete

GET    /budgets/:id/allocations
POST   /budget-allocations
PATCH  /budget-allocations/:id
DELETE /budget-allocations/:id

GET    /budgets/:id/adjustments
POST   /budget-adjustments
PATCH  /budget-adjustments/:id

GET    /budgets/:id/history
GET    /budgets/:id/approval-steps
POST   /budget-approvals            (decision on a step)

GET    /budgets/:id/documents
POST   /budgets/:id/documents

GET    /budgets/:id/analytics
GET    /budgets/:id/forecast
```

Layered per feature: `routes/` → `controllers/` → `services/` →
`repositories/` with `zod` validation and RBAC guards
(`requireRole('finance-controller')`).
