import { createFileRoute } from "@tanstack/react-router";
import { PayrollReviewView } from "@/app/views/finance/PayrollReviewView";

export const Route = createFileRoute("/_app/finance/payroll-review")({
  component: PayrollReviewView,
});
