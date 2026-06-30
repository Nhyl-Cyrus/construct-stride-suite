import { createFileRoute } from "@tanstack/react-router";
import { BudgetsView } from "@/app/views/finance/BudgetsView";

export const Route = createFileRoute("/_app/finance/budgets")({
  component: BudgetsView,
});
