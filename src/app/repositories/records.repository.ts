// Repositories for records created by the primary actions of every workspace.
// Backed by the reactive collection store today; each method maps 1:1 to a
// future Express endpoint (POST /api/<resource>, GET /api/<resource>).

import { createCollection, newId } from "./store";
import type { Project } from "@/app/models/projects";
import type { Employee } from "@/app/models/employees";
import type { FinancialTransaction } from "@/app/models/transactions";
import type { EngineeringReport } from "@/app/models/engineering-reports";
import type { SiteReport } from "@/app/models/site-reports";
import type { ConsultantReview } from "@/app/models/consultant-reviews";
import type { Design } from "@/app/models/architect";

export const projectRecords = createCollection<Project>("projects");
export const employeeRecords = createCollection<Employee>("employees");
export const transactionRecords =
  createCollection<FinancialTransaction>("transactions");
export const engineeringReportRecords =
  createCollection<EngineeringReport>("engineering-reports");
export const siteReportRecords = createCollection<SiteReport>("site-reports");
export const consultantReviewRecords =
  createCollection<ConsultantReview>("consultant-reviews");
export const designRecords = createCollection<Design>("designs");

export const recordsRepository = {
  projects: projectRecords,
  employees: employeeRecords,
  transactions: transactionRecords,
  engineeringReports: engineeringReportRecords,
  siteReports: siteReportRecords,
  consultantReviews: consultantReviewRecords,
  designs: designRecords,
  newId,
};
