import { createFileRoute } from "@tanstack/react-router";
import { FinanceApprovalsView } from "@/app/views/finance/FinanceApprovalsView";

export const Route = createFileRoute("/_app/finance/approvals")({
  component: FinanceApprovalsView,
});
