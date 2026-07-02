import { createFileRoute } from "@tanstack/react-router";
import { BudgetComparisonView } from "@/app/views/finance/BudgetComparisonView";

export const Route = createFileRoute("/_app/finance/budgets/comparison")({
  component: BudgetComparisonView,
});
