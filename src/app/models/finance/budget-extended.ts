// Extended Budget domain models: allocations, categories, approval steps,
// transactions, forecasts, comments, documents. Designed to map 1:1 to a
// future PostgreSQL schema (see docs/db/budget-schema.sql).

import type { ApprovalStatus } from "./index";

export type BudgetApprovalState =
  | "draft"
  | "pending-review"
  | "finance-review"
  | "manager-review"
  | "approved"
  | "rejected"
  | "returned"
  | "cancelled";

export type AdjustmentKind = "increase" | "decrease" | "transfer" | "emergency";

export interface BudgetCategory {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  color: string;
}

export interface BudgetAllocation {
  id: string;
  budgetId: string;
  project: string;
  department: string;
  categoryId: string;
  category: string;
  amount: number;
  consumed: number;
  percentage: number; // of parent budget
  owner: string;
  status: ApprovalStatus;
  updatedAt: string;
}

export interface BudgetAdjustmentExt {
  id: string;
  budgetId: string;
  project: string;
  kind: AdjustmentKind;
  originalAmount: number;
  adjustmentAmount: number; // signed
  newAmount: number;
  transferFromId?: string; // for transfers
  transferToId?: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: BudgetApprovalState;
  supportingDocs: { id: string; name: string; size: string }[];
}

export interface BudgetHistoryEntryExt {
  id: string;
  budgetId: string;
  project: string;
  action: "created" | "updated" | "approved" | "adjusted" | "transferred" | "locked" | "rejected";
  field?: string;
  oldValue?: string | number;
  newValue?: string | number;
  reason?: string;
  actor: string;
  at: string;
}

export interface BudgetApprovalStep {
  id: string;
  budgetId: string;
  stage: BudgetApprovalState;
  approver: string;
  role: string;
  decision?: "approve" | "reject" | "return";
  decidedAt?: string;
  comments?: string;
  documentIds: string[];
}

export interface BudgetComment {
  id: string;
  budgetId: string;
  author: string;
  at: string;
  body: string;
}

export interface BudgetDocument {
  id: string;
  budgetId: string;
  name: string;
  kind: "contract" | "quote" | "approval" | "invoice" | "other";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  allocationId?: string;
  date: string;
  vendor: string;
  category: string;
  description: string;
  amount: number;
  type: "commitment" | "actual" | "release";
}

export interface BudgetForecastPoint {
  budgetId: string;
  month: string;
  planned: number;
  actual: number | null;
  forecast: number;
}

// ---------- Mock fixtures ----------

export const budgetCategories: BudgetCategory[] = [
  { id: "CAT-CIV", code: "CIV", name: "Civil & Structural", color: "#0ea5e9" },
  { id: "CAT-MEP", code: "MEP", name: "MEP", color: "#8b5cf6" },
  { id: "CAT-SITE", code: "SITE", name: "Site Prep", color: "#f59e0b" },
  { id: "CAT-FIT", code: "FIT", name: "Fit-out", color: "#10b981" },
  { id: "CAT-STEEL", code: "STL", name: "Steel & Cabling", color: "#f43f5e" },
  { id: "CAT-CONT", code: "CTG", name: "Contingency", color: "#64748b" },
];

