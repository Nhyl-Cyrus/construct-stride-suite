import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/leave")({
  head: () => ({ meta: [{ title: "HR · Leave Requests — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Leave Requests"
      subtitle="Leave & absence workflow"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
