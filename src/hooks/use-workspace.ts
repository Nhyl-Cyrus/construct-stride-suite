import { useRouterState } from "@tanstack/react-router";
import { resolveWorkspace } from "@/lib/workspaces";

export function useWorkspace() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return resolveWorkspace(pathname);
}
