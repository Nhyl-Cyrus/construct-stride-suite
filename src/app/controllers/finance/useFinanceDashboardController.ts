import { useMemo } from "react";
import {
  budgets,
  cashFlow,
  projectProfit,
  financialRisks,
  approvalsQueue,
  aiInsights,
  notifications,
  invoices,
  payrollBatches,
  expenses,
  computeKpiSnapshot,
} from "@/app/models/finance";
import { usePermissions } from "@/app/hooks/usePermissions";

export function useFinanceDashboardController() {
  const { can } = usePermissions("finance");

  return useMemo(() => {
    const kpis = computeKpiSnapshot();
    const totalRevenue = projectProfit.reduce((s, p) => s + p.revenue, 0);
    const totalCost = projectProfit.reduce((s, p) => s + p.cost, 0);

    return {
      kpis,
      budgets,
      cashFlow,
      projectProfit,
      portfolio: {
        revenue: totalRevenue,
        cost: totalCost,
        margin: (totalRevenue - totalCost) / totalRevenue,
      },
      risks: financialRisks,
      approvals: approvalsQueue,
      insights: aiInsights,
      notifications,
      invoices,
      payrollBatches,
      expenses,
      can,
    };
  }, [can]);
}
