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
  | "revision"
  | "transaction";

export interface Ability {
  action: Action;
  subject: Subject;
}
