export type EngineeringReportType =
  | "Site Inspection"
  | "Structural Assessment"
  | "Technical Report"
  | "Safety Observation"
  | "Quality Inspection"
  | "Progress Report"
  | "Engineering Recommendation"
  | "Non-Conformance Report";

export const ENGINEERING_REPORT_TYPES: EngineeringReportType[] = [
  "Site Inspection",
  "Structural Assessment",
  "Technical Report",
  "Safety Observation",
  "Quality Inspection",
  "Progress Report",
  "Engineering Recommendation",
  "Non-Conformance Report",
];

export type ReportPriority = "Low" | "Medium" | "High" | "Critical";
export const REPORT_PRIORITIES: ReportPriority[] = ["Low", "Medium", "High", "Critical"];

export type ReportStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Revision Required";

export interface ReportAttachment {
  id: string;
  name: string;
  size: number;
}

export interface EngineeringReport {
  id: string;
  title: string;
  type: EngineeringReportType;
  project: string;
  location: string;
  date: string;
  engineer: string;
  priority: ReportPriority;
  description: string;
  findings: string;
  measurements?: string;
  observations?: string;
  recommendations: string;
  requiredActions?: string;
  attachments: ReportAttachment[];
  status: ReportStatus;
  createdAt: string;
}
