import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Share2, Printer, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchitectDetailShell } from "@/components/architect/architect-detail-shell";
import { useDocument } from "@/app/controllers/architect/useArchitect";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/documentation/$docId")({
  component: DocDetailPage,
});

function DocDetailPage() {
  const { docId } = Route.useParams();
  const doc = useDocument(docId);
  if (!doc) throw notFound();

  return (
    <ArchitectDetailShell
      backTo="/architect/documentation"
      backLabel="Documentation"
      eyebrow={doc.category}
      title={doc.title}
      subtitle={`Owned by ${doc.owner} · ${doc.version}`}
      status={{ label: doc.status, tone: doc.status === "Approved" ? "success" : doc.status === "Archived" ? "warning" : "info" }}
      headerActions={
        <>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Download started")}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="rounded-xl" onClick={() => toast.info("Metadata editor opened")}>
            <FileEdit className="h-4 w-4" /> Edit metadata
          </Button>
        </>
      }
      metadata={[
        { label: "Category", value: doc.category },
        { label: "Version", value: doc.version },
        { label: "Owner", value: doc.owner },
        { label: "File type", value: doc.fileType },
        { label: "Size", value: `${(doc.sizeKb / 1024).toFixed(2)} MB` },
        { label: "Updated", value: formatDate(doc.updatedAt) },
      ]}
      files={[{ name: `${doc.title}.${doc.fileType.toLowerCase()}`, type: doc.fileType, size: `${(doc.sizeKb / 1024).toFixed(2)} MB` }]}
      timeline={[
        { at: formatDate(doc.updatedAt), actor: doc.owner, action: `Updated to ${doc.version}` },
      ]}
      approvals={[{ name: doc.owner, role: "Owner", status: doc.status }]}
      related={doc.linkedDesign ? [{ label: `Linked design ${doc.linkedDesign}`, href: `/architect/designs/${doc.linkedDesign}` }] : []}
      aiInsights={[
        { title: "Completeness", body: "All required fields present." },
        { title: "Compliance", body: "Reviewed against latest permit checklist." },
      ]}
    />
  );
}
