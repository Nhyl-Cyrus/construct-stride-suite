import { ok } from "./base.repository";
import { budgets, budgetHistory } from "@/app/models/finance";
import {
  budgetAllocations,
  budgetAdjustmentsExt,
  budgetHistoryExt,
  budgetApprovalSteps,
  budgetComments,
  budgetDocuments,
  budgetCategories,
  budgetTransactions,
  budgetForecast,
} from "@/app/models/finance/budget-extended";

export const budgetRepository = {
  list: () => ok(budgets),
  byId: (id: string) => ok(budgets.find((b) => b.id === id) ?? null),
  categories: () => ok(budgetCategories),
  allocations: (budgetId?: string) =>
    ok(budgetId ? budgetAllocations.filter((a) => a.budgetId === budgetId) : budgetAllocations),
  adjustments: (budgetId?: string) =>
    ok(budgetId ? budgetAdjustmentsExt.filter((a) => a.budgetId === budgetId) : budgetAdjustmentsExt),
  history: (budgetId?: string) =>
    ok(budgetId ? budgetHistoryExt.filter((h) => h.budgetId === budgetId) : budgetHistoryExt),
  legacyHistory: () => ok(budgetHistory),
  approvalSteps: (budgetId?: string) =>
    ok(budgetId ? budgetApprovalSteps.filter((s) => s.budgetId === budgetId) : budgetApprovalSteps),
  comments: (budgetId: string) => ok(budgetComments.filter((c) => c.budgetId === budgetId)),
  documents: (budgetId?: string) =>
    ok(budgetId ? budgetDocuments.filter((d) => d.budgetId === budgetId) : budgetDocuments),
  transactions: (budgetId?: string) =>
    ok(budgetId ? budgetTransactions.filter((t) => t.budgetId === budgetId) : budgetTransactions),
  forecast: (budgetId: string) => ok(budgetForecast.filter((f) => f.budgetId === budgetId)),
};
