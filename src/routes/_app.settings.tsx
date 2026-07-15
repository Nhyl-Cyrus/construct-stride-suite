import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Settings"
      subtitle="Personal & workspace settings"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
