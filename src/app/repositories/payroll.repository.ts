import { payrollRows, type PayrollRow } from "@/app/models/payroll";
import { ok } from "./base.repository";

export const payrollRepository = {
  list: (): Promise<PayrollRow[]> => ok(payrollRows),
  byEmployee: (empId: string) =>
    ok(payrollRows.find((p) => p.empId === empId)),
};