export const budgetAllocations: BudgetAllocation[] = [
  { id: "ALC-1001", budgetId: "BUD-2401", project: "Westgate Tower", department: "Civil", categoryId: "CAT-CIV", category: "Civil & Structural", amount: 7_400_000, consumed: 5_140_000, percentage: 59.7, owner: "L. Patel", status: "approved", updatedAt: "2026-06-20" },
  { id: "ALC-1002", budgetId: "BUD-2401", project: "Westgate Tower", department: "MEP", categoryId: "CAT-MEP", category: "MEP", amount: 3_100_000, consumed: 1_980_000, percentage: 25.0, owner: "K. Adeyemi", status: "approved", updatedAt: "2026-06-19" },
  { id: "ALC-1003", budgetId: "BUD-2401", project: "Westgate Tower", department: "Contingency", categoryId: "CAT-CONT", category: "Contingency", amount: 1_900_000, consumed: 1_000_000, percentage: 15.3, owner: "Finance", status: "pending", updatedAt: "2026-06-22" },
  { id: "ALC-1004", budgetId: "BUD-2402", project: "Harborline Hub", department: "MEP", categoryId: "CAT-MEP", category: "MEP", amount: 4_200_000, consumed: 3_820_000, percentage: 75.0, owner: "K. Adeyemi", status: "review", updatedAt: "2026-06-24" },
  { id: "ALC-1005", budgetId: "BUD-2402", project: "Harborline Hub", department: "Site", categoryId: "CAT-SITE", category: "Site Prep", amount: 1_400_000, consumed: 1_160_000, percentage: 25.0, owner: "M. Tanaka", status: "approved", updatedAt: "2026-06-18" },
  { id: "ALC-1006", budgetId: "BUD-2403", project: "Northgate Plaza", department: "Site", categoryId: "CAT-SITE", category: "Site Prep", amount: 5_400_000, consumed: 2_140_000, percentage: 60.7, owner: "M. Tanaka", status: "approved", updatedAt: "2026-06-17" },
  { id: "ALC-1007", budgetId: "BUD-2403", project: "Northgate Plaza", department: "MEP", categoryId: "CAT-MEP", category: "MEP", amount: 2_600_000, consumed: 1_000_000, percentage: 29.2, owner: "K. Adeyemi", status: "approved", updatedAt: "2026-06-16" },
  { id: "ALC-1008", budgetId: "BUD-2403", project: "Northgate Plaza", department: "Contingency", categoryId: "CAT-CONT", category: "Contingency", amount: 900_000, consumed: 0, percentage: 10.1, owner: "Finance", status: "pending", updatedAt: "2026-06-15" },
  { id: "ALC-1009", budgetId: "BUD-2404", project: "Phoenix HQ", department: "Fit-out", categoryId: "CAT-FIT", category: "Fit-out", amount: 15_800_000, consumed: 13_950_000, percentage: 74.2, owner: "R. Costa", status: "approved", updatedAt: "2026-06-27" },
  { id: "ALC-1010", budgetId: "BUD-2404", project: "Phoenix HQ", department: "MEP", categoryId: "CAT-MEP", category: "MEP", amount: 3_600_000, consumed: 3_000_000, percentage: 16.9, owner: "K. Adeyemi", status: "approved", updatedAt: "2026-06-25" },
  { id: "ALC-1011", budgetId: "BUD-2404", project: "Phoenix HQ", department: "Contingency", categoryId: "CAT-CONT", category: "Contingency", amount: 1_900_000, consumed: 1_000_000, percentage: 8.9, owner: "Finance", status: "review", updatedAt: "2026-06-28" },
  { id: "ALC-1012", budgetId: "BUD-2405", project: "Riverbend Bridge", department: "Steel", categoryId: "CAT-STEEL", category: "Steel & Cabling", amount: 4_450_000, consumed: 2_010_000, percentage: 65.9, owner: "J. Okafor", status: "approved", updatedAt: "2026-06-11" },
  { id: "ALC-1013", budgetId: "BUD-2405", project: "Riverbend Bridge", department: "Site", categoryId: "CAT-SITE", category: "Site Prep", amount: 1_600_000, consumed: 800_000, percentage: 23.7, owner: "M. Tanaka", status: "approved", updatedAt: "2026-06-10" },
  { id: "ALC-1014", budgetId: "BUD-2405", project: "Riverbend Bridge", department: "Contingency", categoryId: "CAT-CONT", category: "Contingency", amount: 700_000, consumed: 200_000, percentage: 10.4, owner: "Finance", status: "pending", updatedAt: "2026-06-09" },
];

