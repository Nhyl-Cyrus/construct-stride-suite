import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/architect/revisions")({
  component: () => <Outlet />,
});
