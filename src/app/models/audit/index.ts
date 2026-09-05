import type { RoleId } from "@/app/models/roles";

export type AuditAction =
  | "PROJECT_CREATED"
  | "EMPLOYEE_CREATED"
  | "TRANSACTION_RECORDED"
  | "DESIGN_CREATED"
  | "DESIGN_SUBMITTED"
  | "ENGINEERING_REPORT_SUBMITTED"
  | "SITE_REPORT_SUBMITTED"
  | "CONSULTANT_REVIEW_SUBMITTED";

export interface AuditEvent {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  role: RoleId | "unknown";
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
}
