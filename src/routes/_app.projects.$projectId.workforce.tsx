import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge, Progress } from "@/components/enterprise/enterprise-page";
import { employees } from "@/lib/hr-data";
import { projects } from "@/lib/pm-data";

export const Route = createFileRoute("/_app/projects/$projectId/workforce")({
  head: () => ({ meta: [{ title: "Project Workforce — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  const crew = employees.slice(0, 12);
  return (
    <EnterprisePage
      title={`Workforce · ${project?.name ?? projectId}`}
      subtitle="Assigned crew & utilization"
      description="Team members currently allocated to this project with role and status."
      kpis={[
        { label: "On project", value: String(crew.length) },
        { label: "Active", value: String(crew.filter((e) => e.status === "Active").length), tone: "success" },
        { label: "On leave", value: String(crew.filter((e) => e.status === "On Leave").length), tone: "warning" },
        { label: "Weekly hours", value: "1,420" },
      ]}
      rows={crew}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Employee", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "role", header: "Role", render: (r) => r.role },
        { key: "department", header: "Dept", render: (r) => r.department },
        { key: "site", header: "Site", render: (r) => r.site },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="rounded-full">{r.status}</Badge> },
        {
          key: "util",
          header: "Utilization",
          render: () => {
            const v = 60 + Math.floor(Math.random() * 35);
            return (
              <div className="flex items-center gap-2">
                <Progress value={v} className="h-1.5 w-20" />
                <span className="w-9 text-xs tabular-nums text-muted-foreground">{v}%</span>
              </div>
            );
          },
        },
      ]}
      searchable={(r) => `${r.id} ${r.name} ${r.role}`}
      createDialog={{
        label: "Assign employee",
        title: "Assign to project",
        description: "Add an employee to this project team.",
        fields: [
          { name: "employee", label: "Employee ID or name" },
          { name: "role", label: "Project role" },
          { name: "start", label: "Start date" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Reassign", onSelect: (r) => toast.success(`${r.name} reassigned`) },
        { label: "Adjust hours", onSelect: (r) => toast.info(`Hours editor for ${r.name}`) },
        { label: "Release from project", destructive: true, onSelect: (r) => toast.success(`${r.name} released`) },
      ]}
    />
  );
}
