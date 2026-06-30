// Placeholder API surface. When backend lands, swap repositories to call
// fetch('/api/finance/...') through these functions.
import { financeService } from "@/app/services/finance.service";

export const financeApi = {
  getDashboard: async () => ({
    kpis: await financeService.kpis(),
    cashFlow: await financeService.cashFlow(),
    profitability: await financeService.portfolioProfitability(),
    risks: await financeService.risks(),
    approvals: await financeService.approvals(),
    insights: await financeService.aiInsights(),
  }),
};
