import { z } from "zod";

export const consultantReviewSchema = z.object({
  title: z.string().min(4, "Review title is required"),
  project: z.string().min(2, "Select a project"),
  subject: z.string().min(2, "Select the design or document under review"),
  type: z.string().min(2, "Select a review type"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  reviewer: z.string().min(2, "Reviewer is required"),
  dueDate: z.string().min(4, "Due date is required"),
  findings: z.string().min(10, "Findings must be at least 10 characters"),
  comments: z.string().optional(),
  recommendations: z.string().min(5, "Recommendations are required"),
  requiredChanges: z.string().optional(),
  checklist: z.array(z.string()).min(1, "Complete at least one checklist item"),
});

export type ConsultantReviewInput = z.infer<typeof consultantReviewSchema>;
