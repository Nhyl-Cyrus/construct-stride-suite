import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast } from "@/components/enterprise/enterprise-page";
import { dailyLogs } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

export const Route = createFileRoute("/_app/projects/$projectId/daily-logs")({
  head: () => ({ meta: [{ title: "Daily Logs — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Daily Logs · ${project?.name ?? projectId}`}
      subtitle="Site diary"
      description="Daily site logs including headcount, hours worked, and narrative summary."
      kpis={[
        { label: "Logs (30d)", value: "26" },
        { label: "Avg headcount", value: String(Math.round(dailyLogs.reduce((s, d) => s + d.headcount, 0) / dailyLogs.length)) },
        { label: "Total hours", value: String(dailyLogs.reduce((s, d) => s + d.hoursWorked, 0).toLocaleString()) },
        { label: "Weather delays", value: "1", tone: "warning" },
      ]}
      rows={dailyLogs}
      columns={[
        { key: "id", header: "Log", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "date", header: "Date", render: (r) => <span className="font-medium">{r.date}</span> },
        { key: "author", header: "Author", render: (r) => r.author },
        { key: "weather", header: "Weather", render: (r) => r.weather },
        { key: "headcount", header: "Crew", render: (r) => <span className="tabular-nums">{r.headcount}</span> },
        { key: "hours", header: "Hours", render: (r) => <span className="tabular-nums">{r.hoursWorked.toLocaleString()}</span> },
        { key: "summary", header: "Summary", render: (r) => <span className="text-muted-foreground line-clamp-1">{r.summary}</span> },
      ]}
      searchable={(r) => `${r.id} ${r.author} ${r.summary}`}
      createDialog={{
        label: "New log",
        title: "Post daily log",
        description: "Publish today's site log.",
        fields: [
          { name: "weather", label: "Weather" },
          { name: "headcount", label: "Headcount" },
          { name: "summary", label: "Narrative", textarea: true },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "View", onSelect: (r) => toast.info(`Opening ${r.id}`) },
        { label: "Duplicate", onSelect: (r) => toast.success(`${r.id} duplicated`) },
        { label: "Print", onSelect: () => window.print() },
        { label: "Delete", destructive: true, onSelect: (r) => toast.success(`${r.id} removed`) },
      ]}
    />
  );
}
