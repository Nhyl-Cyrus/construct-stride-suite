import { z } from "zod";

export const siteReportSchema = z.object({
  project: z.string().min(2, "Select a project"),
  date: z.string().min(4, "Report date is required"),
  siteArea: z.string().min(2, "Site area is required"),
  type: z.string().min(2, "Select a report type"),
  workCompleted: z.string().min(10, "Describe the work completed"),
  workInProgress: z.string().optional(),
  issues: z.string().optional(),
  delays: z.string().optional(),
  materials: z.string().optional(),
  equipment: z.string().optional(),
  workforceCount: z
    .number()
    .int("Workforce count must be a whole number")
    .min(0, "Workforce count cannot be negative")
    .max(5000, "Workforce count looks incorrect"),
  safetyObservations: z.string().optional(),
  siteConditions: z.string().min(3, "Site conditions are required"),
  notes: z.string().optional(),
});

export type SiteReportInput = z.infer<typeof siteReportSchema>;
