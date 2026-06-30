export type ApprovalStatus = "approved" | "pending" | "rejected" | "review";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Budget {
  id: string;
  project: string;
  category: string;
  planned: number;
  committed: number;
  spent: number;
  fiscalYear: string;
  owner: string;
  status: ApprovalStatus;
  updatedAt: string;
}

export interface BudgetAdjustment {
  id: string;
  budgetId: string;
  project: string;
  delta: number;
  reason: string;
  requestedBy: string;
  status: ApprovalStatus;
  requestedAt: string;
}

export interface BudgetHistoryEntry {
  id: string;
  project: string;
  action: string;
  amount: number;
  actor: string;
  at: string;
}

export interface ExpenseRecord {
  id: string;
  vendor: string;
  project: string;
  category: "Materials" | "Equipment" | "Labor" | "PPE" | "Transport" | "Services" | "Other";
  amount: number;
  status: ApprovalStatus;
  submittedBy: string;
  submittedAt: string;
  receiptUrl?: string;
  anomalyScore?: number;
}

export interface PurchaseRequest {
  id: string;
  title: string;
  project: string;
  requestedBy: string;
  amount: number;
  status: ApprovalStatus;
  requestedAt: string;
}

export interface Reimbursement {
  id: string;
  employee: string;
  purpose: string;
  amount: number;
  status: ApprovalStatus;
  submittedAt: string;
}

export interface ProcurementOrder {
  id: string;
  vendor: string;
  project: string;
  items: number;
  amount: number;
  eta: string;
  status: "Draft" | "Issued" | "In transit" | "Delivered";
}

export interface PayrollBatch {
  id: string;
  period: string;
  group: string;
  headcount: number;
  gross: number;
  net: number;
  deductions: number;
  variance: number;
  status: ApprovalStatus;
  submittedBy: string;
  submittedAt: string;
}

export interface Invoice {
  id: string;
  vendor: string;
  project: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Overdue" | "Open" | "Disputed";
}

export interface CashFlowPoint {
  month: string;
  inflow: number;
  outflow: number;
}

export interface ProjectProfit {
  project: string;
  revenue: number;
  cost: number;
  margin: number;
}

export interface FinancialRisk {
  id: string;
  title: string;
  project: string;
  level: RiskLevel;
  impact: string;
  detectedAt: string;
}

export interface FinanceApproval {
  id: string;
  kind: "Budget" | "Payroll" | "Expense" | "Purchase" | "Reimbursement";
  reference: string;
  amount: number;
  requestedBy: string;
  requestedAt: string;
  slaHours: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  ip: string;
}

export interface FinanceNotification {
  id: string;
  title: string;
  body: string;
  tone: "info" | "warning" | "critical" | "success";
  at: string;
  read: boolean;
}

export interface AiFinanceInsight {
  id: string;
  title: string;
  category: "Forecast" | "Cost" | "Risk" | "Trend" | "Anomaly";
  confidence: number;
  body: string;
  impact: string;
  actions: string[];
  metrics: { label: string; value: string }[];
}

// ---------- Mock fixtures ----------

export const budgets: Budget[] = [
  { id: "BUD-2401", project: "Westgate Tower", category: "Civil & Structural", planned: 12_400_000, committed: 9_800_000, spent: 8_120_000, fiscalYear: "FY2026", owner: "L. Patel", status: "approved", updatedAt: "2026-06-22" },
  { id: "BUD-2402", project: "Harborline Hub", category: "MEP", planned: 5_600_000, committed: 5_200_000, spent: 4_980_000, fiscalYear: "FY2026", owner: "K. Adeyemi", status: "review", updatedAt: "2026-06-25" },
  { id: "BUD-2403", project: "Northgate Plaza", category: "Site Prep", planned: 8_900_000, committed: 3_900_000, spent: 3_140_000, fiscalYear: "FY2026", owner: "M. Tanaka", status: "approved", updatedAt: "2026-06-18" },
  { id: "BUD-2404", project: "Phoenix HQ", category: "Fit-out", planned: 21_300_000, committed: 19_400_000, spent: 17_950_000, fiscalYear: "FY2026", owner: "R. Costa", status: "pending", updatedAt: "2026-06-28" },
  { id: "BUD-2405", project: "Riverbend Bridge", category: "Steel & Cabling", planned: 6_750_000, committed: 4_120_000, spent: 3_010_000, fiscalYear: "FY2026", owner: "J. Okafor", status: "approved", updatedAt: "2026-06-12" },
];

