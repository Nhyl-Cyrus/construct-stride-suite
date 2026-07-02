import { budgetRepository } from "@/app/repositories/budget.repository";
import { computeBudgetAnalytics } from "@/app/models/finance/budget-extended";

export const budgetService = {
  list: () => budgetRepository.list(),
  byId: (id: string) => budgetRepository.byId(id),
  categories: () => budgetRepository.categories(),
  allocations: (budgetId?: string) => budgetRepository.allocations(budgetId),
  adjustments: (budgetId?: string) => budgetRepository.adjustments(budgetId),
  history: (budgetId?: string) => budgetRepository.history(budgetId),
  approvalSteps: (budgetId?: string) => budgetRepository.approvalSteps(budgetId),
  comments: (budgetId: string) => budgetRepository.comments(budgetId),
  documents: (budgetId?: string) => budgetRepository.documents(budgetId),
  transactions: (budgetId?: string) => budgetRepository.transactions(budgetId),
  forecast: (budgetId: string) => budgetRepository.forecast(budgetId),
  async analytics(budgetId: string) {
    const budget = (await budgetRepository.byId(budgetId));
    if (!budget) return null;
    const forecast = await budgetRepository.forecast(budgetId);
    return computeBudgetAnalytics(
      { planned: budget.planned, committed: budget.committed, spent: budget.spent },
      forecast,
    );
  },
  async portfolioAnalytics() {
    const budgets = await budgetRepository.list();
    const totals = budgets.reduce(
      (acc, b) => ({
        planned: acc.planned + b.planned,
        committed: acc.committed + b.committed,
        spent: acc.spent + b.spent,
      }),
      { planned: 0, committed: 0, spent: 0 },
    );
    // Aggregate portfolio forecast by summing per-budget forecasts (mock only has one)
    const forecast = await budgetRepository.forecast("BUD-2401");
    return computeBudgetAnalytics(totals, forecast);
  },
};
