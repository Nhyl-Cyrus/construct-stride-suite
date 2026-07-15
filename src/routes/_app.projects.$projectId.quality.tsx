import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { qualityChecks } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

const tone: Record<string, string> = {
  Pass: "bg-success/10 text-success border-success/20",
  Conditional: "bg-warning/10 text-warning-foreground border-warning/20",
  Fail: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/_app/projects/$projectId/quality")({
  head: () => ({ meta: [{ title: "Quality Assurance — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Quality · ${project?.name ?? projectId}`}
      subtitle="Inspections & QA"
      description="Field inspections, checklist scores, and non-conformances."
      kpis={[
        { label: "Pass", value: String(qualityChecks.filter((q) => q.status === "Pass").length), tone: "success" },
        { label: "Conditional", value: String(qualityChecks.filter((q) => q.status === "Conditional").length), tone: "warning" },
        { label: "Fail", value: String(qualityChecks.filter((q) => q.status === "Fail").length), tone: "destructive" },
        { label: "Avg score", value: `${Math.round(qualityChecks.reduce((s, q) => s + q.score, 0) / qualityChecks.length)}%` },
      ]}
      rows={qualityChecks}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "area", header: "Area", render: (r) => <span className="font-medium">{r.area}</span> },
        { key: "inspection", header: "Inspection", render: (r) => r.inspection },
        { key: "inspector", header: "Inspector", render: (r) => r.inspector },
        { key: "score", header: "Score", render: (r) => <span className="tabular-nums">{r.score}%</span> },
        { key: "status", header: "Result", render: (r) => <Badge variant="outline" className={`rounded-full border ${tone[r.status]}`}>{r.status}</Badge> },
        { key: "date", header: "Date", render: (r) => <span className="text-xs text-muted-foreground">{r.date}</span> },
      ]}
      searchable={(r) => `${r.id} ${r.area} ${r.inspection}`}
      createDialog={{
        label: "New inspection",
        title: "Schedule inspection",
        description: "Add a QA inspection to the queue.",
        fields: [
          { name: "area", label: "Area" },
          { name: "inspection", label: "Inspection type" },
          { name: "inspector", label: "Inspector" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Re-inspect", onSelect: (r) => toast.info(`Re-inspecting ${r.area}`) },
        { label: "Generate NCR", onSelect: (r) => toast.success(`NCR created for ${r.id}`) },
        { label: "Attach photos", onSelect: (r) => toast.info(`Photo uploader for ${r.id}`) },
      ]}
    />
  );
}
