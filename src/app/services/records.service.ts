// Write-side service for the primary action of every workspace.
// Each create* runs: permission check -> Zod validation -> repository insert
// -> audit entry. Views/controllers never touch repositories directly.

import { can } from "@/app/permissions/abilities";
import type { Action, Subject } from "@/app/models/permissions";
import { auditService, type ActorContext } from "./audit.service";
import { recordsRepository } from "@/app/repositories/records.repository";
import { newId } from "@/app/repositories/store";

import type { Project } from "@/app/models/projects";
import type { Employee } from "@/app/models/employees";
import type { FinancialTransaction } from "@/app/models/transactions";
import type {
  EngineeringReport,
  EngineeringReportType,
  ReportPriority,
} from "@/app/models/engineering-reports";
import type { SiteReport, SiteReportType } from "@/app/models/site-reports";
import type {
  ConsultantReview,
  ConsultantReviewType,
  ReviewChecklistItem,
} from "@/app/models/consultant-reviews";
import type { Design } from "@/app/models/architect";

import { createProjectSchema } from "@/app/validation/project.schema";
import { employeeSchema } from "@/app/validation/employee.schema";
import { transactionSchema } from "@/app/validation/transaction.schema";
import { engineeringReportSchema } from "@/app/validation/engineering-report.schema";
import { siteReportSchema } from "@/app/validation/site-report.schema";
import { consultantReviewSchema } from "@/app/validation/consultant-review.schema";

export class WorkflowError extends Error {}

function authorize(actor: ActorContext, action: Action, subject: Subject) {
  if (actor.role === "unknown" || !can(actor.role, action, subject)) {
    throw new WorkflowError(
      `Your role does not have permission to ${action} a ${subject}.`,
    );
  }
}

function validate<T>(
  schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown; error?: { issues: { message: string }[] } } },
  value: unknown,
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new WorkflowError(
      parsed.error?.issues[0]?.message ?? "Please review the form and try again.",
    );
  }
  return parsed.data as T;
}

const today = () => new Date().toISOString();

