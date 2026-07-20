import { architectRepository } from "@/app/repositories/architect.repository";
import type { DesignWizardDraft } from "@/app/models/architect";
import { designDraftSchema } from "@/app/validation/architect.schema";

export const architectService = {
  designs: () => architectRepository.listDesigns(),
  design: (id: string) => architectRepository.getDesign(id),
  blueprints: () => architectRepository.listBlueprints(),
  blueprint: (id: string) => architectRepository.getBlueprint(id),
  reviews: () => architectRepository.listReviews(),
  review: (id: string) => architectRepository.getReview(id),
  revisions: () => architectRepository.listRevisions(),
  revision: (id: string) => architectRepository.getRevision(id),
  documents: () => architectRepository.listDocuments(),
  document: (id: string) => architectRepository.getDocument(id),
  aiRecommendations: () => architectRepository.listAiRecommendations(),

  // Business rules — draft validation for the Create Design wizard.
  validateDraft(draft: DesignWizardDraft) {
    return designDraftSchema.safeParse(draft);
  },
};
