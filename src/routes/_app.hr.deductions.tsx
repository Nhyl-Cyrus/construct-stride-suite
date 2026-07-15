import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/deductions")({
  head: () => ({ meta: [{ title: "HR · Deductions — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Deductions"
      subtitle="Payroll deductions"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
