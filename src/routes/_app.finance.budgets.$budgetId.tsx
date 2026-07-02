import { createFileRoute } from "@tanstack/react-router";
import { BudgetDetailsView } from "@/app/views/finance/BudgetDetailsView";

export const Route = createFileRoute("/_app/finance/budgets/$budgetId")({
  component: BudgetDetailsPage,
});

function BudgetDetailsPage() {
  const { budgetId } = Route.useParams();
  return <BudgetDetailsView budgetId={budgetId} />;
}
