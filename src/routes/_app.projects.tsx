import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({
    meta: [
      { title: "Projects — EasyConstruct" },
      { name: "description", content: "Projects workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Projects"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Projects will appear here in the next iteration."
    />
  ),
});
