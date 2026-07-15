import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/attendance/issues")({
  head: () => ({ meta: [{ title: "Attendance · Exceptions — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Attendance · Exceptions"
      subtitle="Attendance disputes & exceptions"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
