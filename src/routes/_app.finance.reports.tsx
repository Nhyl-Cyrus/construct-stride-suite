import { createFileRoute } from "@tanstack/react-router";
import { FinanceReportsView } from "@/app/views/finance/FinanceReportsView";

export const Route = createFileRoute("/_app/finance/reports")({
  component: FinanceReportsView,
});