export const budgetAdjustmentsExt: BudgetAdjustmentExt[] = [
  {
    id: "ADJ-2001", budgetId: "BUD-2401", project: "Westgate Tower",
    kind: "increase", originalAmount: 12_400_000, adjustmentAmount: 480_000, newAmount: 12_880_000,
    reason: "Steel re-tender variance recovered above baseline; requires ceiling adjustment.",
    requestedBy: "L. Patel", requestedAt: "2026-06-26",
    status: "pending-review",
    supportingDocs: [{ id: "DOC-01", name: "Steel-quote-Q3.pdf", size: "1.2 MB" }],
  },
  {
    id: "ADJ-2002", budgetId: "BUD-2404", project: "Phoenix HQ",
    kind: "decrease", originalAmount: 21_300_000, adjustmentAmount: -210_000, newAmount: 21_090_000,
    reason: "Glass scope reduction post-value engineering.",
    requestedBy: "R. Costa", requestedAt: "2026-06-20",
    approvedBy: "M. Suarez", approvedAt: "2026-06-21",
    status: "approved",
    supportingDocs: [{ id: "DOC-02", name: "VE-log-r3.xlsx", size: "410 KB" }],
  },
  {
    id: "ADJ-2003", budgetId: "BUD-2402", project: "Harborline Hub",
    kind: "increase", originalAmount: 5_600_000, adjustmentAmount: 95_000, newAmount: 5_695_000,
    reason: "HVAC commissioning extension covering 3 additional weeks.",
    requestedBy: "K. Adeyemi", requestedAt: "2026-06-28",
    status: "finance-review",
    supportingDocs: [],
  },
  {
    id: "ADJ-2004", budgetId: "BUD-2403", project: "Northgate Plaza",
    kind: "transfer", originalAmount: 8_900_000, adjustmentAmount: 0, newAmount: 8_900_000,
    transferFromId: "ALC-1008", transferToId: "ALC-1006",
    reason: "Reallocate $250K from contingency to accelerate site prep milestone 3.",
    requestedBy: "M. Tanaka", requestedAt: "2026-06-29",
    status: "manager-review",
    supportingDocs: [{ id: "DOC-03", name: "Milestone-3-plan.pdf", size: "830 KB" }],
  },
  {
    id: "ADJ-2005", budgetId: "BUD-2405", project: "Riverbend Bridge",
    kind: "emergency", originalAmount: 6_750_000, adjustmentAmount: 320_000, newAmount: 7_070_000,
    reason: "Emergency cabling replacement after inspection failure on span 4.",
    requestedBy: "J. Okafor", requestedAt: "2026-06-30",
    status: "approved",
    approvedBy: "Finance Committee", approvedAt: "2026-06-30",
    supportingDocs: [
      { id: "DOC-04", name: "Inspection-span4.pdf", size: "2.1 MB" },
      { id: "DOC-05", name: "Emergency-PO.pdf", size: "180 KB" },
    ],
  },
];

export const budgetHistoryExt: BudgetHistoryEntryExt[] = [
  { id: "BH-3001", budgetId: "BUD-2401", project: "Westgate Tower", action: "created", newValue: 12_400_000, actor: "L. Patel", at: "2026-01-12 09:20" },
  { id: "BH-3002", budgetId: "BUD-2401", project: "Westgate Tower", action: "approved", actor: "Finance Committee", at: "2026-01-18 15:40" },
  { id: "BH-3003", budgetId: "BUD-2401", project: "Westgate Tower", action: "adjusted", field: "planned", oldValue: 12_400_000, newValue: 12_710_000, reason: "Reallocated $310K contingency → civil", actor: "L. Patel", at: "2026-06-10 11:12" },
  { id: "BH-3004", budgetId: "BUD-2404", project: "Phoenix HQ", action: "adjusted", field: "planned", oldValue: 21_300_000, newValue: 21_090_000, reason: "ADJ-2002 approved", actor: "M. Suarez", at: "2026-06-21 10:04" },
  { id: "BH-3005", budgetId: "BUD-2403", project: "Northgate Plaza", action: "locked", actor: "M. Tanaka", at: "2026-06-15 17:30" },
  { id: "BH-3006", budgetId: "BUD-2402", project: "Harborline Hub", action: "updated", field: "owner", oldValue: "S. Iyer", newValue: "K. Adeyemi", actor: "HR Sync", at: "2026-05-04 08:10" },
  { id: "BH-3007", budgetId: "BUD-2405", project: "Riverbend Bridge", action: "adjusted", field: "planned", oldValue: 6_750_000, newValue: 7_070_000, reason: "ADJ-2005 emergency cabling", actor: "Finance Committee", at: "2026-06-30 14:22" },
  { id: "BH-3008", budgetId: "BUD-2401", project: "Westgate Tower", action: "transferred", oldValue: "Contingency", newValue: "Civil & Structural", reason: "$310K reallocation", actor: "L. Patel", at: "2026-06-10 11:20" },
];

