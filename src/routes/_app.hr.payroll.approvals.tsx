import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/payroll/approvals")({
  head: () => ({ meta: [{ title: "Payroll · Approvals — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Payroll · Approvals"
      subtitle="Payroll approval queue"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
