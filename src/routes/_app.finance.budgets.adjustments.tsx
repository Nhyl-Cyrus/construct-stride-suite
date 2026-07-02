import { createFileRoute } from "@tanstack/react-router";
import { BudgetAdjustmentsView } from "@/app/views/finance/BudgetAdjustmentsView";

export const Route = createFileRoute("/_app/finance/budgets/adjustments")({
  component: BudgetAdjustmentsView,
});
