import { employees, type Employee } from "@/app/models/employees";
import { ok, type Repository } from "./base.repository";

export const employeeRepository: Repository<Employee> = {
  list: () => ok(employees),
  getById: (id) => ok(employees.find((e) => e.id === id)),
};
