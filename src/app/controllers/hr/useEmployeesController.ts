import { useMemo, useState } from "react";
import { employees as allEmployees, type Employee } from "@/app/models/employees";
import { usePermissions } from "@/app/hooks/usePermissions";

interface Filters {
  query: string;
  department: string;
  status: string;
}

// Controller hook for the HR Employees view. Views consume this and never
// touch services or repositories directly.
export function useEmployeesController() {
  const { can } = usePermissions("human-resources");
  const [filters, setFilters] = useState<Filters>({
    query: "",
    department: "all",
    status: "all",
  });

  const data = useMemo<Employee[]>(() => {
    const q = filters.query.trim().toLowerCase();
    return allEmployees.filter((e) => {
      const matchesQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q);
      const matchesD =
        filters.department === "all" || e.department === filters.department;
      const matchesS = filters.status === "all" || e.status === filters.status;
      return matchesQ && matchesD && matchesS;
    });
  }, [filters]);

  return {
    data,
    total: allEmployees.length,
    filters,
    actions: {
      setQuery: (query: string) => setFilters((f) => ({ ...f, query })),
      setDepartment: (department: string) =>
        setFilters((f) => ({ ...f, department })),
      setStatus: (status: string) => setFilters((f) => ({ ...f, status })),
    },
    permissions: {
      canCreate: can("create", "employee"),
      canArchive: can("delete", "employee"),
    },
  };
}
