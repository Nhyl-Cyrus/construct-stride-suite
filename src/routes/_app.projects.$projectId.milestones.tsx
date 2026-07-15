import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { milestones } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

const tone: Record<string, string> = {
  Complete: "bg-success/10 text-success border-success/20",
  "On Track": "bg-info/10 text-info border-info/20",
  "At Risk": "bg-warning/10 text-warning-foreground border-warning/20",
  Slipping: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/_app/projects/$projectId/milestones")({
  head: () => ({ meta: [{ title: "Milestones — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Milestones · ${project?.name ?? projectId}`}
      subtitle="Milestone tracker"
      description="Phase gates that drive billing, permits, and stakeholder reviews."
      kpis={[
        { label: "Total", value: String(milestones.length) },
        { label: "Complete", value: String(milestones.filter((m) => m.status === "Complete").length), tone: "success" },
        { label: "At risk", value: String(milestones.filter((m) => m.status === "At Risk").length), tone: "warning" },
        { label: "Slipping", value: String(milestones.filter((m) => m.status === "Slipping").length), tone: "destructive" },
      ]}
      rows={milestones}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Milestone", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "phase", header: "Phase", render: (r) => r.phase },
        { key: "owner", header: "Owner", render: (r) => r.owner },
        { key: "date", header: "Target", render: (r) => <span className="tabular-nums text-muted-foreground">{r.date}</span> },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className={`rounded-full border ${tone[r.status]}`}>{r.status}</Badge> },
      ]}
      searchable={(r) => `${r.id} ${r.name} ${r.phase}`}
      createDialog={{
        label: "New milestone",
        title: "Add milestone",
        description: "Add a phase gate to the project schedule.",
        fields: [
          { name: "name", label: "Milestone name", placeholder: "Envelope watertight" },
          { name: "phase", label: "Phase", placeholder: "Phase 3" },
          { name: "date", label: "Target date", placeholder: "Aug 01, 2026" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Mark complete", onSelect: (r) => toast.success(`${r.name} complete`) },
        { label: "Reschedule", onSelect: (r) => toast.info(`Reschedule ${r.name}`) },
        { label: "Generate report", onSelect: (r) => toast.success(`Report for ${r.name} generated`) },
        { label: "Remove", destructive: true, onSelect: (r) => toast.success(`${r.name} removed`) },
      ]}
    />
  );
}