export const budgetApprovalSteps: BudgetApprovalStep[] = [
  { id: "AS-01", budgetId: "BUD-2401", stage: "draft", approver: "L. Patel", role: "Project Manager", decision: "approve", decidedAt: "2026-01-12 09:22", documentIds: ["DOC-BUD-01"] },
  { id: "AS-02", budgetId: "BUD-2401", stage: "pending-review", approver: "S. Iyer", role: "PM Lead", decision: "approve", decidedAt: "2026-01-14 16:10", comments: "Scope aligned with tender.", documentIds: [] },
  { id: "AS-03", budgetId: "BUD-2401", stage: "finance-review", approver: "M. Suarez", role: "Finance Controller", decision: "approve", decidedAt: "2026-01-17 12:05", comments: "Cash position validated.", documentIds: [] },
  { id: "AS-04", budgetId: "BUD-2401", stage: "manager-review", approver: "R. Costa", role: "Ops Director", decision: "approve", decidedAt: "2026-01-18 14:50", documentIds: [] },
  { id: "AS-05", budgetId: "BUD-2401", stage: "approved", approver: "Finance Committee", role: "Committee", decision: "approve", decidedAt: "2026-01-18 15:40", documentIds: ["DOC-BUD-02"] },

  { id: "AS-06", budgetId: "BUD-2404", stage: "draft", approver: "R. Costa", role: "Project Manager", decision: "approve", decidedAt: "2026-06-27 09:10", documentIds: [] },
  { id: "AS-07", budgetId: "BUD-2404", stage: "pending-review", approver: "S. Iyer", role: "PM Lead", decision: "approve", decidedAt: "2026-06-27 15:22", documentIds: [] },
  { id: "AS-08", budgetId: "BUD-2404", stage: "finance-review", approver: "M. Suarez", role: "Finance Controller", documentIds: [] },
];

export const budgetComments: BudgetComment[] = [
  { id: "BC-01", budgetId: "BUD-2401", author: "L. Patel", at: "2026-06-24 09:12", body: "Contingency looks tight against upcoming steel commitments." },
  { id: "BC-02", budgetId: "BUD-2401", author: "M. Suarez", at: "2026-06-24 11:38", body: "Finance concurs. Requesting formal adjustment ADJ-2001." },
  { id: "BC-03", budgetId: "BUD-2404", author: "R. Costa", at: "2026-06-28 08:05", body: "Fit-out running lean; anticipate 92% utilization by month-end." },
];

export const budgetDocuments: BudgetDocument[] = [
  { id: "DOC-BUD-01", budgetId: "BUD-2401", name: "Westgate-tender-baseline.pdf", kind: "contract", size: "3.4 MB", uploadedBy: "L. Patel", uploadedAt: "2026-01-11" },
  { id: "DOC-BUD-02", budgetId: "BUD-2401", name: "Committee-approval.pdf", kind: "approval", size: "220 KB", uploadedBy: "Finance Committee", uploadedAt: "2026-01-18" },
  { id: "DOC-BUD-03", budgetId: "BUD-2404", name: "Phoenix-fitout-quote.xlsx", kind: "quote", size: "980 KB", uploadedBy: "Procurement", uploadedAt: "2026-06-19" },
];

export const budgetTransactions: BudgetTransaction[] = [
  { id: "TX-9001", budgetId: "BUD-2401", allocationId: "ALC-1001", date: "2026-06-22", vendor: "PrimeFab Steel", category: "Civil & Structural", description: "Steel — bundle 12", amount: 312_400, type: "actual" },
  { id: "TX-9002", budgetId: "BUD-2401", allocationId: "ALC-1001", date: "2026-06-24", vendor: "Cemex Supply", category: "Civil & Structural", description: "Concrete pours L18–20", amount: 184_200, type: "actual" },
  { id: "TX-9003", budgetId: "BUD-2404", allocationId: "ALC-1009", date: "2026-06-24", vendor: "Façade Systems", category: "Fit-out", description: "Curtain-wall phase 3", amount: 540_000, type: "commitment" },
  { id: "TX-9004", budgetId: "BUD-2403", allocationId: "ALC-1006", date: "2026-06-18", vendor: "Atlas Logistics", category: "Site Prep", description: "Earthworks haulage", amount: 88_200, type: "actual" },
  { id: "TX-9005", budgetId: "BUD-2405", allocationId: "ALC-1012", date: "2026-06-30", vendor: "PrimeFab Steel", category: "Steel & Cabling", description: "Emergency cable set", amount: 320_000, type: "commitment" },
];

