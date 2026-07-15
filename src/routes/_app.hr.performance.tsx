import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/performance")({
  head: () => ({ meta: [{ title: "HR · Performance — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Performance"
      subtitle="Performance reviews & goals"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
