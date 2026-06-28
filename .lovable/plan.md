## Goal

Reorganize EasyConstruct into a clean MVC architecture **without touching the working UI or breaking any route**. TanStack Router requires route files to physically live under `src/routes/`, so routes stay there and act as thin Views that delegate to Controllers, Services, and Models living in a new feature-first tree.

## Constraints we must respect

- `src/routes/**` filenames are owned by TanStack Router — they cannot be moved into `views/` or `routes/project-manager/`. We'll keep the flat `_app.*.tsx` files and make each one a thin shell that renders a View component.
- `src/components/ui/**` (shadcn) and the design system (`src/styles.css`, theme provider, tokens) must not change.
- `src/lib/workspaces.ts`, `src/hooks/use-workspace.ts`, sidebar, top bar, role-workspace-page must keep working.
- Existing mock data in `src/lib/hr-data.ts` and `src/lib/pm-data.ts` must remain reachable (re-exported from the new model layer) so nothing breaks during the move.

## Target structure (overlay, additive)

```text
src/
  routes/                       # TanStack route files — thin Views only
    _app.hr.tsx                 # renders <HRWorkspaceView/>
    _app.projects.tsx           # renders <ProjectsListView/>
    ...
  app/
    models/                     # Model layer — types, DTOs, schemas, mock data
      employees/
        employee.model.ts
        employee.schema.ts
        employee.mock.ts
        index.ts
      attendance/
      payroll/
      projects/
      workflow/
      reports/
      notifications/
      users/
      roles/
      permissions/
      analytics/
    repositories/               # Data access abstraction (swap mock → API later)
      employee.repository.ts
      attendance.repository.ts
      payroll.repository.ts
      project.repository.ts
      workflow.repository.ts
      ai.repository.ts
      notification.repository.ts
      base.repository.ts
    services/                   # Business logic, orchestrates repositories
      auth.service.ts
      employee.service.ts
      attendance.service.ts
      payroll.service.ts
      project.service.ts
      workflow.service.ts
      document.service.ts
      ai.service.ts
      report.service.ts
      notification.service.ts
      theme.service.ts
    controllers/                # Hook-shaped controllers consumed by Views
      hr/
        useEmployeesController.ts
        useAttendanceController.ts
        usePayrollController.ts
        useWorkforceController.ts
        useHRDashboardController.ts
      project-manager/
        useProjectsController.ts
        useProjectDetailController.ts
        useWorkflowsController.ts
        useApprovalsController.ts
      finance/
      architect/
      engineer/
      site/
      consultant/
    views/                      # Pure presentation — receives data + callbacks
      hr/
        HRWorkspaceView.tsx
        sections/
          OverviewSection.tsx
          EmployeesSection.tsx
          AttendanceSection.tsx
          PayrollSection.tsx
          WorkforceSection.tsx
          ReportsSection.tsx
          AIAssistantSection.tsx
      project-manager/
        ProjectsListView.tsx
        ProjectDetailView.tsx
        NewProjectView.tsx
        WorkflowsView.tsx
        ApprovalsView.tsx
      finance/  architect/  engineer/  site/  consultant/
      dashboard/  shared/
    components/                 # Role-scoped composite components
      hr/        project-manager/   finance/
      architect/ engineer/          site/        consultant/
      shared/    layout/            navigation/
      dashboard/ forms/  tables/  charts/  dialogs/  cards/
    hooks/                      # Cross-cutting hooks (useTheme, usePermissions, …)
    api/                        # Future HTTP clients
      auth/  employees/  attendance/  payroll/  projects/
      workflow/  reports/  notifications/  ai/
        # each: request.ts, response.ts, service.ts
    validation/                 # Zod schemas (shared with models)
    permissions/
      roles.ts  abilities.ts  workspace.ts
    state/
      global/   workspace/   feature/
    utils/
      date.ts  currency.ts  attendance.ts  validation.ts
      formatting.ts  permissions.ts  theme.ts  calculations.ts
    constants/
    contexts/
    providers/
  components/ui/                # shadcn — UNCHANGED
  styles.css                    # design tokens — UNCHANGED
```

Path alias `@/app/*` will be added to `tsconfig.json` and `vite.config.ts` so imports read `@/app/services/employee.service`.

## Layer responsibilities & communication

- **Models** — Pure TypeScript: `Employee`, `Project`, `PayrollRow`, Zod schemas, mock fixtures. No React, no I/O. Shared by every layer above.
- **Repositories** — The only place that knows *where* data lives. Today they return mock data from models; tomorrow they call `api/*`. Each exposes a narrow async interface (`list`, `getById`, `create`, …). Services depend on repository interfaces, not implementations.
- **Services** — Business rules and orchestration (e.g. `payroll.service.runBatch()` validates with schema, calls `payrollRepository`, emits notifications). No React, no JSX. Reusable from controllers, server functions, tests.
- **Controllers** — React hooks (`useEmployeesController`) that wrap services with React Query / local state, expose `{ data, isLoading, error, actions }`, run permission checks, and surface toast/error handling. No JSX.
- **Views** — React components that consume one controller, render UI from `@/components/ui` + `app/components/*`, and call controller actions on events. No fetching, no business math.
- **Route files** (`src/routes/_app.*.tsx`) — Stay where TanStack expects them. Each becomes a 5-line shell: `head()` meta + `<SomeView />`.

Flow: `Route → View → Controller (hook) → Service → Repository → Model`.

## Migration plan (incremental, non-breaking)

1. **Scaffold the tree** under `src/app/**` with `index.ts` barrels; add `@/app/*` path alias.
2. **Move models**: create `app/models/employees|attendance|payroll|projects/*` by re-exporting from existing `src/lib/hr-data.ts` and `src/lib/pm-data.ts`, then physically relocate the data and turn the old files into one-line re-exports (keeps current imports green).
3. **Add repositories** wrapping the mock data with async signatures.
4. **Add services** with the small amount of derived logic currently inline in routes (status tone mapping, KPI aggregation, AI insight selection).
5. **Add controllers** as hooks that today simply `useMemo` over service output — ready for React Query swap later.
6. **Extract Views** from each existing route into `app/views/<workspace>/*`. Each route file becomes a thin shell. Done one workspace at a time (start with HR, then Project Manager, then the role workspaces) so the app stays runnable after every step.
7. **Permissions / validation / utils / api / state** scaffolds are created with README stubs and one real example each (`permissions/roles.ts`, `validation/employee.schema.ts`, `utils/currency.ts`, `api/employees/{request,response,service}.ts`) so future modules have a template.
8. **Docs**: add `src/app/README.md` explaining the layers, the communication contract, and a "How to add a new module" recipe.

## Out of scope

- No visual changes, no route URL changes, no theme/token changes.
- No new backend wiring — repositories stay mock-backed; `api/*` is scaffolding only.
- shadcn `components/ui` stays untouched.

## Deliverable per turn

Because this is a large refactor, I'll execute it in 3 batches and verify the build between each:

- **Batch A**: scaffolding + path alias + models + repositories + services + permissions/utils stubs + README. No route edits.
- **Batch B**: HR workspace migrated to View + Controller; `_app.hr.tsx` becomes a shell.
- **Batch C**: Project Manager + role workspaces (Finance, Architect, Engineer, Site, Consultant) migrated the same way.

After approval I'll start with Batch A.
