import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum([
    "Expense",
    "Income",
    "Payment",
    "Reimbursement",
    "Adjustment",
    "Procurement",
  ]),
  project: z.string().min(2, "Select a project"),
  date: z.string().min(4, "Transaction date is required"),
  category: z.string().min(2, "Select a category"),
  description: z.string().min(4, "Describe the transaction"),
  subtotal: z.number().positive("Amount must be greater than zero"),
  taxRate: z.number().min(0).max(50),
  currency: z.string().min(3),
  vendor: z.string().min(2, "Vendor / payee is required"),
  paymentMethod: z.string().min(2, "Select a payment method"),
  costCenter: z.string().min(2, "Select a cost center"),
  budgetCategory: z.string().min(2, "Select a budget category"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
