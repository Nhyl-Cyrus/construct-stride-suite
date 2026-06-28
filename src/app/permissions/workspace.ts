import type { RoleId } from "@/app/models/roles";

// Map a role to its default landing route. Keep in sync with src/lib/workspaces.ts.
export const WORKSPACE_HOME: Record<RoleId, string> = {
  "project-manager": "/dashboard",
  "human-resources": "/hr",
  finance: "/finance",
  architect: "/architect",
  engineer: "/engineer",
  "site-personnel": "/site",
  consultant: "/consultant",
};
