import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { projects } from "@/lib/pm-data";

interface Doc { id: string; name: string; kind: string; size: string; uploaded: string; owner: string; status: string; }
const docs: Doc[] = [
  { id: "D-001", name: "Foundation drawings rev 4", kind: "PDF", size: "8.2 MB", uploaded: "May 04", owner: "S. Aquino", status: "Approved" },
  { id: "D-002", name: "Steel shop drawings — L3", kind: "DWG", size: "22.4 MB", uploaded: "May 09", owner: "M. Alvarez", status: "In Review" },
  { id: "D-003", name: "MEP coordination model", kind: "IFC", size: "104 MB", uploaded: "May 12", owner: "K. Singh", status: "Approved" },
  { id: "D-004", name: "Site logistics plan v2", kind: "PDF", size: "3.1 MB", uploaded: "May 14", owner: "M. Rivera", status: "Approved" },
  { id: "D-005", name: "Change order CO-118", kind: "PDF", size: "620 KB", uploaded: "May 16", owner: "T. Okafor", status: "Pending" },
];

export const Route = createFileRoute("/_app/projects/$projectId/documents")({
  head: () => ({ meta: [{ title: "Project Documents — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Documents · ${project?.name ?? projectId}`}
      subtitle="Project document repository"
      description="Drawings, models, submittals, and change orders for this engagement."
      kpis={[
        { label: "Files", value: String(docs.length) },
        { label: "Approved", value: String(docs.filter((d) => d.status === "Approved").length), tone: "success" },
        { label: "In review", value: String(docs.filter((d) => d.status === "In Review").length), tone: "info" },
        { label: "Pending", value: String(docs.filter((d) => d.status === "Pending").length), tone: "warning" },
      ]}
      rows={docs}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Document", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "kind", header: "Type", render: (r) => <Badge variant="outline" className="rounded-full">{r.kind}</Badge> },
        { key: "size", header: "Size", render: (r) => <span className="text-xs text-muted-foreground">{r.size}</span> },
        { key: "owner", header: "Owner", render: (r) => r.owner },
        { key: "uploaded", header: "Uploaded", render: (r) => <span className="text-xs text-muted-foreground">{r.uploaded}</span> },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="rounded-full">{r.status}</Badge> },
      ]}
      searchable={(r) => `${r.id} ${r.name} ${r.owner}`}
      createDialog={{
        label: "Upload",
        title: "Upload document",
        description: "Attach a file to this project.",
        fields: [
          { name: "name", label: "Document name" },
          { name: "kind", label: "File type" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Download", onSelect: (r) => toast.success(`Downloaded ${r.name}`) },
        { label: "Share", onSelect: (r) => toast.success(`Share link copied for ${r.id}`) },
        { label: "Archive", onSelect: (r) => toast.success(`${r.id} archived`) },
        { label: "Delete", destructive: true, onSelect: (r) => toast.success(`${r.id} deleted`) },
      ]}
    />
  );
}
