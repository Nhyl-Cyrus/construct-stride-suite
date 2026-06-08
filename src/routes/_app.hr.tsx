import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr")({
  head: () => ({
    meta: [
      { title: "Hr — EasyConstruct" },
      { name: "description", content: "Hr workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Hr"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Hr will appear here in the next iteration."
    />
  ),
});
