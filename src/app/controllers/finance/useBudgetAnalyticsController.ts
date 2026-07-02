import { useEffect, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { BudgetAnalyticsSnapshot, BudgetForecastPoint } from "@/app/models/finance/budget-extended";
import type { Budget } from "@/app/models/finance";

export function useBudgetAnalyticsController() {
  const [analytics, setAnalytics] = useState<BudgetAnalyticsSnapshot | null>(null);
  const [forecast, setForecast] = useState<BudgetForecastPoint[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    void Promise.all([
      budgetService.portfolioAnalytics(),
      budgetService.forecast("BUD-2401"),
      budgetService.list(),
    ]).then(([a, f, b]) => {
      setAnalytics(a);
      setForecast(f);
      setBudgets(b);
    });
  }, []);

  return { analytics, forecast, budgets };
}
