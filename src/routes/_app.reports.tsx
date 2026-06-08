import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EasyConstruct" },
      { name: "description", content: "Reports workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Reports"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Reports will appear here in the next iteration."
    />
  ),
});
