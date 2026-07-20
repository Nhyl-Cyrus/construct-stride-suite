
# Architect Workspace — Enterprise Design Studio

> Stack note: this project runs on **TanStack Start + Vite + shadcn/ui + Tailwind v4** (not Refine/Express). I'll keep the exact architecture your prompt asks for — MVC + services + repositories + validation + mock — but wire the Views through TanStack route files (as every other workspace does). No routing library swap.

## 1. Sidebar & navigation (extend, don't restyle)

Extend the Architect workspace entry in `src/lib/workspaces.ts` so the sidebar exposes the full studio:

- Studio (dashboard)
- Designs · list + `New Design` wizard + detail
- Blueprints (library)
- Reviews (queue + detail)
- Revisions (timeline + compare + detail)
- Documentation (hub + detail)
- AI Design Assist

Top tabs on the studio dashboard mirror these sections. No changes to sidebar styling, top-bar, tokens, or shared components.

## 2. Route additions (TanStack file-based)

New route files, each a thin shell delegating to a View:

```text
src/routes/
  _app.architect.tsx                       (dashboard — refined)
  _app.architect.designs.tsx               (list)
  _app.architect.designs.new.tsx           (7-step Create Design wizard)
  _app.architect.designs.$designId.tsx     (detail)
  _app.architect.blueprints.tsx            (library grid/list)
  _app.architect.blueprints.$blueprintId.tsx
  _app.architect.reviews.tsx               (queue with tabs)
  _app.architect.reviews.$reviewId.tsx     (review detail)
  _app.architect.revisions.tsx             (timeline + tree)
  _app.architect.revisions.$revisionId.tsx (compare + metadata)
  _app.architect.documentation.tsx         (hub with categories)
  _app.architect.documentation.$docId.tsx
  _app.architect.ai.tsx                    (AI panels)
```

## 3. MVC layer (`src/app/**/architect`)

```text
app/models/architect/       design, blueprint, review, revision, document types + Zod + mock
app/repositories/architect/ design / blueprint / review / revision / document repos
app/services/architect/     business rules (submitReview, createRevision, approve…)
app/controllers/architect/  useDesignsController, useBlueprintsController, useReviewsController,
                            useRevisionsController, useDocumentationController,
                            useDesignWizardController, useArchitectAiController
app/views/architect/        one View per route, presentation only
app/validation/architect/   Zod schemas per entity
app/api/architect/          request/response DTOs + placeholder fetchers matching planned endpoints
```

Permissions: add `design`, `blueprint`, `review`, `revision` subjects to `app/models/permissions` + grants in `abilities.ts` for `architect` (create/update/approve) and read-only for other roles.

## 4. Reusable Architect components

Under `src/components/architect/`:

- `design-file-dropzone.tsx` — drag+drop, browse, per-file progress, duplicate detect, rename, category/discipline/version selects, thumbnails, remove.
- `blueprint-card.tsx`, `blueprint-grid.tsx`, `blueprint-list.tsx`.
- `review-timeline.tsx`, `review-checklist.tsx`, `comment-thread.tsx`, `annotation-list.tsx`.
- `revision-tree.tsx`, `revision-compare.tsx` (side-by-side placeholder viewer).
- `ai-recommendation-card.tsx` (confidence, impact, metrics, Accept/Dismiss, Explain, Generate Report).
- Dialogs in `src/components/architect/dialogs/`:
  UploadDrawingDialog, CreateDesignDialog (wraps wizard entry), SubmitReviewDialog, AssignReviewersDialog, CreateRevisionDialog, ApprovalDialog, CommentDialog, AiReportDialog, BlueprintDetailsSheet, DocumentDetailsSheet, DeleteConfirmDialog, ArchiveConfirmDialog.

All built from existing shadcn primitives (Dialog, Sheet, Tabs, Command, DropdownMenu, ScrollArea, Progress, Alert, AlertDialog, Skeleton, Toast). No token/style edits.

