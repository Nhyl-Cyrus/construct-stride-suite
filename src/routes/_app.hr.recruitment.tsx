import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/recruitment")({
  head: () => ({ meta: [{ title: "HR · Recruitment — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Recruitment"
      subtitle="Open roles & pipeline"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
