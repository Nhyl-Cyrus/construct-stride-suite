import { useEffect, useMemo, useState } from "react";
import { architectService } from "@/app/services/architect.service";
import { useCreatedDesigns } from "@/app/controllers/shared/useWorkflows";
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

// Thin controllers hydrating from the service. Fixtures seed the initial
// render synchronously so the mocked pipeline behaves like SWR data.
export function useDesigns() {
  const [rows, setRows] = useState<Design[]>(MOCK_DESIGNS);
  const created = useCreatedDesigns();
  useEffect(() => {
    architectService.designs().then(setRows);
  }, []);
  return useMemo(() => [...created, ...rows], [created, rows]);
}
export function useDesign(id: string) {
  const [row, setRow] = useState<Design | undefined>(
    MOCK_DESIGNS.find((d) => d.id === id),
  );
  useEffect(() => {
    architectService.design(id).then(setRow);
  }, [id]);
  return row;
}
export function useBlueprints() {
  const [rows, setRows] = useState<Blueprint[]>(MOCK_BLUEPRINTS);
  useEffect(() => {
    architectService.blueprints().then(setRows);
  }, []);
  return rows;
}
export function useBlueprint(id: string) {
  const [row, setRow] = useState<Blueprint | undefined>(
    MOCK_BLUEPRINTS.find((b) => b.id === id),
  );
  useEffect(() => {
    architectService.blueprint(id).then(setRow);
  }, [id]);
  return row;
}
export function useReviews() {
  const [rows, setRows] = useState<Review[]>(MOCK_REVIEWS);
  useEffect(() => {
    architectService.reviews().then(setRows);
  }, []);
  return rows;
}
export function useReview(id: string) {
  const [row, setRow] = useState<Review | undefined>(
    MOCK_REVIEWS.find((r) => r.id === id),
  );
  useEffect(() => {
    architectService.review(id).then(setRow);
  }, [id]);
  return row;
}
export function useRevisions() {
  const [rows, setRows] = useState<Revision[]>(MOCK_REVISIONS);
  useEffect(() => {
    architectService.revisions().then(setRows);
  }, []);
  return rows;
}
export function useRevision(id: string) {
  const [row, setRow] = useState<Revision | undefined>(
    MOCK_REVISIONS.find((r) => r.id === id),
  );
  useEffect(() => {
    architectService.revision(id).then(setRow);
  }, [id]);
  return row;
}
export function useDocuments() {
  const [rows, setRows] = useState<DesignDocument[]>(MOCK_DOCUMENTS);
  useEffect(() => {
    architectService.documents().then(setRows);
  }, []);
  return rows;
}
export function useDocument(id: string) {
  const [row, setRow] = useState<DesignDocument | undefined>(
    MOCK_DOCUMENTS.find((d) => d.id === id),
  );
  useEffect(() => {
    architectService.document(id).then(setRow);
  }, [id]);
  return row;
}
export function useAiRecommendations() {
  const [rows, setRows] = useState<AiRecommendation[]>(MOCK_AI_RECOMMENDATIONS);
  useEffect(() => {
    architectService.aiRecommendations().then(setRows);
  }, []);
  return rows;
}
