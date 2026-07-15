import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/attendance/verification")({
  head: () => ({ meta: [{ title: "Attendance · Photo Verification — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Attendance · Photo Verification"
      subtitle="Photo-authenticated clock-ins"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
