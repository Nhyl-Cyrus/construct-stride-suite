import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/documents")({
  head: () => ({ meta: [{ title: "HR · Documents — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Documents"
      subtitle="Employee document vault"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
