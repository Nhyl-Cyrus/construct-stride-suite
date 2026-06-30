import { createFileRoute } from "@tanstack/react-router";
import { FinanceDashboardView } from "@/app/views/finance/FinanceDashboardView";

export const Route = createFileRoute("/_app/finance/")({
  component: FinanceDashboardView,
});
