import { createFileRoute } from "@tanstack/react-router";
import { BudgetApprovalWorkflowView } from "@/app/views/finance/BudgetApprovalWorkflowView";

export const Route = createFileRoute("/_app/finance/budgets/approval")({
  component: BudgetApprovalWorkflowView,
});
