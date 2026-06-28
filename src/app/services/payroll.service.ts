import { payrollRepository } from "@/app/repositories/payroll.repository";

export const payrollService = {
  list: () => payrollRepository.list(),
  byEmployee: (empId: string) => payrollRepository.byEmployee(empId),
  async totals() {
    const rows = await payrollRepository.list();
    return rows.reduce(
      (acc, r) => ({
        gross: acc.gross + r.gross,
        net: acc.net + r.net,
        deductions: acc.deductions + r.deductions,
        hours: acc.hours + r.hours,
      }),
      { gross: 0, net: 0, deductions: 0, hours: 0 },
    );
  },
};
