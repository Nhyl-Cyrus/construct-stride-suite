import {
  MOCK_DESIGNS,
  MOCK_BLUEPRINTS,
  MOCK_REVIEWS,
  MOCK_REVISIONS,
  MOCK_DOCUMENTS,
  MOCK_AI_RECOMMENDATIONS,
  type Design,
  type Blueprint,
  type Review,
  type Revision,
  type DesignDocument,
  type AiRecommendation,
} from "@/app/models/architect";
import { ok } from "./base.repository";

// In-memory mock repository. Swap the bodies for HTTP calls to
// src/app/api/architect/service later without touching services or views.
export const architectRepository = {
  // Designs
  listDesigns: () => ok<Design[]>(MOCK_DESIGNS),
  getDesign: (id: string) => ok(MOCK_DESIGNS.find((d) => d.id === id)),

  // Blueprints
  listBlueprints: () => ok<Blueprint[]>(MOCK_BLUEPRINTS),
  getBlueprint: (id: string) => ok(MOCK_BLUEPRINTS.find((b) => b.id === id)),

  // Reviews
  listReviews: () => ok<Review[]>(MOCK_REVIEWS),
  getReview: (id: string) => ok(MOCK_REVIEWS.find((r) => r.id === id)),

  // Revisions
  listRevisions: () => ok<Revision[]>(MOCK_REVISIONS),
  getRevision: (id: string) => ok(MOCK_REVISIONS.find((r) => r.id === id)),

  // Documents
  listDocuments: () => ok<DesignDocument[]>(MOCK_DOCUMENTS),
  getDocument: (id: string) => ok(MOCK_DOCUMENTS.find((d) => d.id === id)),

  // AI
  listAiRecommendations: () => ok<AiRecommendation[]>(MOCK_AI_RECOMMENDATIONS),
};
