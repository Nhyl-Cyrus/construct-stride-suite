import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/notifications")({
  head: () => ({ meta: [{ title: "HR · Notifications — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Notifications"
      subtitle="HR notification center"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
