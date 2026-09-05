import type { ReportAttachment, ReportStatus } from "@/app/models/engineering-reports";

export type SiteReportType =
  | "Daily Site Report"
  | "Progress Report"
  | "Safety Report"
  | "Incident Report"
  | "Material Delivery"
  | "Workforce Report"
  | "Equipment Report"
  | "Site Issue"
  | "Weather / Site Condition";

export const SITE_REPORT_TYPES: SiteReportType[] = [
  "Daily Site Report",
  "Progress Report",
  "Safety Report",
  "Incident Report",
  "Material Delivery",
  "Workforce Report",
  "Equipment Report",
  "Site Issue",
  "Weather / Site Condition",
];

export interface SiteReport {
  id: string;
  project: string;
  date: string;
  siteArea: string;
  type: SiteReportType;
  workCompleted: string;
  workInProgress?: string;
  issues?: string;
  delays?: string;
  materials?: string;
  equipment?: string;
  workforceCount: number;
  safetyObservations?: string;
  siteConditions: string;
  notes?: string;
  attachments: ReportAttachment[];
  status: ReportStatus;
  submittedBy: string;
  createdAt: string;
}
