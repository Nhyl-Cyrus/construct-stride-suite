import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/payroll")({
  head: () => ({ meta: [{ title: "HR · Payroll — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Payroll"
      subtitle="Payroll runs & processing"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
