import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/training")({
  head: () => ({ meta: [{ title: "HR · Training — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Training"
      subtitle="Learning & certifications"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
