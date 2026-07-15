import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Recruitment · Interviews — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Recruitment · Interviews"
      subtitle="Interview scheduling"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
