import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/consultant")({
  head: () => ({
    meta: [
      { title: "Consultant — EasyConstruct" },
      { name: "description", content: "Consultant workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Consultant"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Consultant will appear here in the next iteration."
    />
  ),
});
