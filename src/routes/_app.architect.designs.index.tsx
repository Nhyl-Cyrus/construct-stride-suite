import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PencilRuler, Upload, Sparkles } from "lucide-react";
import { EnterprisePage, Badge, Progress } from "@/components/enterprise/enterprise-page";
import { useDesigns } from "@/app/controllers/architect/useArchitect";
import {
  UploadDrawingDialog,
  SubmitReviewDialog,
  CreateRevisionDialog,
  DestructiveConfirm,
} from "@/components/architect/dialogs";
import type { Design } from "@/app/models/architect";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/designs/")({
  head: () => ({
    meta: [
      { title: "Designs — EasyConstruct" },
      { name: "description", content: "Design register for the architect studio." },
    ],
  }),
  component: DesignsPage,
});

function DesignsPage() {
  const navigate = useNavigate();
  const rows = useDesigns();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState<Design | null>(null);
  const [revisionOpen, setRevisionOpen] = useState<Design | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Design | null>(null);

  const inReview = rows.filter((r) => r.status === "In Review").length;
  const approved = rows.filter((r) => r.status === "Approved").length;
  const revisionsNeeded = rows.filter((r) => r.status === "Revision Needed").length;

  return (
    <>
      <EnterprisePage<Design>
        title="Designs"
        subtitle="Design Studio"
        description="Central register of every design across all projects. Upload drawings, request reviews, branch revisions."
        kpis={[
          { label: "Total designs", value: `${rows.length}`, delta: "across 5 projects" },
          { label: "In review", value: `${inReview}`, delta: "awaiting reviewers", tone: "info" },
          { label: "Approved", value: `${approved}`, tone: "success" },
          { label: "Revision needed", value: `${revisionsNeeded}`, tone: "warning" },
        ]}
        rows={rows}
        searchable={(r) => `${r.name} ${r.project} ${r.leadArchitect} ${r.discipline}`}
        searchPlaceholder="Search designs, projects, architects…"
        primaryAction={{ label: "New design", onSelect: () => navigate({ to: "/architect/designs/new" }) }}
        filters={
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full">All disciplines</Badge>
            <Badge variant="outline" className="rounded-full">All phases</Badge>
            <Badge variant="outline" className="rounded-full">Any status</Badge>
          </div>
        }
        aside={
          <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">Studio actions</div>
            </div>
            <button
              className="mb-2 flex w-full items-center gap-2 rounded-xl border bg-background p-3 text-left text-sm hover:bg-muted/40"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="h-4 w-4" /> Upload drawing
            </button>
            <button
              className="flex w-full items-center gap-2 rounded-xl border bg-background p-3 text-left text-sm hover:bg-muted/40"
              onClick={() => navigate({ to: "/architect/designs/new" })}
            >
              <PencilRuler className="h-4 w-4" /> Start new design
            </button>
          </div>
        }
        columns={[
          {
            key: "name",
            header: "Design",
            render: (r) => (
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.project} · {r.code}
                </div>
              </div>
            ),
          },
          {
            key: "version",
            header: "Version",
            render: (r) => (
              <div className="text-sm tabular-nums">
                {r.version}
                <div className="text-[11px] text-muted-foreground">rev {r.revision}</div>
              </div>
            ),
          },
          {
            key: "discipline",
            header: "Discipline",
            render: (r) => (
              <Badge variant="outline" className="rounded-full text-[10px]">
                {r.discipline}
              </Badge>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <Badge variant="outline" className="rounded-full text-[10px]">
                {r.status}
              </Badge>
            ),
          },
          {
            key: "lead",
            header: "Lead",
            render: (r) => <span className="text-sm">{r.leadArchitect}</span>,
          },
          {
            key: "ai",
            header: "AI completeness",
            render: (r) => (
              <div className="w-32">
                <Progress value={r.aiCompleteness} className="h-1.5" />
                <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                  {r.aiCompleteness}% · conf {r.aiConfidence}%
                </div>
              </div>
            ),
          },
          {
            key: "updated",
            header: "Updated",
            render: (r) => (
              <span className="text-sm text-muted-foreground">{formatDate(r.updatedAt)}</span>
            ),
          },
        ]}
        rowActions={[
          { label: "Open", onSelect: (r) => navigate({ to: "/architect/designs/$designId", params: { designId: r.id } }) },
          { label: "Preview", onSelect: () => toast.info("Preview opened") },
          { label: "Submit for review", onSelect: (r) => setReviewOpen(r) },
          { label: "Create revision", onSelect: (r) => setRevisionOpen(r) },
          { label: "Duplicate", onSelect: () => toast.success("Duplicated") },
          { label: "Download", onSelect: () => toast.success("Download started") },
          { label: "Archive", onSelect: () => toast.message("Archived") },
          { label: "Delete", destructive: true, onSelect: (r) => setDeleteTarget(r) },
        ]}
      />
      <UploadDrawingDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <SubmitReviewDialog
        open={!!reviewOpen}
        onOpenChange={(v) => !v && setReviewOpen(null)}
        designName={reviewOpen?.name}
      />
      <CreateRevisionDialog
        open={!!revisionOpen}
        onOpenChange={(v) => !v && setRevisionOpen(null)}
        designName={revisionOpen?.name}
        parentVersion={revisionOpen?.version}
      />
      <DestructiveConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "design"}?`}
        description="This action cannot be undone. All linked revisions will be archived."
        actionLabel="Delete design"
        onConfirm={() => {
          toast.success("Design deleted");
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
