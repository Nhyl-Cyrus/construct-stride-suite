import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, GitCompareArrows, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchitectDetailShell } from "@/components/architect/architect-detail-shell";
import { useRevision } from "@/app/controllers/architect/useArchitect";
import { ApprovalDialog } from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/revisions/$revisionId")({
  component: RevisionDetailPage,
});

function RevisionDetailPage() {
  const { revisionId } = Route.useParams();
  const rev = useRevision(revisionId);
  const [mode, setMode] = useState<"approve" | "reject" | null>(null);
  if (!rev) throw notFound();

  return (
    <>
      <ArchitectDetailShell
        backTo="/architect/revisions"
        backLabel="Revisions"
        eyebrow={`${rev.code} · Revision ${rev.revisionNumber}`}
        title={`${rev.designName} · ${rev.version}`}
        subtitle={rev.reason}
        status={{ label: rev.status, tone: rev.status === "Approved" ? "success" : rev.status === "Rejected" ? "destructive" : "info" }}
        headerActions={
          <>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Report generated")}>
              <FileDown className="h-4 w-4" /> Report
            </Button>
            <Button size="sm" variant="destructive" className="rounded-xl" onClick={() => setMode("reject")}>
              <XCircle className="h-4 w-4" /> Reject
            </Button>
            <Button size="sm" className="rounded-xl" onClick={() => setMode("approve")}>
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          </>
        }
        metadata={[
          { label: "Parent version", value: rev.parentVersion },
          { label: "New version", value: rev.version },
          { label: "Revision #", value: `${rev.revisionNumber}` },
          { label: "Created by", value: rev.createdBy },
          { label: "Created", value: formatDate(rev.createdAt) },
          { label: "Approved", value: rev.approvedAt ? formatDate(rev.approvedAt) : "—" },
        ]}
        timeline={[
          { at: formatDate(rev.createdAt), actor: rev.createdBy, action: `Branched from ${rev.parentVersion}` },
          { at: formatDate(rev.createdAt), actor: rev.createdBy, action: rev.changeSummary },
          ...(rev.approvedAt ? [{ at: formatDate(rev.approvedAt), actor: "Reviewer", action: "Approved" }] : []),
        ]}
        related={[{ label: `Open design`, href: `/architect/designs/${rev.designId}` }]}
        aiInsights={[
          { title: "Impact estimate", body: `${rev.affectedSheets.length} sheets affected.` },
          { title: "Risk", body: "No downstream approvals blocked by this branch." },
        ]}
      >
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Side-by-side comparison</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              <GitCompareArrows className="h-4 w-4" /> Toggle overlay
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Parent · {rev.parentVersion}</div>
                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 text-xs text-muted-foreground">
                  Drawing preview
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">This revision · {rev.version}</div>
                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-primary-soft/30 text-xs text-primary">
                  Drawing preview
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">Affected sheets</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {rev.affectedSheets.map((s) => (
                <span key={s} className="rounded-full border px-2 py-0.5 text-[10px]">{s}</span>
              ))}
            </div>
            <div className="mt-4 text-sm font-semibold">Change summary</div>
            <p className="mt-1 text-sm text-muted-foreground">{rev.changeSummary}</p>
            {rev.reviewerNotes && (
              <>
                <div className="mt-4 text-sm font-semibold">Reviewer notes</div>
                <p className="mt-1 text-sm text-muted-foreground">{rev.reviewerNotes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </ArchitectDetailShell>
      <ApprovalDialog open={!!mode} onOpenChange={(v) => !v && setMode(null)} mode={mode ?? "approve"} entity={`${rev.designName} · ${rev.version}`} />
    </>
  );
}
