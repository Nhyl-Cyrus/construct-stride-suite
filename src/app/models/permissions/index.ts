export type Action = "view" | "create" | "update" | "delete" | "approve";
export type Subject =
  | "employee"
  | "attendance"
  | "payroll"
  | "project"
  | "workflow"
  | "report"
  | "document"
  | "notification";

export interface Ability {
  action: Action;
  subject: Subject;
}
