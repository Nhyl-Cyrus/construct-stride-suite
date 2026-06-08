import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({
    meta: [
      { title: "Finance — EasyConstruct" },
      { name: "description", content: "Finance workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Finance"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Finance will appear here in the next iteration."
    />
  ),
});
