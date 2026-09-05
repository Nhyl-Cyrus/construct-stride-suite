import { z } from "zod";

export const engineeringReportSchema = z.object({
  title: z.string().min(4, "Report title is required"),
  type: z.string().min(2, "Select a report type"),
  project: z.string().min(2, "Select a project"),
  location: z.string().min(2, "Location is required"),
  date: z.string().min(4, "Report date is required"),
  engineer: z.string().min(2, "Engineer is required"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  findings: z.string().min(10, "Findings must be at least 10 characters"),
  measurements: z.string().optional(),
  observations: z.string().optional(),
  recommendations: z.string().min(5, "Recommendations are required"),
  requiredActions: z.string().optional(),
});

export type EngineeringReportInput = z.infer<typeof engineeringReportSchema>;
