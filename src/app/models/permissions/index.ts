export type Action = "view" | "create" | "update" | "delete" | "approve";
export type Subject =
  | "employee"
  | "attendance"
  | "payroll"
  | "project"
  | "workflow"
  | "report"
  | "document"
  | "notification"
  | "design"
  | "blueprint"
  | "review"
  | "revision";

export interface Ability {
  action: Action;
  subject: Subject;
}
