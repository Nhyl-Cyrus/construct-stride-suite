import { z } from "zod";

export const budgetAllocationSchema = z.object({
  budgetId: z.string().startsWith("BUD-"),
  categoryId: z.string().startsWith("CAT-"),
  department: z.string().min(2),
  amount: z.number().positive(),
  owner: z.string().min(2),
});
export type BudgetAllocationInput = z.infer<typeof budgetAllocationSchema>;

export const budgetAdjustmentExtSchema = z.object({
  budgetId: z.string().startsWith("BUD-"),
  kind: z.enum(["increase", "decrease", "transfer", "emergency"]),
  adjustmentAmount: z.number(),
  reason: z.string().min(8),
  transferFromId: z.string().optional(),
  transferToId: z.string().optional(),
});
export type BudgetAdjustmentExtInput = z.infer<typeof budgetAdjustmentExtSchema>;

export const budgetApprovalDecisionSchema = z.object({
  stepId: z.string(),
  decision: z.enum(["approve", "reject", "return"]),
  comments: z.string().optional(),
});
export type BudgetApprovalDecisionInput = z.infer<typeof budgetApprovalDecisionSchema>;
