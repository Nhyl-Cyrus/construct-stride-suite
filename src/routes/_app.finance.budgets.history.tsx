import { createFileRoute } from "@tanstack/react-router";
import { BudgetHistoryView } from "@/app/views/finance/BudgetHistoryView";

export const Route = createFileRoute("/_app/finance/budgets/history")({
  component: BudgetHistoryView,
});
