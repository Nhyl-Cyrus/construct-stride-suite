import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/site")({
  head: () => ({
    meta: [
      { title: "Site — EasyConstruct" },
      { name: "description", content: "Site workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Site"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Site will appear here in the next iteration."
    />
  ),
});
