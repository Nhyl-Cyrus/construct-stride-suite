import { employeeRepository } from "@/app/repositories/employee.repository";
import type { Employee } from "@/app/models/employees";

export const employeeService = {
  list: () => employeeRepository.list(),
  getById: (id: string) => employeeRepository.getById(id),

  async filter(criteria: {
    query?: string;
    department?: Employee["department"] | "all";
    status?: Employee["status"] | "all";
  }): Promise<Employee[]> {
    const all = await employeeRepository.list();
    const q = (criteria.query ?? "").trim().toLowerCase();
    return all.filter((e) => {
      const matchesQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q);
      const matchesD =
        !criteria.department ||
        criteria.department === "all" ||
        e.department === criteria.department;
      const matchesS =
        !criteria.status ||
        criteria.status === "all" ||
        e.status === criteria.status;
      return matchesQ && matchesD && matchesS;
    });
  },
};