export const recordsService = {
  /* ---------------------------------------------- Project Manager */
  async createProject(input: unknown, actor: ActorContext): Promise<Project> {
    authorize(actor, "create", "project");
    const data = validate<{
      name: string;
      code: string;
      client: string;
      status: string;
      budget: number;
      initialAllocation: number;
      endDate: string;
      startDate: string;
      city: string;
      province: string;
      projectManager: string;
      workforceSize: number;
      priority: string;
    }>(createProjectSchema, input);

    const project: Project = {
      code: data.code,
      name: data.name,
      client: data.client,
      pm: data.projectManager,
      status: data.status,
      statusTone:
        data.status === "Active"
          ? "info"
          : data.status === "Approved"
            ? "success"
            : "muted",
      progress: 0,
      budget: data.budget
        ? Math.round((data.initialAllocation / data.budget) * 100)
        : 0,
      budgetTotal: data.budget,
      due: data.endDate,
      risk:
        data.priority === "Critical"
          ? "High"
          : data.priority === "High"
            ? "Medium"
            : "Low",
      location: `${data.city}, ${data.province}`,
      workforce: data.workforceSize,
      startDate: data.startDate,
    };

    await recordsRepository.projects.insert(project);
    await auditService.record("PROJECT_CREATED", "project", project.code, actor, {
      name: project.name,
      budget: project.budgetTotal,
    });
    return project;
  },

  /* ---------------------------------------------- Human Resources */
  async createEmployee(
    input: Omit<Employee, "id" | "initials" | "hiredOn" | "attendanceRate" | "performance"> & {
      id?: string;
    },
    actor: ActorContext,
  ): Promise<Employee> {
    authorize(actor, "create", "employee");
    const id = input.id?.trim() || newId("EC");
    const candidate: Employee = {
      id,
      name: input.name,
      initials: input.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join(""),
      role: input.role,
      department: input.department,
      status: input.status,
      site: input.site,
      hiredOn: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      attendanceRate: 100,
      performance: 3,
      hourlyRate: input.hourlyRate,
    };
    validate(employeeSchema, {
      id: candidate.id,
      name: candidate.name,
      role: candidate.role,
      department: candidate.department,
      status: candidate.status,
      site: candidate.site,
      hourlyRate: candidate.hourlyRate,
    });

    await recordsRepository.employees.insert(candidate);
    await auditService.record("EMPLOYEE_CREATED", "employee", candidate.id, actor, {
      name: candidate.name,
      department: candidate.department,
    });
    return candidate;
  },

  /* ---------------------------------------------- Finance */
  async createTransaction(
    input: unknown,
    actor: ActorContext,
  ): Promise<FinancialTransaction> {
    authorize(actor, "create", "transaction");
    const data = validate<{
      type: FinancialTransaction["type"];
      project: string;
      date: string;
      category: string;
      description: string;
      subtotal: number;
      taxRate: number;
      currency: string;
      vendor: string;
      paymentMethod: string;
      costCenter: string;
      budgetCategory: string;
      referenceNumber?: string;
      notes?: string;
    }>(transactionSchema, input);

    const tax = Number(((data.subtotal * data.taxRate) / 100).toFixed(2));
    const amount = Number((data.subtotal + tax).toFixed(2));
    const transaction: FinancialTransaction = {
      id: newId("TXN"),
      number: `TX-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: data.type,
      project: data.project,
      date: data.date,
      category: data.category,
      description: data.description,
      subtotal: data.subtotal,
      taxRate: data.taxRate,
      tax,
      amount,
      currency: data.currency,
      vendor: data.vendor,
      paymentMethod: data.paymentMethod,
      costCenter: data.costCenter,
      budgetCategory: data.budgetCategory,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
      attachments: [],
      flagged: amount > 250000,
      flagReason: amount > 250000 ? "Above approval threshold" : undefined,
      budgetImpact: amount,
      remainingBudget: 0,
      createdBy: actor.userName,
      createdAt: today(),
    };

    await recordsRepository.transactions.insert(transaction);
    await auditService.record(
      "TRANSACTION_RECORDED",
      "transaction",
      transaction.id,
      actor,
      { amount: transaction.amount, project: transaction.project },
    );
    return transaction;
  },

  /* ---------------------------------------------- Architect */
  async createDesign(
    input: Omit<Design, "id" | "createdAt" | "updatedAt">,
    actor: ActorContext,
  ): Promise<Design> {
    authorize(actor, "create", "design");
    if (!input.name?.trim()) throw new WorkflowError("Design name is required");
    const design: Design = {
      ...input,
      id: newId("DSG"),
      createdAt: today(),
      updatedAt: today(),
    };
    await recordsRepository.designs.insert(design);
    await auditService.record("DESIGN_CREATED", "design", design.id, actor, {
      code: design.code,
      name: design.name,
    });
    return design;
  },

  /* ---------------------------------------------- Engineer */
  async createEngineeringReport(
    input: unknown,
    actor: ActorContext,
  ): Promise<EngineeringReport> {
    authorize(actor, "create", "report");
    const data = validate<Record<string, string>>(engineeringReportSchema, input);
    const report: EngineeringReport = {
      id: newId("ENR"),
      title: data.title!,
      type: data.type as EngineeringReportType,
      project: data.project!,
      location: data.location!,
      date: data.date!,
      engineer: data.engineer!,
      priority: data.priority as ReportPriority,
      description: data.description!,
      findings: data.findings!,
      measurements: data.measurements,
      observations: data.observations,
      recommendations: data.recommendations!,
      requiredActions: data.requiredActions,
      attachments: [],
      status: "Submitted",
      createdAt: today(),
    };
    await recordsRepository.engineeringReports.insert(report);
    await auditService.record(
      "ENGINEERING_REPORT_SUBMITTED",
      "engineering-report",
      report.id,
      actor,
      { title: report.title, priority: report.priority },
    );
    return report;
  },

  /* ---------------------------------------------- Site personnel */
  async createSiteReport(input: unknown, actor: ActorContext): Promise<SiteReport> {
    authorize(actor, "create", "report");
    const data = validate<Record<string, string> & { workforceCount: number }>(
      siteReportSchema,
      input,
    );
    const report: SiteReport = {
      id: newId("SR"),
      project: data.project!,
      date: data.date!,
      siteArea: data.siteArea!,
      type: data.type as SiteReportType,
      workCompleted: data.workCompleted!,
      workInProgress: data.workInProgress,
      issues: data.issues,
      delays: data.delays,
      materials: data.materials,
      equipment: data.equipment,
      workforceCount: data.workforceCount,
      safetyObservations: data.safetyObservations,
      siteConditions: data.siteConditions!,
      notes: data.notes,
      attachments: [],
      status: "Submitted",
      submittedBy: actor.userName,
      createdAt: today(),
    };
    await recordsRepository.siteReports.insert(report);
    await auditService.record(
      "SITE_REPORT_SUBMITTED",
      "site-report",
      report.id,
      actor,
      { project: report.project, type: report.type },
    );
    return report;
  },

  /* ---------------------------------------------- Consultant */
  async createConsultantReview(
    input: unknown,
    actor: ActorContext,
  ): Promise<ConsultantReview> {
    authorize(actor, "create", "review");
    const data = validate<Record<string, string> & { checklist: string[] }>(
      consultantReviewSchema,
      input,
    );
    const review: ConsultantReview = {
      id: newId("CRV"),
      title: data.title!,
      project: data.project!,
      subject: data.subject!,
      type: data.type as ConsultantReviewType,
      priority: data.priority as ReportPriority,
      reviewer: data.reviewer!,
      dueDate: data.dueDate!,
      findings: data.findings!,
      comments: data.comments,
      recommendations: data.recommendations!,
      requiredChanges: data.requiredChanges,
      checklist: data.checklist as ReviewChecklistItem[],
      attachments: [],
      status: "Submitted",
      createdAt: today(),
    };
    await recordsRepository.consultantReviews.insert(review);
    await auditService.record(
      "CONSULTANT_REVIEW_SUBMITTED",
      "consultant-review",
      review.id,
      actor,
      { title: review.title, project: review.project },
    );
    return review;
  },
};
