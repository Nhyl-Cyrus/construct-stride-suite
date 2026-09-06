import { useCallback, useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/app/permissions/abilities";
import type { Action, Subject } from "@/app/models/permissions";
import type { RoleId } from "@/app/models/roles";
import { recordsService, WorkflowError } from "@/app/services/records.service";
import type { ActorContext } from "@/app/services/audit.service";
import { auditService } from "@/app/services/audit.service";
import { recordsRepository } from "@/app/repositories/records.repository";
import type { Collection } from "@/app/repositories/store";

const EMPTY: never[] = [];

/** Subscribe a component to a reactive collection (SSR-safe). */
export function useCollection<T>(collection: Collection<T>): T[] {
  return useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot,
    () => EMPTY as unknown as T[],
  );
}

/** Records created through the primary actions, per workspace. */
export const useCreatedProjects = () => useCollection(recordsRepository.projects);
export const useCreatedEmployees = () => useCollection(recordsRepository.employees);
export const useCreatedTransactions = () =>
  useCollection(recordsRepository.transactions);
export const useCreatedDesigns = () => useCollection(recordsRepository.designs);
export const useEngineeringReports = () =>
  useCollection(recordsRepository.engineeringReports);
export const useSiteReports = () => useCollection(recordsRepository.siteReports);
export const useConsultantReviews = () =>
  useCollection(recordsRepository.consultantReviews);
export const useAuditTrail = () => useCollection(auditService.collection);

/**
 * Controller for every primary action. Resolves the signed-in actor, exposes
 * permission flags and wraps each service call with success / error toasts.
 */
export function useWorkflows(fallbackRole: RoleId = "project-manager") {
  const { user } = useAuth();

  const actor: ActorContext = useMemo(
    () => ({
      userId: user?.id ?? "demo-user",
      userName: user?.name ?? "Demo User",
      role: user?.roles?.[0] ?? fallbackRole,
    }),
    [user, fallbackRole],
  );

  const allowed = useCallback(
    (action: Action, subject: Subject) =>
      actor.role !== "unknown" && can(actor.role, action, subject),
    [actor.role],
  );

  const run = useCallback(
    async <T>(
      fn: (actor: ActorContext) => Promise<T>,
      success: (result: T) => { title: string; description?: string },
    ): Promise<T | null> => {
      try {
        const result = await fn(actor);
        const msg = success(result);
        toast.success(msg.title, { description: msg.description });
        return result;
      } catch (error) {
        const message =
          error instanceof WorkflowError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.";
        toast.error("Could not save", { description: message });
        return null;
      }
    },
    [actor],
  );

  return {
    actor,
    can: allowed,
    permissions: {
      canCreateProject: allowed("create", "project"),
      canCreateEmployee: allowed("create", "employee"),
      canCreateTransaction: allowed("create", "transaction"),
      canCreateDesign: allowed("create", "design"),
      canCreateReport: allowed("create", "report"),
      canCreateReview: allowed("create", "review"),
    },
    actions: {
      createProject: (input: unknown) =>
        run(
          (a) => recordsService.createProject(input, a),
          (p) => ({ title: "Project created", description: `${p.code} · ${p.name}` }),
        ),
      createEmployee: (input: Parameters<typeof recordsService.createEmployee>[0]) =>
        run(
          (a) => recordsService.createEmployee(input, a),
          (e) => ({ title: "Employee added", description: `${e.id} · ${e.name}` }),
        ),
      createTransaction: (input: unknown) =>
        run(
          (a) => recordsService.createTransaction(input, a),
          (t) => ({
            title: "Transaction recorded",
            description: `${t.number} · ${t.currency} ${t.amount.toLocaleString()}`,
          }),
        ),
      createDesign: (input: Parameters<typeof recordsService.createDesign>[0]) =>
        run(
          (a) => recordsService.createDesign(input, a),
          (d) => ({ title: "Design created", description: `${d.code} · ${d.name}` }),
        ),
      createEngineeringReport: (input: unknown) =>
        run(
          (a) => recordsService.createEngineeringReport(input, a),
          (r) => ({ title: "Report submitted", description: `${r.id} · ${r.title}` }),
        ),
      createSiteReport: (input: unknown) =>
        run(
          (a) => recordsService.createSiteReport(input, a),
          (r) => ({ title: "Site report submitted", description: `${r.id} · ${r.project}` }),
        ),
      createConsultantReview: (input: unknown) =>
        run(
          (a) => recordsService.createConsultantReview(input, a),
          (r) => ({ title: "Review submitted", description: `${r.id} · ${r.title}` }),
        ),
    },
  };
}
