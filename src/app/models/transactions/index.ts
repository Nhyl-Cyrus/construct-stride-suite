export type TransactionType =
  | "Expense"
  | "Income"
  | "Payment"
  | "Reimbursement"
  | "Adjustment"
  | "Procurement";

export const TRANSACTION_TYPES: TransactionType[] = [
  "Expense",
  "Income",
  "Payment",
  "Reimbursement",
  "Adjustment",
  "Procurement",
];

export const TRANSACTION_CATEGORIES = [
  "Materials",
  "Equipment",
  "Labor",
  "PPE",
  "Transport",
  "Services",
  "Permits",
  "Other",
];

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Company Card",
  "Cash",
  "Check",
  "Payment Terms",
];

export const COST_CENTERS = ["CC-100 Field Ops", "CC-200 Engineering", "CC-300 Admin", "CC-400 Safety"];

export interface TransactionAttachment {
  id: string;
  name: string;
  kind: "Receipt" | "Invoice" | "Purchase Order" | "Other";
  size: number;
}

export interface FinancialTransaction {
  id: string;
  number: string;
  type: TransactionType;
  project: string;
  date: string;
  category: string;
  description: string;
  subtotal: number;
  taxRate: number;
  tax: number;
  amount: number;
  currency: string;
  vendor: string;
  paymentMethod: string;
  costCenter: string;
  budgetCategory: string;
  referenceNumber?: string;
  notes?: string;
  attachments: TransactionAttachment[];
  flagged: boolean;
  flagReason?: string;
  budgetImpact: number;
  remainingBudget: number;
  createdBy: string;
  createdAt: string;
}
