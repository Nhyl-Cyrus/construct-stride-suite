import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/schedule")({
  head: () => ({ meta: [{ title: "HR · Shift Schedule — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Shift Schedule"
      subtitle="Shift planning & rotations"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
