import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  Receipt,
  TrendingUp,
  AlertTriangle,
  PieChart,
  ClipboardList,
  FileBarChart2,
  Plus,
  Download,
  Sparkles,
} from "lucide-react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({
    meta: [
      { title: "Finance — EasyConstruct" },
      {
        name: "description",
        content: "Budgets, expenses, payroll review and financial forecasting workspace.",
      },
    ],
  }),
  component: FinancePage,
});

const budgets = [
  { project: "Westgate Tower", planned: 12_400_000, spent: 8_120_000 },
  { project: "Harborline Hub", planned: 5_600_000, spent: 4_980_000 },
  { project: "Northgate Plaza", planned: 8_900_000, spent: 3_140_000 },
  { project: "Phoenix HQ", planned: 21_300_000, spent: 17_950_000 },
];

const expenses = [
  { id: "EXP-1042", vendor: "Cemex Supply", category: "Materials", amount: 184_200, status: "Approved" },
  { id: "EXP-1043", vendor: "BuildRight Equip.", category: "Equipment", amount: 62_500, status: "Pending" },
  { id: "EXP-1044", vendor: "SafetyFirst Inc.", category: "PPE", amount: 18_900, status: "Approved" },
  { id: "EXP-1045", vendor: "Atlas Logistics", category: "Transport", amount: 24_300, status: "Review" },
];

function FinancePage() {
  return (
    <RoleWorkspacePage
      defaultSection="budgets"
      kpis={[
        { label: "Total budget", value: "$48.2M", delta: "Across 12 projects", icon: Wallet, up: true },
        { label: "Committed", value: "$34.2M", delta: "71% of total", icon: PieChart, up: true },
        { label: "Variance", value: "+2.4%", delta: "Within tolerance", icon: TrendingUp, up: true },
        { label: "Pending invoices", value: "37", delta: "$2.1M open", icon: Receipt, up: false },
        { label: "Payroll cycle", value: "73%", delta: "Cut-off in 2d", icon: ClipboardList, up: true },
        { label: "Cost alerts", value: "5", delta: "2 critical", icon: AlertTriangle, up: false },
      ]}
      aiInsights={[
        {
          title: "Cost overrun forecast",
          body: "Westgate Tower projected to exceed budget by 4.8% by Q4 unless steel orders are renegotiated.",
        },
        {
          title: "Vendor consolidation",
          body: "Merging PPE orders from 3 vendors could save ~$48K/quarter without affecting lead times.",
        },
        {
          title: "Payroll anomaly",
          body: "Overtime in Field Ops is 18% above 90-day baseline — review timesheets B-118 to B-121.",
        },
      ]}
      quickActions={[
        { label: "Record expense", icon: Receipt, description: "Log a new vendor or material expense" },
        { label: "Approve invoices", icon: ClipboardList, description: "12 invoices awaiting your sign-off" },
        { label: "Export financials", icon: Download, description: "Generate monthly P&L snapshot" },
        { label: "Create forecast", icon: Sparkles, description: "AI-assisted 90-day cash forecast" },
      ]}
      sections={[
        {
          id: "budgets",
          title: "Project budgets",
          subtitle: "Planned vs committed spend across active projects",
          content: (
            <div className="space-y-4">
              {budgets.map((b) => {
                const pct = Math.round((b.spent / b.planned) * 100);
                const tone =
                  pct >= 95 ? "text-destructive" : pct >= 80 ? "text-warning" : "text-success";
                return (
                  <div key={b.project}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{b.project}</span>
                      <span className={tone}>
                        ${(b.spent / 1_000_000).toFixed(2)}M / ${(b.planned / 1_000_000).toFixed(2)}M
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1.5 h-2" />
                    <div className="mt-1 text-[11px] text-muted-foreground">{pct}% utilised</div>
                  </div>
                );
              })}
            </div>
          ),
        },
        {
          id: "expenses",
          title: "Expense ledger",
          subtitle: "Recent vendor expenses and reimbursements",
          content: (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.id}</TableCell>
                    <TableCell className="text-sm">{e.vendor}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.category}</TableCell>
                    <TableCell className="text-right text-sm">
                      ${e.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] ${
                          e.status === "Approved"
                            ? "border-success/30 text-success"
                            : e.status === "Pending"
                            ? "border-warning/30 text-warning"
                            : "border-destructive/30 text-destructive"
                        }`}
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ),
        },
        {
          id: "payroll",
          title: "Payroll review",
          subtitle: "Validate HR-submitted payroll batches before disbursement",
          content: (
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Batch B-118 · Field Ops</span>
                  <Badge className="rounded-full bg-warning/15 text-warning">Pending review</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  234 employees · gross $1.42M · variance +3.1% vs prior period
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Batch B-117 · Site Supervisors</span>
                  <Badge className="rounded-full bg-success/15 text-success">Approved</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  46 employees · gross $312K · disbursed 14 Jun
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "reports",
          title: "Financial reports",
          subtitle: "Monthly statements and analytical dashboards",
          content: (
            <div className="grid gap-3 sm:grid-cols-2">
              {["P&L · June", "Cash flow · Q2", "Vendor aging", "Cost per sqft"].map((r) => (
                <div key={r} className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <FileBarChart2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{r}</span>
                  </div>
                  <button className="text-xs text-primary">Open</button>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "forecast",
          title: "Forecasting",
          subtitle: "AI-assisted projections for cash, cost and labor",
          content: (
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                90-day cash forecast updated 2 hours ago using current commitments, vendor schedules
                and labor pipelines.
              </p>
              <div className="rounded-xl border bg-muted/30 p-4 font-mono text-xs">
                Jul ▏ +$2.1M ▏ Aug ▏ -$0.4M ▏ Sep ▏ +$1.6M
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
