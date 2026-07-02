import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { BudgetApprovalStep, BudgetApprovalState } from "@/app/models/finance/budget-extended";
import type { Budget } from "@/app/models/finance";

export function useBudgetApprovalController() {
  const [steps, setSteps] = useState<BudgetApprovalStep[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("BUD-2401");

  useEffect(() => {
    void Promise.all([budgetService.approvalSteps(), budgetService.list()]).then(([s, b]) => {
      setSteps(s);
      setBudgets(b);
    });
  }, []);

  const budgetSteps = useMemo(
    () => steps.filter((s) => s.budgetId === selectedBudgetId),
    [steps, selectedBudgetId],
  );

  const current: BudgetApprovalState = useMemo(() => {
    const undecided = budgetSteps.find((s) => !s.decision);
    if (undecided) return undecided.stage;
    const last = budgetSteps[budgetSteps.length - 1];
    return last?.stage ?? "draft";
  }, [budgetSteps]);

  const grouped = useMemo(() => {
    const map = new Map<string, BudgetApprovalStep[]>();
    for (const s of steps) {
      const arr = map.get(s.budgetId) ?? [];
      arr.push(s);
      map.set(s.budgetId, arr);
    }
    return map;
  }, [steps]);

  return {
    steps,
    budgets,
    selectedBudgetId,
    setSelectedBudgetId,
    budgetSteps,
    current,
    grouped,
  };
}
