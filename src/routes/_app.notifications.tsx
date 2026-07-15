import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Notifications"
      subtitle="Workspace notification center"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
