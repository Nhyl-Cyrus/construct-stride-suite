import { z } from "zod";
import { DISCIPLINES, DESIGN_CATEGORIES, PHASES } from "@/app/models/architect";

export const designDraftSchema = z.object({
  name: z.string().trim().min(2, "Design name is required"),
  projectId: z.string().min(1, "Select a project"),
  discipline: z.enum(DISCIPLINES as [string, ...string[]], {
    message: "Select a discipline",
  }),
  category: z.enum(DESIGN_CATEGORIES as [string, ...string[]], {
    message: "Select a category",
  }),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  phase: z.enum(PHASES as [string, ...string[]]).optional().or(z.literal("")),
  building: z.string().optional(),
  floor: z.string().optional(),
  zone: z.string().optional(),
  client: z.string().optional(),
  version: z.string().min(1),
  revisionNumber: z.number().int().min(1),
  parentVersion: z.string().optional(),
  reason: z.string().optional(),
  changeSummary: z.string().max(1000).optional(),
  reviewers: z.array(z.string()).default([]),
  engineers: z.array(z.string()).default([]),
  consultants: z.array(z.string()).default([]),
  projectManager: z.string().optional(),
  files: z.array(z.any()).default([]),
});

export const reviewSubmissionSchema = z.object({
  designId: z.string(),
  reviewers: z.array(z.string()).min(1, "Assign at least one reviewer"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  dueDate: z.string().min(1, "Set a due date"),
  note: z.string().max(1000).optional(),
});

export const revisionSchema = z.object({
  designId: z.string(),
  parentVersion: z.string().min(1),
  version: z.string().min(1),
  reason: z.string().min(3, "Reason is required"),
  changeSummary: z.string().min(3, "Summarise the change"),
  affectedSheets: z.array(z.string()).default([]),
});
