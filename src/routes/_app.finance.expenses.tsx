import { createFileRoute } from "@tanstack/react-router";
import { ExpensesView } from "@/app/views/finance/ExpensesView";

export const Route = createFileRoute("/_app/finance/expenses")({
  component: ExpensesView,
});
