
## Scope

Finish the Project Manager and Human Resources workspaces so every sidebar link, tab, and action maps to a real implemented page with working interactions. Finance module is untouched. Design system, theme, layout, and shared components are untouched.

Because this is a very large scope, I'll deliver it in **three sequential batches**. Each batch ends with a green typecheck and clickable flows. Please confirm the batches (or trim) before I start.

---

## Batch 1 — Project Manager completion

### New routes (converted from placeholders / hash anchors)
```
/projects/$projectId/timeline      Gantt-style schedule + critical path
/projects/$projectId/tasks         Task board (kanban + list toggle)
/projects/$projectId/milestones    Milestone tracker + status
/projects/$projectId/workforce     Assigned crews, roles, utilization
/projects/$projectId/equipment     Equipment assignments + availability
/projects/$projectId/documents     Project-scoped doc list
/projects/$projectId/daily-logs    Site diary entries
/projects/$projectId/risks         Risk register (CRUD)
/projects/$projectId/issues        Issue tracker (CRUD)
/projects/$projectId/quality       QA inspections + checklists
/projects/$projectId/analytics     Project-level analytics
/notifications                     Global inbox
/settings                          Workspace settings
```

### Sidebar refactor
Add "Operations" group (Timeline, Tasks, Milestones, Workforce, Equipment, Risk, Issues, Quality) under a currently opened project. Add Notifications + Settings to Intelligence group.

### Button audit — wire real actions
Across `/projects`, `/projects/$id`, `/workflows`, `/approvals`, `/documents`, `/resources`, `/reports`, `/ai-insights`, `/audit`:
- Create/Edit/Duplicate/Archive/Delete → open dialog + toast (mock persistence via in-memory service)
- Approve/Reject → controller action + toast + row status update
- Export/Import/Download/Print → toast + downloadable JSON/CSV blob
- Share → clipboard copy + toast
- View Details / Open Timeline / Open Analytics → Link to new route above

---

## Batch 2 — Human Resources completion

Convert `/hr` from single tabbed page with hash sections into a proper sub-routed workspace matching the Finance pattern.

### New routes
```
/hr                       Dashboard (existing overview extracted)
/hr/employees             Directory (list + filters)
/hr/employees/$id         Profile (tabs: Overview, Attendance, Payroll, Docs, Performance)
/hr/attendance            Daily attendance
/hr/attendance/verification
/hr/attendance/geofence
/hr/attendance/issues
/hr/leave                 Leave management (requests, approvals, balance)
/hr/schedule              Shift scheduling
/hr/payroll               Payroll processing
/hr/payroll/history
/hr/payroll/approvals
/hr/benefits
/hr/deductions
/hr/recruitment           Postings + applications
/hr/recruitment/interviews
/hr/performance           Reviews
/hr/training              Programs + certifications
/hr/documents
/hr/workforce             Allocation + capacity + availability + departments (tabbed)
/hr/reports
/hr/ai                    Workforce intelligence
/hr/notifications
/hr/settings
```

Rewrite `src/lib/workspaces.ts` HR sidebar to use these real routes (drop hash URLs).

### Button audit — wire real actions
Add Employee / Deactivate / Assign Dept / Approve Leave / Generate Payroll / Schedule Interview / Assign Training / Issue Certificate / Upload Docs — all open dialogs with Zod validation, update controller state, toast.

---

## Batch 3 — Architecture polish

### MVC additions per new feature
- `models/` fixtures for tasks, milestones, risks, issues, quality, equipment, daily-logs, leave, schedule, benefits, recruitment, performance, training
- `repositories/` + `services/` for each
- `controllers/` hooks driving each view
- `validation/` Zod schemas for every CRUD form
- `api/*/service.ts` HTTP shim per feature

### PostgreSQL blueprint
Single doc: `docs/pm-hr/data-model.md` — tables, FKs, indexes, soft-delete, audit columns for every new entity, plus REST endpoint map for future Express backend.

### Refine.dev integration points
Add `docs/pm-hr/refine-integration.md` mapping each controller to `useTable/useList/useShow/useCreate/useUpdate/useDelete` — actual Refine wiring stays out until Cloud is turned on (no live backend yet).

---

## What I will NOT do

- Touch Finance module, design tokens, theme, sidebar chrome, shared components
- Add real backend (no Lovable Cloud enablement in this pass; all persistence stays in-memory via services, matching the existing pattern)
- Modify Architect/Engineer/Site/Consultant workspaces

---

## Confirm before I start

1. **Green-light all 3 batches** as one continuous multi-turn implementation? Or start with Batch 1 only and re-scope after?
2. **Persistence**: keep the current in-memory service pattern (no DB), correct? Full Cloud/Postgres wiring is a separate pass.
3. **HR route restructure** (breaking `/hr#hash` → `/hr/subroute`) — OK? It's the right shape but changes URLs.
