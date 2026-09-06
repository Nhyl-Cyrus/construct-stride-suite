import { auditRepository } from "@/app/repositories/audit.repository";
import type { AuditAction, AuditEvent } from "@/app/models/audit";
import type { RoleId } from "@/app/models/roles";

export interface ActorContext {
  userId: string;
  userName: string;
  role: RoleId | "unknown";
}

export const auditService = {
  list: () => auditRepository.list(),
  collection: auditRepository.collection,

  async record(
    action: AuditAction,
    entity: string,
    entityId: string,
    actor: ActorContext,
    metadata?: AuditEvent["metadata"],
  ) {
    return auditRepository.record({
      action,
      entity,
      entityId,
      userId: actor.userId,
      userName: actor.userName,
      role: actor.role,
      timestamp: new Date().toISOString(),
      metadata,
    });
  },
};
