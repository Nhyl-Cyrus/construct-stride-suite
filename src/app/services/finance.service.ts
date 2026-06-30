import { financeRepository } from "@/app/repositories/finance.repository";
import { computeKpiSnapshot } from "@/app/models/finance";

export const financeService = {
  kpis: async () => computeKpiSnapshot(),
  budgets: () => financeRepository.budgets(),
  budgetAdjustments: () => financeRepository.budgetAdjustments(),
  budgetHistory: () => financeRepository.budgetHistory(),
  expenses: () => financeRepository.expenses(),
  purchaseRequests: () => financeRepository.purchaseRequests(),
  reimbursements: () => financeRepository.reimbursements(),
  procurement: () => financeRepository.procurement(),
  payrollBatches: () => financeRepository.payrollBatches(),
  invoices: () => financeRepository.invoices(),
  cashFlow: () => financeRepository.cashFlow(),
  projectProfit: () => financeRepository.projectProfit(),
  risks: () => financeRepository.risks(),
  approvals: () => financeRepository.approvals(),
  auditEvents: () => financeRepository.auditEvents(),
  notifications: () => financeRepository.notifications(),
  aiInsights: () => financeRepository.aiInsights(),
  async portfolioProfitability() {
    const rows = await financeRepository.projectProfit();
    const revenue = rows.reduce((s, r) => s + r.revenue, 0);
    const cost = rows.reduce((s, r) => s + r.cost, 0);
    return { rows, revenue, cost, margin: (revenue - cost) / revenue };
  },
};
