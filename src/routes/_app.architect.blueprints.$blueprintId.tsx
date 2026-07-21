import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Share2, Printer, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchitectDetailShell } from "@/components/architect/architect-detail-shell";
import { useBlueprint } from "@/app/controllers/architect/useArchitect";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/blueprints/$blueprintId")({
  component: BlueprintDetailPage,
});

function BlueprintDetailPage() {
  const { blueprintId } = Route.useParams();
  const bp = useBlueprint(blueprintId);
  if (!bp) throw notFound();

  return (
    <ArchitectDetailShell
      backTo="/architect/blueprints"
      backLabel="Blueprint library"
      eyebrow={`${bp.folder} · ${bp.discipline}`}
      title={`${bp.drawingNumber} · ${bp.title}`}
      subtitle={`Scale ${bp.scale} · Revision ${bp.revision} · ${bp.fileType}`}
      status={{ label: bp.status, tone: bp.status === "Current" ? "success" : bp.status === "Superseded" ? "warning" : "info" }}
      headerActions={
        <>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Download started")}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print set
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="rounded-xl" onClick={() => toast.info("Version comparison opened")}>
            <GitCompareArrows className="h-4 w-4" /> Compare
          </Button>
        </>
      }
      metadata={[
        { label: "Drawing #", value: bp.drawingNumber },
        { label: "Discipline", value: bp.discipline },
        { label: "Scale", value: bp.scale },
        { label: "Revision", value: bp.revision },
        { label: "Author", value: bp.author },
        { label: "Approval", value: bp.approval },
        { label: "Issue date", value: formatDate(bp.issueDate) },
        { label: "Latest revision", value: formatDate(bp.latestRevisionDate) },
        { label: "Size", value: `${(bp.sizeKb / 1024).toFixed(1)} MB` },
      ]}
      files={[
        { name: `${bp.drawingNumber}-${bp.revision}.${bp.fileType.toLowerCase()}`, type: bp.fileType, size: `${(bp.sizeKb / 1024).toFixed(1)} MB` },
      ]}
      timeline={[
        { at: formatDate(bp.issueDate), actor: bp.author, action: "Issued for construction" },
        { at: formatDate(bp.latestRevisionDate), actor: bp.author, action: `Revised to rev ${bp.revision}` },
      ]}
      approvals={[{ name: bp.author, role: "Author", status: bp.approval }]}
      related={[]}
      activity={[
        { at: formatDate(bp.latestRevisionDate), actor: bp.author, action: "Uploaded new revision" },
      ]}
      aiInsights={[
        { title: "Sheet naming", body: "Matches project template — no rename required." },
        { title: "Coordination", body: "No clashes detected against latest structural model." },
      ]}
    >
      <div className="rounded-2xl border p-4">
        <div className="text-sm font-semibold">Tags</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {bp.tags.map((t) => (
            <span key={t} className="rounded-full border px-2 py-0.5 text-[10px]">{t}</span>
          ))}
        </div>
      </div>
    </ArchitectDetailShell>
  );
}
