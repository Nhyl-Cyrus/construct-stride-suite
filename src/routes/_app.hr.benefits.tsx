import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/benefits")({
  head: () => ({ meta: [{ title: "HR · Benefits — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Benefits"
      subtitle="Benefits administration"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
