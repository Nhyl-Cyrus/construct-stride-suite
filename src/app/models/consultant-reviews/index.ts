import type { ReportAttachment, ReportPriority } from "@/app/models/engineering-reports";

export type ConsultantReviewType =
  | "Design Review"
  | "Technical Review"
  | "Compliance Review"
  | "Structural Review"
  | "Architectural Review"
  | "Documentation Review"
  | "Material Review";

export const CONSULTANT_REVIEW_TYPES: ConsultantReviewType[] = [
  "Design Review",
  "Technical Review",
  "Compliance Review",
  "Structural Review",
  "Architectural Review",
  "Documentation Review",
  "Material Review",
];

export const REVIEW_CHECKLIST = [
  "Technical compliance",
  "Code compliance",
  "Design quality",
  "Documentation completeness",
  "Constructability",
  "Safety considerations",
] as const;

export type ReviewChecklistItem = (typeof REVIEW_CHECKLIST)[number];

export type ConsultantReviewStatus =
  | "Draft"
  | "Submitted"
  | "In Review"
  | "Changes Requested"
  | "Approved"
  | "Rejected";

export interface ConsultantReview {
  id: string;
  title: string;
  project: string;
  subject: string; // design / document under review
  type: ConsultantReviewType;
  priority: ReportPriority;
  reviewer: string;
  dueDate: string;
  findings: string;
  comments?: string;
  recommendations: string;
  requiredChanges?: string;
  checklist: ReviewChecklistItem[];
  attachments: ReportAttachment[];
  status: ConsultantReviewStatus;
  createdAt: string;
}
