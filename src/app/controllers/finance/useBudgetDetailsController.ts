import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { Budget } from "@/app/models/finance";
import type {
  BudgetAllocation,
  BudgetAdjustmentExt,
  BudgetHistoryEntryExt,
  BudgetApprovalStep,
  BudgetComment,
  BudgetDocument,
  BudgetTransaction,
  BudgetForecastPoint,
  BudgetAnalyticsSnapshot,
} from "@/app/models/finance/budget-extended";

export function useBudgetDetailsController(budgetId: string) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [adjustments, setAdjustments] = useState<BudgetAdjustmentExt[]>([]);
  const [history, setHistory] = useState<BudgetHistoryEntryExt[]>([]);
  const [steps, setSteps] = useState<BudgetApprovalStep[]>([]);
  const [comments, setComments] = useState<BudgetComment[]>([]);
  const [docs, setDocs] = useState<BudgetDocument[]>([]);
  const [tx, setTx] = useState<BudgetTransaction[]>([]);
  const [forecast, setForecast] = useState<BudgetForecastPoint[]>([]);
  const [analytics, setAnalytics] = useState<BudgetAnalyticsSnapshot | null>(null);

  useEffect(() => {
    void Promise.all([
      budgetService.byId(budgetId),
      budgetService.allocations(budgetId),
      budgetService.adjustments(budgetId),
      budgetService.history(budgetId),
      budgetService.approvalSteps(budgetId),
      budgetService.comments(budgetId),
      budgetService.documents(budgetId),
      budgetService.transactions(budgetId),
      budgetService.forecast(budgetId),
      budgetService.analytics(budgetId),
    ]).then(([b, a, adj, h, s, c, d, t, f, an]) => {
      setBudget(b);
      setAllocations(a);
      setAdjustments(adj);
      setHistory(h);
      setSteps(s);
      setComments(c);
      setDocs(d);
      setTx(t);
      setForecast(f);
      setAnalytics(an);
    });
  }, [budgetId]);

  const linkedExpenses = useMemo(() => tx.filter((t) => t.type === "actual"), [tx]);
  const commitments = useMemo(() => tx.filter((t) => t.type === "commitment"), [tx]);

  return {
    budget,
    allocations,
    adjustments,
    history,
    steps,
    comments,
    docs,
    tx,
    linkedExpenses,
    commitments,
    forecast,
    analytics,
  };
}
