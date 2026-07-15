import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/settings")({
  head: () => ({ meta: [{ title: "HR · Settings — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Settings"
      subtitle="HR module configuration"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
