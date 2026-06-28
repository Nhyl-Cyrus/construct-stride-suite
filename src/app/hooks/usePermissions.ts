import { useCallback } from "react";
import { can } from "@/app/permissions/abilities";
import type { RoleId } from "@/app/models/roles";
import type { Action, Subject } from "@/app/models/permissions";

// Until auth is wired, default to the project-manager role so every view
// renders with full demo permissions.
export function usePermissions(role: RoleId = "project-manager") {
  const check = useCallback(
    (action: Action, subject: Subject) => can(role, action, subject),
    [role],
  );
  return { role, can: check };
}