export const budgetAdjustments: BudgetAdjustment[] = [
  { id: "ADJ-118", budgetId: "BUD-2401", project: "Westgate Tower", delta: 480_000, reason: "Steel re-tender variance", requestedBy: "L. Patel", status: "pending", requestedAt: "2026-06-26" },
  { id: "ADJ-119", budgetId: "BUD-2404", project: "Phoenix HQ", delta: -210_000, reason: "Glass scope reduction", requestedBy: "R. Costa", status: "approved", requestedAt: "2026-06-20" },
  { id: "ADJ-120", budgetId: "BUD-2402", project: "Harborline Hub", delta: 95_000, reason: "HVAC commissioning extension", requestedBy: "K. Adeyemi", status: "review", requestedAt: "2026-06-28" },
];

export const budgetHistory: BudgetHistoryEntry[] = [
  { id: "H-001", project: "Westgate Tower", action: "Reallocated $310K from contingency to civil", amount: 310_000, actor: "L. Patel", at: "2026-06-10" },
  { id: "H-002", project: "Phoenix HQ", action: "Approved adjustment ADJ-119", amount: -210_000, actor: "Finance Committee", at: "2026-06-20" },
  { id: "H-003", project: "Northgate Plaza", action: "Locked Q2 baseline", amount: 0, actor: "M. Tanaka", at: "2026-06-15" },
];

export const expenses: ExpenseRecord[] = [
  { id: "EXP-1042", vendor: "Cemex Supply", project: "Westgate Tower", category: "Materials", amount: 184_200, status: "approved", submittedBy: "Site Ops", submittedAt: "2026-06-24", anomalyScore: 0.12 },
  { id: "EXP-1043", vendor: "BuildRight Equip.", project: "Phoenix HQ", category: "Equipment", amount: 62_500, status: "pending", submittedBy: "Procurement", submittedAt: "2026-06-26", anomalyScore: 0.41 },
  { id: "EXP-1044", vendor: "SafetyFirst Inc.", project: "Harborline Hub", category: "PPE", amount: 18_900, status: "approved", submittedBy: "EHS", submittedAt: "2026-06-25" },
  { id: "EXP-1045", vendor: "Atlas Logistics", project: "Riverbend Bridge", category: "Transport", amount: 24_300, status: "review", submittedBy: "Logistics", submittedAt: "2026-06-28", anomalyScore: 0.78 },
  { id: "EXP-1046", vendor: "PrimeFab Steel", project: "Westgate Tower", category: "Materials", amount: 312_400, status: "approved", submittedBy: "Procurement", submittedAt: "2026-06-22" },
  { id: "EXP-1047", vendor: "GreenLite Solar", project: "Northgate Plaza", category: "Services", amount: 47_600, status: "pending", submittedBy: "MEP", submittedAt: "2026-06-29" },
];

export const purchaseRequests: PurchaseRequest[] = [
  { id: "PR-882", title: "Tower crane spares — 90 day kit", project: "Westgate Tower", requestedBy: "Site Ops", amount: 42_300, status: "pending", requestedAt: "2026-06-27" },
  { id: "PR-883", title: "Solar inverter banks (8)", project: "Northgate Plaza", requestedBy: "MEP", amount: 118_000, status: "review", requestedAt: "2026-06-28" },
  { id: "PR-884", title: "Façade glass — Phase 3", project: "Phoenix HQ", requestedBy: "Fit-out", amount: 540_000, status: "approved", requestedAt: "2026-06-24" },
];

export const reimbursements: Reimbursement[] = [
  { id: "RB-211", employee: "A. Mensah", purpose: "Vendor visit — Hamburg", amount: 1_840, status: "pending", submittedAt: "2026-06-27" },
  { id: "RB-212", employee: "S. Iyer", purpose: "Site mobilization fuel", amount: 412, status: "approved", submittedAt: "2026-06-25" },
  { id: "RB-213", employee: "D. Romero", purpose: "Safety conference", amount: 2_650, status: "review", submittedAt: "2026-06-28" },
];

