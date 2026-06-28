import { employeeService } from "@/app/services/employee.service";
import type { ListEmployeesRequest } from "./request";
import type { ListEmployeesResponse } from "./response";

// HTTP-layer shim. Today it forwards to the in-memory service; tomorrow this
// will issue a fetch / server-function call and translate the response.
export async function listEmployees(
  req: ListEmployeesRequest = {},
): Promise<ListEmployeesResponse> {
  const data = await employeeService.filter({
    query: req.query,
    department: (req.department ?? "all") as never,
    status: (req.status ?? "all") as never,
  });
  return { data, total: data.length };
}
