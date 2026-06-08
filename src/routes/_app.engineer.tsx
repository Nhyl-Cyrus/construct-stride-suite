import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/engineer")({
  head: () => ({
    meta: [
      { title: "Engineer — EasyConstruct" },
      { name: "description", content: "Engineer workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Engineer"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Engineer will appear here in the next iteration."
    />
  ),
});
