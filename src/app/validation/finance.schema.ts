import { z } from "zod";

export const budgetSchema = z.object({
  project: z.string().min(2),
  category: z.string().min(2),
  planned: z.number().nonnegative(),
  fiscalYear: z.string().regex(/^FY\d{4}$/),
  owner: z.string().min(2),
});
export type BudgetInput = z.infer<typeof budgetSchema>;

export const budgetAdjustmentSchema = z.object({
  budgetId: z.string().startsWith("BUD-"),
  delta: z.number(),
  reason: z.string().min(4),
});
export type BudgetAdjustmentInput = z.infer<typeof budgetAdjustmentSchema>;

export const expenseSchema = z.object({
  vendor: z.string().min(2),
  project: z.string().min(2),
  category: z.enum(["Materials", "Equipment", "Labor", "PPE", "Transport", "Services", "Other"]),
  amount: z.number().positive(),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export const payrollDecisionSchema = z.object({
  batchId: z.string().startsWith("PRB-"),
  decision: z.enum(["approve", "reject", "review"]),
  note: z.string().optional(),
});
export type PayrollDecisionInput = z.infer<typeof payrollDecisionSchema>;
