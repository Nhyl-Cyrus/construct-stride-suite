import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { risks } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";
import { Card, CardContent } from "@/components/ui/card";

const sev: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Med: "bg-info/10 text-info border-info/20",
  High: "bg-warning/10 text-warning-foreground border-warning/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/_app/projects/$projectId/risks")({
  head: () => ({ meta: [{ title: "Risk Register — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Risk Register · ${project?.name ?? projectId}`}
      subtitle="Risk management"
      description="Register, score, and mitigate project risks. AI Intelligence continuously re-scores likelihood."
      kpis={[
        { label: "Open", value: String(risks.filter((r) => r.status === "Open").length), tone: "warning" },
        { label: "Mitigating", value: String(risks.filter((r) => r.status === "Mitigating").length), tone: "info" },
        { label: "Critical severity", value: String(risks.filter((r) => r.severity === "Critical").length), tone: "destructive" },
        { label: "Total", value: String(risks.length) },
      ]}
      rows={risks}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "title", header: "Risk", render: (r) => <span className="font-medium">{r.title}</span> },
        { key: "category", header: "Category", render: (r) => r.category },
        { key: "severity", header: "Severity", render: (r) => <Badge variant="outline" className={`rounded-full border ${sev[r.severity]}`}>{r.severity}</Badge> },
        { key: "likelihood", header: "Likelihood", render: (r) => r.likelihood },
        { key: "owner", header: "Owner", render: (r) => r.owner },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="rounded-full">{r.status}</Badge> },
      ]}
      searchable={(r) => `${r.id} ${r.title} ${r.category}`}
      createDialog={{
        label: "Register risk",
        title: "Register risk",
        description: "Add a new risk to the register.",
        fields: [
          { name: "title", label: "Risk title", placeholder: "Concrete supplier delay" },
          { name: "category", label: "Category", placeholder: "Supply Chain" },
          { name: "owner", label: "Owner", placeholder: "T. Okafor" },
          { name: "mitigation", label: "Mitigation plan", textarea: true },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Start mitigation", onSelect: (r) => toast.success(`${r.id} moved to mitigating`) },
        { label: "Close risk", onSelect: (r) => toast.success(`${r.id} closed`) },
        { label: "Open AI analysis", onSelect: (r) => toast.info(`AI analyzing ${r.id}`) },
        { label: "Delete", destructive: true, onSelect: (r) => toast.success(`${r.id} removed`) },
      ]}
      aside={
        <Card className="rounded-2xl">
          <CardContent className="space-y-2 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">AI recommendation</div>
            <div className="text-sm">Escalate <strong>R-04</strong> (Crane operator shortage) — likelihood trending up 18% this week. Suggest engaging secondary staffing agency.</div>
          </CardContent>
        </Card>
      }
    />
  );
}