## 5. Create Design wizard (7 steps)

Same pattern already shipped for `projects/new`:

1. Basic Info (name, project, discipline, category, description)
2. Project Info (phase, building, floor, zone, client)
3. Upload Files (DWG/DXF/PDF/IFC/RVT/images via dropzone)
4. Version Info (version, revision #, parent version, reason, change summary)
5. Collaborators (reviewers, engineers, consultants, PM)
6. AI Analysis (completeness, compliance, conflict warnings, confidence)
7. Review & Submit (Save Draft / Submit)

Left rail stepper + AI helper. Right rail sticky summary + validation checklist. Zod-guarded forward nav.

## 6. Designs list

Full DataTable with columns Project, Name, Version, Status, Discipline, Lead, Updated, Review, Approval, Actions. Toolbar: search, filters (status/discipline/date/architect), sort, bulk actions, Export, Import, New Folder, Upload Design, New Design. Row actions: Open, Preview, Edit, Duplicate, Create Revision, Submit Review, Download, Archive, Delete (AlertDialog).

## 7. Blueprint library

Grid + list toggle, folder tree (Accordion), tags, favorites, recently viewed, large preview HoverCard. Metadata (number, scale, revision, author, status, approval, issue date). Actions: Preview, Download, Share, Duplicate, Move, Rename, Archive, Compare Versions, Generate PDF, Print Set, History.

## 8. Reviews

Tabs: Pending · Completed · Overdue · Rejected · Approved. Detail page: drawing preview placeholder, annotations, checklist, reviewer timeline, activity feed, Approve / Reject / Request Changes / Assign / Add Comment / Mention / Resolve / Download Report / Export.

## 9. Revisions

Timeline + tree + list. Metadata: reason, affected sheets, parent. Compare view side-by-side. Buttons: Create, Merge, Restore, Compare, Approve, Reject, Archive, Generate Report.

## 10. Documentation hub

Category tabs (Specs, Material Schedule, Technical, Compliance, Building Codes, Permits, Inspection, Site Instructions, As-built, Meeting Minutes, RFIs, Submittals). Table with Upload, Replace, Edit Metadata, Preview, Download, Share, History, Approve, Archive, Delete, Generate PDF, Print.

## 11. AI Design Assist

Panels: Design Validation, Structural Conflicts, Code Compliance, Material Optimization, Accessibility, Space Optimization, Cost Impact, Sustainability, Risk. Each card: confidence, impact, metrics, suggested actions, explanation, Accept / Dismiss / Generate Report. Advisory only.

## 12. Quick Actions panel

Replace links with real buttons wired to the dialogs above (Upload Drawing, Create Design, Submit Review, Generate Revision, Generate AI Analysis, Create Documentation, Upload Blueprint, Generate Print Package, Export Design, Create Share Link, Request Engineer Approval, Request Client Approval).

## 13. Detail pages (shared shape)

Header · Metadata · Timeline · Files · History · Comments · Approvals · Related Designs · AI Insights · Activity Log. Implemented once as `<ArchitectDetailShell>` and reused across Design / Blueprint / Review / Revision / Documentation details.

## 14. API preparation (frontend only)

`app/api/architect/*` exports typed request/response DTOs matching the planned endpoints:

```text
POST/GET/PUT/DELETE /api/architect/designs[/:id]
POST                /api/architect/uploads
POST                /api/architect/reviews
POST                /api/architect/revisions
POST                /api/architect/documents
GET                 /api/architect/history
```

Repositories currently return mock fixtures; swapping to live HTTP is one file per entity.

## 15. Scope guardrails

- No edits to sidebar, top-bar, theme provider, tokens, `styles.css`, or shadcn primitives.
- No backend, no new routing library, no changes to other workspaces.
- All new copy uses existing typography and design tokens.

## Deliverables

New architect routes, MVC layer, wizard, dialogs, detail pages, AI panels, mock data, Zod schemas, DTO stubs — all typecheck-clean.
