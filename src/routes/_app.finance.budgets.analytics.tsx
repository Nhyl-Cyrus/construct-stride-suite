import { createFileRoute } from "@tanstack/react-router";
import { BudgetAnalyticsView } from "@/app/views/finance/BudgetAnalyticsView";

export const Route = createFileRoute("/_app/finance/budgets/analytics")({
  component: BudgetAnalyticsView,
});
