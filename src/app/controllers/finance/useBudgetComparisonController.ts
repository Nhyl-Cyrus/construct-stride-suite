import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { Budget } from "@/app/models/finance";

export type ComparisonMode =
  | "budget-vs-actual"
  | "budget-vs-forecast"
  | "dept-vs-dept"
  | "project-vs-project"
  | "quarter"
  | "year";

export function useBudgetComparisonController() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [mode, setMode] = useState<ComparisonMode>("budget-vs-actual");

  useEffect(() => {
    void budgetService.list().then(setBudgets);
  }, []);

  const rows = useMemo(() => {
    return budgets.map((b) => {
      const forecast = Math.round(b.spent * (1 + (b.committed / b.planned - b.spent / b.planned)));
      const variance = b.planned === 0 ? 0 : (b.spent - b.planned) / b.planned;
      const remaining = b.planned - b.spent;
      // Fake prior-period comparisons for demo
      const priorQuarter = Math.round(b.spent * 0.82);
      const priorYear = Math.round(b.spent * 0.68);
      return { ...b, forecast, variance, remaining, priorQuarter, priorYear };
    });
  }, [budgets]);

  const chartData = useMemo(() => {
    switch (mode) {
      case "budget-vs-actual":
        return rows.map((r) => ({ name: r.project, A: r.planned, B: r.spent, labelA: "Budget", labelB: "Actual" }));
      case "budget-vs-forecast":
        return rows.map((r) => ({ name: r.project, A: r.planned, B: r.forecast, labelA: "Budget", labelB: "Forecast" }));
      case "dept-vs-dept":
        return rows.map((r) => ({ name: r.category, A: r.planned, B: r.spent, labelA: "Planned", labelB: "Spent" }));
      case "project-vs-project":
        return rows.map((r) => ({ name: r.project, A: r.planned, B: r.committed, labelA: "Planned", labelB: "Committed" }));
      case "quarter":
        return rows.map((r) => ({ name: r.project, A: r.priorQuarter, B: r.spent, labelA: "Prev Q", labelB: "Current Q" }));
      case "year":
        return rows.map((r) => ({ name: r.project, A: r.priorYear, B: r.spent, labelA: "Prev Y", labelB: "Current Y" }));
    }
  }, [rows, mode]);

  const labels = useMemo(() => {
    const sample = chartData[0];
    return { A: sample?.labelA ?? "A", B: sample?.labelB ?? "B" };
  }, [chartData]);

  return { rows, mode, setMode, chartData, labels };
}
