export interface ListEmployeesRequest {
  query?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
