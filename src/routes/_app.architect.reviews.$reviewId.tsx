import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArchitectDetailShell } from "@/components/architect/architect-detail-shell";
import { useReview } from "@/app/controllers/architect/useArchitect";
import { ApprovalDialog, CommentDialog } from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/reviews/$reviewId")({
  component: ReviewDetailPage,
});

function ReviewDetailPage() {
  const { reviewId } = Route.useParams();
  const review = useReview(reviewId);
  const [mode, setMode] = useState<"approve" | "reject" | "changes" | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);

  if (!review) throw notFound();

  return (
    <>
      <ArchitectDetailShell
        backTo="/architect/reviews"
        backLabel="Review queue"
        eyebrow={`${review.code} · ${review.discipline}`}
        title={review.designName}
        subtitle={`Requested by ${review.requestedBy} · Due ${formatDate(review.dueDate)}`}
        status={{ label: review.status, tone: review.status === "Approved" ? "success" : review.overdue ? "destructive" : "info" }}
        headerActions={
          <>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setCommentOpen(true)}>
              <MessageSquare className="h-4 w-4" /> Comment
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setMode("changes")}>
              <Send className="h-4 w-4" /> Request changes
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
          { label: "Priority", value: review.priority },
          { label: "Reviewers", value: review.reviewers.join(", ") },
          { label: "Submitted", value: formatDate(review.submittedAt) },
          { label: "Due", value: formatDate(review.dueDate) },
          { label: "Completed", value: review.completedAt ? formatDate(review.completedAt) : "—" },
          { label: "Comments", value: `${review.comments.length}` },
        ]}
        timeline={[
          { at: formatDate(review.submittedAt), actor: review.requestedBy, action: "Review submitted" },
          ...review.reviewers.map((r) => ({ at: formatDate(review.submittedAt), actor: r, action: "Assigned as reviewer" })),
          ...(review.completedAt ? [{ at: formatDate(review.completedAt), actor: review.reviewers[0] ?? "Reviewer", action: `Marked ${review.status}` }] : []),
        ]}
        comments={review.comments.map((c) => ({
          author: `${c.author} (${c.role})`,
          body: c.body,
          at: formatDate(c.createdAt),
          resolved: c.resolved,
        }))}
        approvals={review.reviewers.map((r) => ({ name: r, role: "Reviewer", status: review.status }))}
        related={[{ label: `Open design ${review.designName}`, href: `/architect/designs/${review.designId}` }]}
        aiInsights={[
          { title: "Auto checks", body: `${review.checklist.filter((c) => c.passed).length}/${review.checklist.length} checklist items passed.` },
          { title: "Response SLA", body: review.overdue ? "Overdue — escalate to lead." : "On track." },
        ]}
      >
        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-4">
            <div className="text-sm font-semibold">Review checklist</div>
            {review.checklist.map((c) => (
              <label key={c.id} className="flex items-center gap-3 rounded-xl border p-3">
                <Checkbox checked={c.passed} onCheckedChange={() => toast.message(c.passed ? "Unchecked" : "Passed")} />
                <div className="text-sm">{c.label}</div>
              </label>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="mb-2 text-sm font-semibold">Drawing preview</div>
            <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 text-xs text-muted-foreground">
              Annotation viewer placeholder · connect DWG/PDF renderer
            </div>
          </CardContent>
        </Card>
      </ArchitectDetailShell>
      <ApprovalDialog open={!!mode} onOpenChange={(v) => !v && setMode(null)} mode={mode ?? "approve"} entity={review.designName} />
      <CommentDialog open={commentOpen} onOpenChange={setCommentOpen} target={review.designName} />
    </>
  );
}
