import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge, Progress } from "@/components/enterprise/enterprise-page";
import { timelinePhases } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

export const Route = createFileRoute("/_app/projects/$projectId/timeline")({
  head: () => ({ meta: [{ title: "Project Timeline — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Timeline · ${project?.name ?? projectId}`}
      subtitle="Project schedule & critical path"
      description="Phase-level schedule with critical-path highlighting. Drag milestones (coming soon) to run rescheduling scenarios."
      kpis={[
        { label: "Phases", value: String(timelinePhases.length) },
        { label: "Critical", value: String(timelinePhases.filter((p) => p.critical).length), tone: "warning" },
        { label: "Complete", value: String(timelinePhases.filter((p) => p.progress === 100).length), tone: "success" },
        { label: "In flight", value: String(timelinePhases.filter((p) => p.progress > 0 && p.progress < 100).length), tone: "info" },
      ]}
      rows={timelinePhases}
      columns={[
        { key: "name", header: "Phase", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "window", header: "Window", render: (r) => <span className="text-muted-foreground">{r.start} → {r.end}</span> },
        {
          key: "progress",
          header: "Progress",
          render: (r) => (
            <div className="flex items-center gap-2">
              <Progress value={r.progress} className="h-1.5 w-32" />
              <span className="w-9 text-xs tabular-nums text-muted-foreground">{r.progress}%</span>
            </div>
          ),
        },
        {
          key: "critical",
          header: "Critical path",
          render: (r) => r.critical ? <Badge variant="outline" className="rounded-full border-warning/30 bg-warning/10 text-warning-foreground">Critical</Badge> : <span className="text-xs text-muted-foreground">—</span>,
        },
      ]}
      searchable={(r) => r.name}
      rowActions={[
        { label: "Reschedule", onSelect: (r) => toast.info(`Reschedule ${r.name}`) },
        { label: "Add dependency", onSelect: () => toast.success("Dependency added") },
        { label: "Remove phase", destructive: true, onSelect: (r) => toast.success(`${r.name} removed`) },
      ]}
      primaryAction={{ label: "AI reschedule", onSelect: () => toast.success("AI reschedule proposed — 2 phases shifted -3d.") }}
    />
  );
}
