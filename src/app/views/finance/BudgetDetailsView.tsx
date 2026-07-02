import { useBudgetDetailsController } from "@/app/controllers/finance/useBudgetDetailsController";
import {
  FinancePageHeader,
  FinanceSection,
  FinanceKpiStrip,
  StatusBadge,
} from "@/components/finance/finance-shell";
import {
  ApprovalStepper,
  ApprovalTimeline,
  BudgetProgressBar,
  CurrencyDisplay,
  HistoryTimeline,
  VarianceIndicator,
} from "@/components/finance/budget-primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Sparkles, FileText, Activity, TrendingUp, Layers, GitBranch } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmtM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`;

export function BudgetDetailsView({ budgetId }: { budgetId: string }) {
  const c = useBudgetDetailsController(budgetId);
  if (!c.budget) {
    return (
      <div className="p-8 text-sm text-muted-foreground">Loading budget {budgetId}…</div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title={`${c.budget.project} · ${c.budget.id}`}
        description={`${c.budget.category} · Owner ${c.budget.owner} · FY ${c.budget.fiscalYear}`}
        icon={Wallet}
        breadcrumbs={[
          { label: "Budget Management" },
          { label: "Details" },
          { label: c.budget.id },
        ]}
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "Planned", value: fmtM(c.budget.planned), icon: Wallet },
            { label: "Committed", value: fmtM(c.budget.committed), icon: GitBranch, tone: "warn" },
            { label: "Spent", value: fmtM(c.budget.spent), icon: TrendingUp, tone: "warn" },
            {
              label: "Remaining",
              value: fmtM(c.budget.planned - c.budget.spent),
              icon: Layers,
              tone: "good",
            },
            {
              label: "Forecast",
              value: c.analytics ? fmtM(c.analytics.forecast) : "—",
              icon: Activity,
              tone: c.analytics && c.analytics.forecast > c.budget.planned ? "bad" : "default",
            },
            {
              label: "Health",
              value: c.analytics?.health ?? "—",
              icon: Sparkles,
              tone:
                c.analytics?.health === "at-risk"
                  ? "bad"
                  : c.analytics?.health === "watch"
                    ? "warn"
                    : "good",
            },
          ]}
        />
      </div>

      <div className="px-4 md:px-6">
        <Tabs defaultValue="summary">
          <TabsList className="rounded-xl">
            <TabsTrigger value="summary" className="rounded-lg">Summary</TabsTrigger>
            <TabsTrigger value="allocations" className="rounded-lg">Allocations</TabsTrigger>
            <TabsTrigger value="adjustments" className="rounded-lg">Adjustments</TabsTrigger>
            <TabsTrigger value="expenses" className="rounded-lg">Linked expenses</TabsTrigger>
            <TabsTrigger value="approval" className="rounded-lg">Approval</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-lg">Documents</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg">AI insights</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <FinanceSection title="Utilization" className="lg:col-span-2">
                <BudgetProgressBar
                  planned={c.budget.planned}
                  committed={c.budget.committed}
                  spent={c.budget.spent}
                />
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={c.forecast}>
                      <defs>
                        <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                      />
                      <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Area dataKey="planned" name="Planned" stroke="#0ea5e9" fill="url(#pl)" />
                      <Area dataKey="actual" name="Actual" stroke="#10b981" fill="url(#ac)" />
                      <Line dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeDasharray="4 4" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </FinanceSection>

              <FinanceSection title="Financial metrics">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Variance</span>
                    {c.analytics && <VarianceIndicator value={c.analytics.variancePct} invert />}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly burn</span>
                    <CurrencyDisplay value={c.analytics?.monthlyBurn ?? 0} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span>{Math.round((c.analytics?.efficiencyPct ?? 0) * 100)}%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Allocations</span>
                    <span>{c.allocations.length}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Adjustments</span>
                    <span>{c.adjustments.length}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Commitments</span>
                    <span>{c.commitments.length}</span>
                  </li>
                </ul>
              </FinanceSection>
            </div>

            <FinanceSection title="Comments">
              {c.comments.length ? (
                <ul className="space-y-2">
                  {c.comments.map((cm) => (
                    <li key={cm.id} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{cm.author}</span>
                        <span>{cm.at}</span>
                      </div>
                      <p className="mt-1 text-sm">{cm.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground">No comments yet.</div>
              )}
            </FinanceSection>
          </TabsContent>

          <TabsContent value="allocations" className="mt-4">
            <FinanceSection title="Allocations" subtitle={`${c.allocations.length} entries`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.allocations.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="text-sm">{a.department}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.category}</TableCell>
                      <TableCell className="text-right text-sm"><CurrencyDisplay value={a.amount} /></TableCell>
                      <TableCell className="text-right text-sm"><CurrencyDisplay value={a.consumed} /></TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="adjustments" className="mt-4">
            <FinanceSection title="Adjustments">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead className="text-right">Delta</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.adjustments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="text-xs capitalize">{a.kind}</TableCell>
                      <TableCell className={`text-right text-sm ${a.adjustmentAmount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                        {a.adjustmentAmount > 0 ? "+" : ""}<CurrencyDisplay value={a.adjustmentAmount} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.reason}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.requestedAt} · {a.requestedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="expenses" className="mt-4">
            <FinanceSection title="Linked transactions">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.tx.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="text-xs">{t.date}</TableCell>
                      <TableCell className="text-sm">{t.vendor}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm"><CurrencyDisplay value={t.amount} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="approval" className="mt-4 space-y-4">
            <FinanceSection title="Approval pipeline">
              <ApprovalStepper
                current={c.steps.find((s) => !s.decision)?.stage ?? (c.steps.at(-1)?.stage ?? "approved")}
                steps={c.steps}
              />
            </FinanceSection>
            <FinanceSection title="Decisions">
              <ApprovalTimeline steps={c.steps} />
            </FinanceSection>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <FinanceSection title="Change history">
              <HistoryTimeline
                items={c.history.map((h) => ({
                  id: h.id,
                  title: `${h.action}${h.field ? ` · ${h.field}` : ""}`,
                  meta: h.reason,
                  actor: h.actor,
                  at: h.at,
                  amount: typeof h.newValue === "number" && typeof h.oldValue === "number"
                    ? h.newValue - h.oldValue
                    : undefined,
                  tone: h.action === "rejected" ? "bad" : h.action === "approved" ? "good" : "neutral",
                }))}
              />
            </FinanceSection>
          </TabsContent>

          <TabsContent value="docs" className="mt-4">
            <FinanceSection title="Documents">
              {c.docs.length ? (
                <ul className="grid gap-2 md:grid-cols-2">
                  {c.docs.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {d.kind} · {d.size} · {d.uploadedBy} · {d.uploadedAt}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground">No documents attached.</div>
              )}
            </FinanceSection>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <FinanceSection title="AI insights" subtitle="Forecast, risk, and cost intelligence">
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-transparent to-transparent p-4 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Forecast trajectory</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on 6 months of actuals, this budget is trending {c.analytics ? `${(c.analytics.variancePct * 100).toFixed(1)}%` : "—"} vs plan.
                  Recommended action: re-baseline contingency and lock commodity indices before Q3.
                </p>
              </div>
            </FinanceSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
