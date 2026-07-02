import { createFileRoute } from "@tanstack/react-router";
import { BudgetAllocationView } from "@/app/views/finance/BudgetAllocationView";

export const Route = createFileRoute("/_app/finance/budgets/allocation")({
  component: BudgetAllocationView,
});
