import { createCollection, newId } from "./store";
import type { AuditEvent } from "@/app/models/audit";

// Future endpoints: POST /api/audit-events, GET /api/audit-events
export const auditCollection = createCollection<AuditEvent>("audit-events");

export const auditRepository = {
  list: () => auditCollection.list(),
  record: (event: Omit<AuditEvent, "id">) =>
    auditCollection.insert({ id: newId("AUD"), ...event }),
  collection: auditCollection,
};
