import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckSquare, GitBranch, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchitectDetailShell } from "@/components/architect/architect-detail-shell";
import { useDesign } from "@/app/controllers/architect/useArchitect";
import {
  SubmitReviewDialog,
  CreateRevisionDialog,
  ApprovalDialog,
  CommentDialog,
} from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";
import { MOCK_REVIEWS, MOCK_REVISIONS } from "@/app/models/architect";

export const Route = createFileRoute("/_app/architect/designs/$designId")({
  component: DesignDetailPage,
});

function DesignDetailPage() {
  const { designId } = Route.useParams();
  const navigate = useNavigate();
  const design = useDesign(designId);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  if (!design) throw notFound();

  const relatedReviews = MOCK_REVIEWS.filter((r) => r.designId === design.id);
  const relatedRevisions = MOCK_REVISIONS.filter((r) => r.designId === design.id);

  return (
    <>
      <ArchitectDetailShell
        backTo="/architect/designs"
        backLabel="All designs"
        eyebrow={`${design.code} · ${design.project}`}
        title={design.name}
        subtitle={design.description}
        status={{ label: design.status, tone: design.status === "Approved" ? "success" : design.status === "Revision Needed" ? "warning" : "info" }}
        headerActions={
          <>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Download started")}>
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setRevisionOpen(true)}>
              <GitBranch className="h-4 w-4" /> New revision
            </Button>
            <Button size="sm" className="rounded-xl" onClick={() => setReviewOpen(true)}>
              <CheckSquare className="h-4 w-4" /> Submit review
            </Button>
          </>
        }
        metadata={[
          { label: "Discipline", value: design.discipline },
          { label: "Category", value: design.category },
          { label: "Phase", value: design.phase },
          { label: "Version", value: `${design.version} · rev ${design.revision}` },
          { label: "Lead architect", value: design.leadArchitect },
          { label: "Client", value: design.client ?? "—" },
          { label: "Building", value: design.building ?? "—" },
          { label: "Floor", value: design.floor ?? "—" },
          { label: "Zone", value: design.zone ?? "—" },
          { label: "Created", value: formatDate(design.createdAt) },
          { label: "Updated", value: formatDate(design.updatedAt) },
          { label: "AI confidence", value: `${design.aiConfidence}%` },
        ]}
        files={Array.from({ length: Math.min(6, design.fileCount) }).map((_, i) => ({
          name: `${design.code}-Sheet-${(i + 1).toString().padStart(2, "0")}.dwg`,
          type: i % 2 ? "PDF" : "DWG",
          size: `${(1.2 + i * 0.4).toFixed(1)} MB`,
        }))}
        timeline={[
          { at: formatDate(design.createdAt), actor: design.leadArchitect, action: "Design created" },
          { at: formatDate(design.updatedAt), actor: design.leadArchitect, action: `Updated to ${design.version}` },
          ...relatedReviews.map((r) => ({ at: formatDate(r.submittedAt), actor: r.requestedBy, action: `Review ${r.code} · ${r.status}` })),
          ...relatedRevisions.map((r) => ({ at: formatDate(r.createdAt), actor: r.createdBy, action: `Revision ${r.version} · ${r.status}` })),
        ]}
        comments={relatedReviews[0]?.comments.map((c) => ({ author: c.author, body: c.body, at: formatDate(c.createdAt), resolved: c.resolved })) ?? []}
        approvals={design.collaborators.map((name) => ({ name, role: "Collaborator", status: "Awaiting" }))}
        related={[
          ...relatedRevisions.map((r) => ({ label: `Revision ${r.version} — ${r.reason}`, href: `/architect/revisions/${r.id}` })),
          ...relatedReviews.map((r) => ({ label: `Review ${r.code} — ${r.status}`, href: `/architect/reviews/${r.id}` })),
        ]}
        activity={[
          { at: formatDate(design.updatedAt), actor: design.leadArchitect, action: "Uploaded 3 new sheets" },
          { at: formatDate(design.updatedAt), actor: "AI Assistant", action: "Ran compliance check" },
        ]}
        aiInsights={[
          { title: "Completeness", body: `${design.aiCompleteness}% of required sheets detected.` },
          { title: "Confidence", body: `${design.aiConfidence}% model confidence. Advisory only.` },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setApproveOpen(true)}>
            Request approval
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setCommentOpen(true)}>
            Add comment
          </Button>
          <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => navigate({ to: "/architect/ai" })}>
            Open AI Assist
          </Button>
        </div>
      </ArchitectDetailShell>
      <SubmitReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} designName={design.name} />
      <CreateRevisionDialog open={revisionOpen} onOpenChange={setRevisionOpen} designName={design.name} parentVersion={design.version} />
      <ApprovalDialog open={approveOpen} onOpenChange={setApproveOpen} mode="approve" entity={design.name} />
      <CommentDialog open={commentOpen} onOpenChange={setCommentOpen} target={design.name} />
    </>
  );
}
