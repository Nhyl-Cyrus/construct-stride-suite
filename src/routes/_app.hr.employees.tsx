import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePage, toast, Badge } from "@/components/enterprise/enterprise-page";
import { employees as fixtureEmployees } from "@/lib/hr-data";
import { useWorkflows, useCreatedEmployees } from "@/app/controllers/shared/useWorkflows";

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
  const { permissions, actions } = useWorkflows("human-resources");
  const created = useCreatedEmployees();
  const employees = [...created, ...fixtureEmployees];

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
          { name: "name", label: "Full name", placeholder: "Juan Dela Cruz" },
          { name: "role", label: "Role", placeholder: "Site Engineer" },
          { name: "department", label: "Department (Field Ops, Engineering, Architecture, Finance, Admin, Safety)", placeholder: "Engineering" },
          { name: "site", label: "Home site", placeholder: "Bonifacio Tower" },
          { name: "hourlyRate", label: "Hourly rate (USD)", placeholder: "28.50" },
        ],
        onSubmit: async (values) => {
          if (!permissions.canCreateEmployee) return false;
          const saved = await actions.createEmployee({
            name: values.name ?? "",
            role: values.role ?? "",
            department: (values.department || "Field Ops") as
              | "Field Ops"
              | "Engineering"
              | "Architecture"
              | "Finance"
              | "Admin"
              | "Safety",
            site: values.site ?? "",
            status: "Active",
            hourlyRate: Number(values.hourlyRate) || 0,
          });
          return Boolean(saved);
        },
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
