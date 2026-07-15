import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/ai")({
  head: () => ({ meta: [{ title: "HR · AI Assistant — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · AI Assistant"
      subtitle="AI advisory for HR ops"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
