import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/workforce")({
  head: () => ({ meta: [{ title: "HR · Workforce Planning — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Workforce Planning"
      subtitle="Capacity & headcount planning"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