export const procurement: ProcurementOrder[] = [
  { id: "PO-7741", vendor: "PrimeFab Steel", project: "Westgate Tower", items: 18, amount: 482_000, eta: "2026-07-12", status: "In transit" },
  { id: "PO-7742", vendor: "Cemex Supply", project: "Phoenix HQ", items: 42, amount: 124_500, eta: "2026-07-04", status: "Issued" },
  { id: "PO-7743", vendor: "Atlas Logistics", project: "Riverbend Bridge", items: 6, amount: 88_200, eta: "2026-07-09", status: "Draft" },
];

export const payrollBatches: PayrollBatch[] = [
  { id: "PRB-118", period: "Jun 16–30, 2026", group: "Field Ops", headcount: 234, gross: 1_420_000, net: 1_104_000, deductions: 316_000, variance: 0.031, status: "pending", submittedBy: "HR · J. Okafor", submittedAt: "2026-06-29" },
  { id: "PRB-119", period: "Jun 16–30, 2026", group: "Supervisors", headcount: 46, gross: 312_000, net: 248_000, deductions: 64_000, variance: 0.012, status: "review", submittedBy: "HR · J. Okafor", submittedAt: "2026-06-29" },
  { id: "PRB-117", period: "Jun 1–15, 2026", group: "Field Ops", headcount: 228, gross: 1_372_000, net: 1_064_000, deductions: 308_000, variance: 0.008, status: "approved", submittedBy: "HR · J. Okafor", submittedAt: "2026-06-15" },
  { id: "PRB-116", period: "Jun 1–15, 2026", group: "Supervisors", headcount: 46, gross: 308_000, net: 244_000, deductions: 64_000, variance: 0.004, status: "approved", submittedBy: "HR · J. Okafor", submittedAt: "2026-06-15" },
];

export const invoices: Invoice[] = [
  { id: "INV-9082", vendor: "PrimeFab Steel", project: "Westgate Tower", amount: 482_000, dueDate: "2026-07-05", status: "Open" },
  { id: "INV-9083", vendor: "Atlas Logistics", project: "Riverbend Bridge", amount: 88_200, dueDate: "2026-06-22", status: "Overdue" },
  { id: "INV-9084", vendor: "GreenLite Solar", project: "Northgate Plaza", amount: 47_600, dueDate: "2026-07-12", status: "Open" },
  { id: "INV-9081", vendor: "Cemex Supply", project: "Phoenix HQ", amount: 124_500, dueDate: "2026-06-18", status: "Paid" },
  { id: "INV-9080", vendor: "SafetyFirst Inc.", project: "Harborline Hub", amount: 18_900, dueDate: "2026-06-30", status: "Disputed" },
];

export const cashFlow: CashFlowPoint[] = [
  { month: "Jan", inflow: 3.2, outflow: 2.4 },
  { month: "Feb", inflow: 2.9, outflow: 2.8 },
  { month: "Mar", inflow: 3.6, outflow: 3.1 },
  { month: "Apr", inflow: 4.1, outflow: 3.4 },
  { month: "May", inflow: 3.8, outflow: 3.9 },
  { month: "Jun", inflow: 4.4, outflow: 3.6 },
];

export const projectProfit: ProjectProfit[] = [
  { project: "Westgate Tower", revenue: 14_200_000, cost: 11_900_000, margin: 0.162 },
  { project: "Harborline Hub", revenue: 6_400_000, cost: 5_700_000, margin: 0.109 },
  { project: "Northgate Plaza", revenue: 10_200_000, cost: 8_100_000, margin: 0.206 },
  { project: "Phoenix HQ", revenue: 24_000_000, cost: 21_300_000, margin: 0.112 },
  { project: "Riverbend Bridge", revenue: 7_400_000, cost: 5_900_000, margin: 0.203 },
];

