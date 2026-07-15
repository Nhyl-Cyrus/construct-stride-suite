import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge, Progress } from "@/components/enterprise/enterprise-page";
import { equipment } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

const tone: Record<string, string> = {
  Deployed: "bg-success/10 text-success border-success/20",
  Available: "bg-info/10 text-info border-info/20",
  Maintenance: "bg-warning/10 text-warning-foreground border-warning/20",
  Reserved: "bg-muted text-muted-foreground",
};

export const Route = createFileRoute("/_app/projects/$projectId/equipment")({
  head: () => ({ meta: [{ title: "Equipment — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Equipment · ${project?.name ?? projectId}`}
      subtitle="Equipment assignments"
      description="Fleet allocation and utilization for this project."
      kpis={[
        { label: "Deployed", value: String(equipment.filter((e) => e.status === "Deployed").length), tone: "success" },
        { label: "Available", value: String(equipment.filter((e) => e.status === "Available").length), tone: "info" },
        { label: "In maintenance", value: String(equipment.filter((e) => e.status === "Maintenance").length), tone: "warning" },
        { label: "Avg utilization", value: `${Math.round(equipment.reduce((s, e) => s + e.utilization, 0) / equipment.length)}%` },
      ]}
      rows={equipment}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Asset", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "type", header: "Type", render: (r) => r.type },
        { key: "site", header: "Site", render: (r) => r.site },
        { key: "operator", header: "Operator", render: (r) => r.operator ?? <span className="text-muted-foreground">—</span> },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className={`rounded-full border ${tone[r.status]}`}>{r.status}</Badge> },
        {
          key: "utilization",
          header: "Utilization",
          render: (r) => (
            <div className="flex items-center gap-2">
              <Progress value={r.utilization} className="h-1.5 w-20" />
              <span className="w-9 text-xs tabular-nums text-muted-foreground">{r.utilization}%</span>
            </div>
          ),
        },
      ]}
      searchable={(r) => `${r.id} ${r.name} ${r.type}`}
      createDialog={{
        label: "Reserve asset",
        title: "Reserve equipment",
        description: "Assign fleet asset to this project.",
        fields: [
          { name: "asset", label: "Asset ID / name" },
          { name: "operator", label: "Operator" },
          { name: "when", label: "Reservation window" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Reassign", onSelect: (r) => toast.success(`${r.id} reassigned`) },
        { label: "Schedule maintenance", onSelect: (r) => toast.info(`Maintenance queued for ${r.id}`) },
        { label: "Release", onSelect: (r) => toast.success(`${r.id} released`) },
      ]}
    />
  );
}