export const budgetForecast: BudgetForecastPoint[] = [
  { budgetId: "BUD-2401", month: "Jan", planned: 1_000_000, actual: 940_000, forecast: 940_000 },
  { budgetId: "BUD-2401", month: "Feb", planned: 1_050_000, actual: 1_120_000, forecast: 1_120_000 },
  { budgetId: "BUD-2401", month: "Mar", planned: 1_100_000, actual: 1_180_000, forecast: 1_180_000 },
  { budgetId: "BUD-2401", month: "Apr", planned: 1_200_000, actual: 1_310_000, forecast: 1_310_000 },
  { budgetId: "BUD-2401", month: "May", planned: 1_280_000, actual: 1_400_000, forecast: 1_400_000 },
  { budgetId: "BUD-2401", month: "Jun", planned: 1_300_000, actual: 1_170_000, forecast: 1_170_000 },
  { budgetId: "BUD-2401", month: "Jul", planned: 1_320_000, actual: null, forecast: 1_420_000 },
  { budgetId: "BUD-2401", month: "Aug", planned: 1_300_000, actual: null, forecast: 1_460_000 },
  { budgetId: "BUD-2401", month: "Sep", planned: 1_250_000, actual: null, forecast: 1_390_000 },
  { budgetId: "BUD-2401", month: "Oct", planned: 1_150_000, actual: null, forecast: 1_260_000 },
  { budgetId: "BUD-2401", month: "Nov", planned: 950_000, actual: null, forecast: 1_040_000 },
  { budgetId: "BUD-2401", month: "Dec", planned: 500_000, actual: null, forecast: 610_000 },
];

// ---------- Derived helpers ----------

export function budgetApprovalOrder(): BudgetApprovalState[] {
  return ["draft", "pending-review", "finance-review", "manager-review", "approved"];
}

export function budgetApprovalLabel(s: BudgetApprovalState): string {
  return {
    "draft": "Draft",
    "pending-review": "Pending Review",
    "finance-review": "Finance Review",
    "manager-review": "Manager Review",
    "approved": "Approved",
    "rejected": "Rejected",
    "returned": "Returned",
    "cancelled": "Cancelled",
  }[s];
}

export interface BudgetAnalyticsSnapshot {
  allocated: number;
  consumed: number;
  remaining: number;
  forecast: number;
  variancePct: number;
  monthlyBurn: number;
  health: "healthy" | "watch" | "at-risk";
  efficiencyPct: number;
}

export function computeBudgetAnalytics(
  totals: { planned: number; committed: number; spent: number },
  forecast: BudgetForecastPoint[],
): BudgetAnalyticsSnapshot {
  const allocated = totals.planned;
  const consumed = totals.spent;
  const remaining = allocated - consumed;
  const forecastTotal = forecast.reduce((s, f) => s + f.forecast, 0);
  const variancePct = allocated === 0 ? 0 : (forecastTotal - allocated) / allocated;
  const actuals = forecast.filter((f) => f.actual !== null).map((f) => f.actual!);
  const monthlyBurn = actuals.length
    ? actuals.reduce((s, a) => s + a, 0) / actuals.length
    : 0;
  const utilization = allocated === 0 ? 0 : consumed / allocated;
  const health: BudgetAnalyticsSnapshot["health"] =
    utilization > 0.9 || variancePct > 0.05
      ? "at-risk"
      : utilization > 0.75
        ? "watch"
        : "healthy";
  const efficiencyPct = allocated === 0 ? 0 : totals.committed / allocated;
  return {
    allocated,
    consumed,
    remaining,
    forecast: forecastTotal,
    variancePct,
    monthlyBurn,
    health,
    efficiencyPct,
  };
}
