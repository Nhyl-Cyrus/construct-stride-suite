import type { Ability, Action, Subject } from "@/app/models/permissions";
import type { RoleId } from "@/app/models/roles";

const ACTIONS: Action[] = ["view", "create", "update", "delete", "approve"];
const SUBJECTS: Subject[] = [
  "employee",
  "attendance",
  "payroll",
  "project",
  "workflow",
  "report",
  "document",
  "notification",
];

const all: Ability[] = ACTIONS.flatMap((action) =>
  SUBJECTS.map((subject) => ({ action, subject })),
);

const view = (subjects: Subject[]): Ability[] =>
  subjects.map((subject) => ({ action: "view" as const, subject }));

export const ABILITIES: Record<RoleId, Ability[]> = {
  "project-manager": all.filter((a) => a.subject !== "payroll"),
  "human-resources": [
    ...view(["project", "workflow"]),
    ...(["employee", "attendance", "payroll"] as Subject[]).flatMap((s) =>
      (["view", "create", "update", "approve"] as Action[]).map((action) => ({
        action,
        subject: s,
      })),
    ),
  ],
  finance: [
    ...view(["project", "employee", "attendance", "payroll", "report"]),
    { action: "approve", subject: "payroll" },
  ],
  architect: view(["project", "document", "workflow"]),
  engineer: view(["project", "document", "workflow", "report"]),
  "site-personnel": view(["project", "attendance", "document"]),
  consultant: view(["project", "report", "document"]),
};

export function can(role: RoleId, action: Action, subject: Subject): boolean {
  return ABILITIES[role].some(
    (a) => a.action === action && a.subject === subject,
  );
}