export const financialRisks: FinancialRisk[] = [
  { id: "FR-01", title: "Steel commodity spike", project: "Westgate Tower", level: "high", impact: "+4.8% projected overrun", detectedAt: "2026-06-26" },
  { id: "FR-02", title: "Vendor concentration", project: "Phoenix HQ", level: "medium", impact: "62% of fit-out spend with 1 vendor", detectedAt: "2026-06-22" },
  { id: "FR-03", title: "Cash shortfall risk", project: "Portfolio", level: "critical", impact: "Aug projected -$0.4M", detectedAt: "2026-06-29" },
  { id: "FR-04", title: "Overtime drift", project: "Field Ops", level: "medium", impact: "OT 18% above baseline", detectedAt: "2026-06-28" },
];

export const approvalsQueue: FinanceApproval[] = [
  { id: "AP-501", kind: "Payroll", reference: "PRB-118 · Field Ops", amount: 1_420_000, requestedBy: "HR · J. Okafor", requestedAt: "2026-06-29", slaHours: 18 },
  { id: "AP-502", kind: "Budget", reference: "ADJ-118 · Westgate Tower", amount: 480_000, requestedBy: "L. Patel", requestedAt: "2026-06-26", slaHours: 36 },
  { id: "AP-503", kind: "Purchase", reference: "PR-883 · Solar inverters", amount: 118_000, requestedBy: "MEP", requestedAt: "2026-06-28", slaHours: 24 },
  { id: "AP-504", kind: "Expense", reference: "EXP-1045 · Atlas Logistics", amount: 24_300, requestedBy: "Logistics", requestedAt: "2026-06-28", slaHours: 12 },
  { id: "AP-505", kind: "Reimbursement", reference: "RB-213 · Safety conference", amount: 2_650, requestedBy: "D. Romero", requestedAt: "2026-06-28", slaHours: 48 },
];

export const auditEvents: AuditEvent[] = [
  { id: "AU-9001", actor: "M. Suarez (Finance)", action: "Approved", target: "PRB-117 payroll batch", at: "2026-06-15 14:22", ip: "10.0.4.18" },
  { id: "AU-9002", actor: "L. Patel (PM)", action: "Submitted", target: "Budget adjustment ADJ-118", at: "2026-06-26 09:11", ip: "10.0.4.66" },
  { id: "AU-9003", actor: "M. Suarez (Finance)", action: "Rejected", target: "EXP-1042 supplementary fee", at: "2026-06-24 16:05", ip: "10.0.4.18" },
  { id: "AU-9004", actor: "System (AI)", action: "Flagged anomaly", target: "EXP-1045 — score 0.78", at: "2026-06-28 03:42", ip: "ai.gateway" },
  { id: "AU-9005", actor: "R. Costa (PM)", action: "Locked", target: "Phoenix HQ Q2 baseline", at: "2026-06-20 10:00", ip: "10.0.4.71" },
];

export const notifications: FinanceNotification[] = [
  { id: "N-101", title: "Payroll batch PRB-118 awaiting approval", body: "234 employees · gross $1.42M · variance +3.1%.", tone: "warning", at: "2 hours ago", read: false },
  { id: "N-102", title: "Invoice INV-9083 overdue", body: "Atlas Logistics · $88,200 · 8 days past due.", tone: "critical", at: "5 hours ago", read: false },
  { id: "N-103", title: "Westgate Tower budget approaching ceiling", body: "92% of approved budget committed.", tone: "warning", at: "1 day ago", read: false },
  { id: "N-104", title: "AI flagged EXP-1045 as anomalous", body: "Atlas Logistics expense scored 0.78 vs vendor baseline 0.21.", tone: "warning", at: "1 day ago", read: true },
  { id: "N-105", title: "Reimbursement RB-212 approved", body: "S. Iyer · $412 disbursed to payroll cycle.", tone: "success", at: "2 days ago", read: true },
];

