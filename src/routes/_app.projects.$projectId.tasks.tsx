import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge, Progress } from "@/components/enterprise/enterprise-page";
import { tasks } from "@/lib/enterprise-mock";
import { projects } from "@/lib/pm-data";

const tone: Record<string, string> = {
  Todo: "bg-muted text-muted-foreground",
  "In Progress": "bg-info/10 text-info border-info/20",
  Review: "bg-warning/10 text-warning-foreground border-warning/20",
  Done: "bg-success/10 text-success border-success/20",
  Blocked: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/_app/projects/$projectId/tasks")({
  head: () => ({ meta: [{ title: "Tasks — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  return (
    <EnterprisePage
      title={`Tasks · ${project?.name ?? projectId}`}
      subtitle="Task management"
      description="Track task status, ownership, priority, and progress across the project team."
      kpis={[
        { label: "Total", value: String(tasks.length) },
        { label: "In flight", value: String(tasks.filter((t) => t.status === "In Progress").length), tone: "info" },
        { label: "Blocked", value: String(tasks.filter((t) => t.status === "Blocked").length), tone: "destructive" },
        { label: "Done", value: String(tasks.filter((t) => t.status === "Done").length), tone: "success" },
      ]}
      rows={tasks}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "title", header: "Task", render: (r) => <span className="font-medium">{r.title}</span> },
        { key: "assignee", header: "Owner", render: (r) => r.assignee },
        { key: "priority", header: "Priority", render: (r) => <Badge variant="outline" className="rounded-full">{r.priority}</Badge> },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className={`rounded-full border ${tone[r.status]}`}>{r.status}</Badge> },
        {
          key: "progress",
          header: "Progress",
          render: (r) => (
            <div className="flex items-center gap-2">
              <Progress value={r.progress} className="h-1.5 w-20" />
              <span className="w-9 text-xs tabular-nums text-muted-foreground">{r.progress}%</span>
            </div>
          ),
        },
        { key: "due", header: "Due", render: (r) => <span className="text-xs text-muted-foreground">{r.due}</span> },
      ]}
      searchable={(r) => `${r.id} ${r.title} ${r.assignee}`}
      createDialog={{
        label: "New task",
        title: "Create task",
        description: "Add a task to this project's board.",
        fields: [
          { name: "title", label: "Task title", placeholder: "Pour foundation slab — Zone C" },
          { name: "assignee", label: "Assignee", placeholder: "R. Chen" },
          { name: "due", label: "Due date", placeholder: "May 30" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "Edit", onSelect: (r) => toast.info(`Editing ${r.id}`) },
        { label: "Duplicate", onSelect: (r) => toast.success(`${r.id} duplicated`) },
        { label: "Assign to me", onSelect: (r) => toast.success(`${r.id} reassigned to Maya Rivera`) },
        { label: "Mark complete", onSelect: (r) => toast.success(`${r.id} marked complete`) },
        { label: "Delete", destructive: true, onSelect: (r) => toast.success(`${r.id} removed`) },
      ]}
    />
  );
}
