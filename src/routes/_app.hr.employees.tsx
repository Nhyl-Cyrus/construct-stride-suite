import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { employees } from "@/lib/hr-data";

const tone: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  "On Leave": "bg-warning/10 text-warning-foreground border-warning/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
  Archived: "bg-muted text-muted-foreground",
};

export const Route = createFileRoute("/_app/hr/employees")({
  head: () => ({ meta: [{ title: "Employees — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  return (
    <EnterprisePage
      title="Employees"
      subtitle="HR · workforce directory"
      description="Search, filter, and manage the full workforce roster."
      kpis={[
        { label: "Total", value: String(employees.length) },
        { label: "Active", value: String(employees.filter((e) => e.status === "Active").length), tone: "success" },
        { label: "On leave", value: String(employees.filter((e) => e.status === "On Leave").length), tone: "warning" },
        { label: "Departments", value: String(new Set(employees.map((e) => e.department)).size) },
      ]}
      rows={employees}
      columns={[
        { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Employee", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "role", header: "Role", render: (r) => r.role },
        { key: "department", header: "Department", render: (r) => r.department },
        { key: "site", header: "Site", render: (r) => r.site },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className={`rounded-full border ${tone[r.status]}`}>{r.status}</Badge> },
        { key: "rate", header: "Rate", render: (r) => <span className="tabular-nums">${r.hourlyRate.toFixed(2)}/hr</span> },
      ]}
      searchable={(r) => `${r.id} ${r.name} ${r.role} ${r.department}`}
      createDialog={{
        label: "New employee",
        title: "Add employee",
        description: "Create an employee record.",
        fields: [
          { name: "name", label: "Full name" },
          { name: "role", label: "Role" },
          { name: "department", label: "Department" },
          { name: "site", label: "Home site" },
        ],
        onSubmit: () => {},
      }}
      rowActions={[
        { label: "View profile", onSelect: (r) => toast.info(`Opening ${r.name}`) },
        { label: "Edit", onSelect: (r) => toast.info(`Edit ${r.id}`) },
        { label: "Assign to project", onSelect: (r) => toast.success(`${r.name} assigned`) },
        { label: "Mark on leave", onSelect: (r) => toast.success(`${r.name} marked on leave`) },
        { label: "Archive", destructive: true, onSelect: (r) => toast.success(`${r.name} archived`) },
      ]}
    />
  );
}
