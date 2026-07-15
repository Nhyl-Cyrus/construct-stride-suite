import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/payroll/history")({
  head: () => ({ meta: [{ title: "Payroll · History — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Payroll · History"
      subtitle="Historical payroll runs"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
