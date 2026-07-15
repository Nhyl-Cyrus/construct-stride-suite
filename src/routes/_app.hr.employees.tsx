import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/employees")({
  head: () => ({ meta: [{ title: "HR · Employees — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Employees"
      subtitle="Employee directory"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
