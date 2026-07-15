import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/reports")({
  head: () => ({ meta: [{ title: "HR · Reports — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Reports"
      subtitle="HR analytics & exports"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
