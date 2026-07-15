import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/attendance")({
  head: () => ({ meta: [{ title: "HR · Attendance — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="HR · Attendance"
      subtitle="Daily attendance overview"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
