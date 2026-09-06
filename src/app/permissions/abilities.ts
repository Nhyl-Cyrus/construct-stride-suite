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
  "design",
  "blueprint",
  "review",
  "revision",
  "transaction",
];

const all: Ability[] = ACTIONS.flatMap((action) =>
  SUBJECTS.map((subject) => ({ action, subject })),
);

const view = (subjects: Subject[]): Ability[] =>
  subjects.map((subject) => ({ action: "view" as const, subject }));

const manage = (subjects: Subject[], actions: Action[]): Ability[] =>
  subjects.flatMap((subject) => actions.map((action) => ({ action, subject })));

const architectFull = manage(
  ["design", "blueprint", "review", "revision", "document"],
  ["view", "create", "update", "approve"],
);

export const ABILITIES: Record<RoleId, Ability[]> = {
  "project-manager": all.filter((a) => a.subject !== "payroll"),
  "human-resources": [
    ...view(["project", "workflow"]),
    ...manage(
      ["employee", "attendance", "payroll"],
      ["view", "create", "update", "approve"],
    ),
  ],
  finance: [
    ...view(["project", "employee", "attendance", "payroll", "report"]),
    ...manage(["transaction"], ["view", "create", "update", "approve"]),
    { action: "approve", subject: "payroll" },
  ],
  architect: [...architectFull, ...view(["project", "workflow"])],
  engineer: [
    ...view(["project", "document", "workflow", "design", "blueprint", "revision"]),
    ...manage(["report"], ["view", "create", "update"]),
    { action: "approve", subject: "review" },
  ],
  "site-personnel": [
    ...view(["project", "attendance", "document", "blueprint"]),
    ...manage(["report"], ["view", "create"]),
  ],
  consultant: [
    ...view(["project", "report", "document", "design", "blueprint"]),
    ...manage(["review"], ["view", "create", "update"]),
  ],
};

export function can(role: RoleId, action: Action, subject: Subject): boolean {
  return ABILITIES[role].some(
    (a) => a.action === action && a.subject === subject,
  );
}