export const aiInsights: AiFinanceInsight[] = [
  {
    id: "AI-F-01",
    title: "Westgate Tower forecast overrun",
    category: "Forecast",
    confidence: 0.86,
    body: "Steel commitments and re-tender volatility put Westgate on a +4.8% trajectory by Q4 against the approved baseline.",
    impact: "+$595K projected overrun",
    actions: ["Re-tender steel package with 2 vendors", "Trim contingency by 1.5%", "Lock concrete index now"],
    metrics: [
      { label: "Confidence", value: "86%" },
      { label: "Horizon", value: "90 days" },
      { label: "Baseline drift", value: "+4.8%" },
    ],
  },
  {
    id: "AI-F-02",
    title: "August cash shortfall",
    category: "Risk",
    confidence: 0.74,
    body: "Forecast inflows lag committed vendor disbursements in August by approximately $0.4M.",
    impact: "Liquidity risk · medium-high",
    actions: ["Stage Atlas Logistics payment to Sep", "Pull forward Phoenix HQ draw 3", "Negotiate net-45 with PrimeFab"],
    metrics: [
      { label: "Confidence", value: "74%" },
      { label: "Shortfall", value: "$0.4M" },
      { label: "Window", value: "Aug 8–22" },
    ],
  },
  {
    id: "AI-F-03",
    title: "Vendor consolidation opportunity",
    category: "Cost",
    confidence: 0.91,
    body: "Merging PPE purchases from 3 vendors into a single framework saves ~$48K/quarter without lead-time impact.",
    impact: "−$192K annualized",
    actions: ["Issue framework RFP to top 2 PPE vendors", "Sunset legacy vendor agreements"],
    metrics: [
      { label: "Confidence", value: "91%" },
      { label: "Savings", value: "$48K / qtr" },
      { label: "Lead time impact", value: "0 days" },
    ],
  },
  {
    id: "AI-F-04",
    title: "Anomalous Atlas Logistics expense",
    category: "Anomaly",
    confidence: 0.78,
    body: "EXP-1045 is 3.6× the rolling vendor median for this corridor; receipt OCR mismatch detected.",
    impact: "Possible duplicate or fraud",
    actions: ["Send back to Logistics for evidence", "Cross-check PO-7743 against delivery note"],
    metrics: [
      { label: "Score", value: "0.78" },
      { label: "Vendor median", value: "$6.8K" },
      { label: "This expense", value: "$24.3K" },
    ],
  },
  {
    id: "AI-F-05",
    title: "Field Ops overtime drift",
    category: "Trend",
    confidence: 0.69,
    body: "Overtime hours in Field Ops are 18% above the 90-day baseline driven by Westgate and Phoenix sites.",
    impact: "+$71K projected payroll uplift",
    actions: ["Review crew rotations on Westgate evenings", "Add 6-person night shift on Phoenix"],
    metrics: [
      { label: "OT vs baseline", value: "+18%" },
      { label: "Confidence", value: "69%" },
      { label: "Sites", value: "Westgate, Phoenix" },
    ],
  },
];

// ---------- Aggregations ----------

export interface FinanceKpiSnapshot {
  totalBudget: number;
  utilizationPct: number;
  remainingBudget: number;
  monthlyExpenses: number;
  pendingPayrollReviews: number;
  outstandingInvoices: number;
  cashFlowNet: number;
  profitMargin: number;
}

export function computeKpiSnapshot(): FinanceKpiSnapshot {
  const totalBudget = budgets.reduce((s, b) => s + b.planned, 0);
  const spent = budgets.reduce((s, b) => s + b.spent, 0);
  const utilizationPct = spent / totalBudget;
  const remainingBudget = totalBudget - spent;
  const monthlyExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingPayrollReviews = payrollBatches.filter((p) => p.status !== "approved").length;
  const outstandingInvoices = invoices
    .filter((i) => i.status === "Open" || i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);
  const last = cashFlow[cashFlow.length - 1];
  const cashFlowNet = (last.inflow - last.outflow) * 1_000_000;
  const totalRevenue = projectProfit.reduce((s, p) => s + p.revenue, 0);
  const totalCost = projectProfit.reduce((s, p) => s + p.cost, 0);
  const profitMargin = (totalRevenue - totalCost) / totalRevenue;
  return {
    totalBudget,
    utilizationPct,
    remainingBudget,
    monthlyExpenses,
    pendingPayrollReviews,
    outstandingInvoices,
    cashFlowNet,
    profitMargin,
  };
}
