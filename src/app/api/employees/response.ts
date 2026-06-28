import type { Employee } from "@/app/models/employees";

export interface ListEmployeesResponse {
  data: Employee[];
  total: number;
}
