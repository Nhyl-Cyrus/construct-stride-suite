import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({
    meta: [
      { title: "Ai insights — EasyConstruct" },
      { name: "description", content: "Ai insights workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Ai insights"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Ai insights will appear here in the next iteration."
    />
  ),
});
