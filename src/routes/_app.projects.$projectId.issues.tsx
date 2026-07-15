import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { issues } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

const sev: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Med: "bg-info/10 text-info border-info/20",
  High: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/_app/projects/$projectId/issues")({
  head: () => ({ meta: [{ title: "Issues — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Issues · ${project?.name ?? projectId}`}
      subtitle="Issue tracking"
      description="Field-reported issues escalated for engineering review and resolution."
      kpis={[
        { label: "Open", value: String(issues.filter((i) => i.status === "Open").length), tone: "warning" },
        { label: "In review", value: String(issues.filter((i) => i.status === "In Review").length), tone: "info" },
        { label: "Resolved", value: String(issues.filter((i) => i.status === "Resolved").length), tone: "success" },
        { label: "Total", value: String(issues.length) },
      ]}
      rows={issues}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "title", header: "Issue", render: (r) => <span className="font-medium">{r.title}</span> },
        { key: "reporter", header: "Reporter", render: (r) => r.reporter },
        { key: "severity", header: "Severity", render: (r) => <Badge variant="outline" className={`rounded-full border ${sev[r.severity]}`}>{r.severity}</Badge> },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="rounded-full">{r.status}</Badge> },
        { key: "opened", header: "Opened", render: (r) => <span className="text-xs text-muted-foreground">{r.opened}</span> },
      ]}
      searchable={(r) => `${r.id} ${r.title} ${r.reporter}`}
      createDialog={{
        label: "Report issue",
        title: "Report issue",
        description: "Log a new field issue for review.",
        fields: [
          { name: "title", label: "Issue title" },
          { name: "reporter", label: "Reporter" },
          { name: "details", label: "Details", textarea: true },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Assign to engineer", onSelect: (r) => toast.success(`${r.id} assigned`) },
        { label: "Mark resolved", onSelect: (r) => toast.success(`${r.id} resolved`) },
        { label: "Escalate", onSelect: (r) => toast.info(`${r.id} escalated`) },
        { label: "Delete", destructive: true, onSelect: (r) => toast.success(`${r.id} removed`) },
      ]}
    />
  );
}
