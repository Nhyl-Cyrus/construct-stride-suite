import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_app/hr/attendance/geofence")({
  head: () => ({ meta: [{ title: "Attendance · Geofence — EasyConstruct" }] }),
  component: () => (
    <PlaceholderPage
      title="Attendance · Geofence"
      subtitle="Geofenced site check-ins"
      description="This enterprise surface is scaffolded and wired into navigation. The full workflow, mock data, and controllers land in the next iteration."
    />
  ),
});
