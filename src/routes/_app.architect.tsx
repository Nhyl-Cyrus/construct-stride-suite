import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/architect")({
  head: () => ({
    meta: [
      { title: "Architect — EasyConstruct" },
      { name: "description", content: "Architect workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Architect"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Architect will appear here in the next iteration."
    />
  ),
});
