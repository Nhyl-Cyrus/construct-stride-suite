import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals — EasyConstruct" },
      { name: "description", content: "Approvals workspace in EasyConstruct." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Approvals"
      subtitle="Module scaffold"
      description="This workspace is wired into the navigation shell. Content for Approvals will appear here in the next iteration."
    />
  ),
});
