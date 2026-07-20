// Frontend-only DTOs matching the planned backend contract. Repositories
// currently return mock fixtures; swapping to live HTTP means calling the
// endpoints below and validating against these shapes.
//
//   POST   /api/architect/designs
//   GET    /api/architect/designs
//   PUT    /api/architect/designs/:id
//   DELETE /api/architect/designs/:id
//   POST   /api/architect/uploads
//   POST   /api/architect/reviews
//   POST   /api/architect/revisions
//   POST   /api/architect/documents
//   GET    /api/architect/history

import type {
  Design,
  Blueprint,
  Review,
  Revision,
  DesignDocument,
  DesignWizardDraft,
} from "@/app/models/architect";

export interface CreateDesignRequest extends Omit<DesignWizardDraft, "files"> {
  fileIds: string[];
}
export type CreateDesignResponse = Design;

export interface UpdateDesignRequest extends Partial<Design> {
  id: string;
}
export type UpdateDesignResponse = Design;

export interface UploadFileRequest {
  designId?: string;
  name: string;
  sizeKb: number;
  contentType: string;
}
export interface UploadFileResponse {
  fileId: string;
  uploadUrl: string;
}

export interface SubmitReviewRequest {
  designId: string;
  reviewers: string[];
  priority: Review["priority"];
  dueDate: string;
  note?: string;
}
export type SubmitReviewResponse = Review;

export interface CreateRevisionRequest {
  designId: string;
  parentVersion: string;
  version: string;
  reason: string;
  changeSummary: string;
  affectedSheets: string[];
}
export type CreateRevisionResponse = Revision;

export interface CreateDocumentRequest {
  title: string;
  category: DesignDocument["category"];
  linkedDesign?: string;
  fileId: string;
}
export type CreateDocumentResponse = DesignDocument;

export interface HistoryEntry {
  id: string;
  entityType: "design" | "blueprint" | "review" | "revision" | "document";
  entityId: string;
  actor: string;
  action: string;
  at: string;
  metadata?: Record<string, unknown>;
}

export interface HistoryResponse {
  entries: HistoryEntry[];
  cursor?: string;
}

// Blueprint list (kept for symmetry with future endpoints)
export type ListBlueprintsResponse = Blueprint[];
