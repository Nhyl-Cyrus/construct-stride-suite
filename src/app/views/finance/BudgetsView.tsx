import { useState } from "react";
import { useBudgetsController } from "@/app/controllers/finance/useBudgetsController";
import {
  FinancePageHeader,
  FinanceSection,
  FinanceKpiStrip,
  StatusBadge,
} from "@/components/finance/finance-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  Search,
  Plus,
  GitBranch,
  PieChart as PieIcon,
  BookOpen,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { formatUSD } from "@/app/utils/currency";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmtM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`;
const colors = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#f43f5e"];

export function BudgetsView({ tab = "overview" }: { tab?: string }) {
  const c = useBudgetsController();
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Management"
        description="Manage project budgets, allocations, adjustments, and historical baselines across the portfolio."
        icon={Wallet}
        breadcrumbs={[{ label: "Budget Management" }]}
        actions={
          <Button size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            Create budget
          </Button>
        }
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "Total planned", value: fmtM(c.totals.planned), icon: Wallet },
            { label: "Committed", value: fmtM(c.totals.committed), icon: GitBranch },
            { label: "Spent", value: fmtM(c.totals.spent), icon: TrendingUp, tone: "warn" },
            { label: "Remaining", value: fmtM(c.totals.remaining), icon: Banknote, tone: "good" },
          ]}
        />
      </div>

      <div className="px-4 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="allocation" className="rounded-lg">Allocation</TabsTrigger>
            <TabsTrigger value="adjustments" className="rounded-lg">Adjustments</TabsTrigger>
            <TabsTrigger value="comparison" className="rounded-lg">Comparison</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
            <TabsTrigger value="approval" className="rounded-lg">Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <FinanceSection
              title="Project budgets"
              subtitle="Planned vs committed vs spent"
              actions={
                <>
                  <div className="relative w-48">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={c.query}
                      onChange={(e) => c.setQuery(e.target.value)}
                      placeholder="Search project, owner…"
                      className="h-8 rounded-lg pl-8 text-xs"
                    />
                  </div>
                  <Select value={c.fy} onValueChange={c.setFy}>
                    <SelectTrigger className="h-8 w-28 rounded-lg text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All FY</SelectItem>
                      <SelectItem value="FY2026">FY2026</SelectItem>
                      <SelectItem value="FY2025">FY2025</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Planned</TableHead>
                    <TableHead className="text-right">Committed</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="w-40">Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.budgets.map((b) => {
                    const pct = Math.round((b.spent / b.planned) * 100);
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell className="text-sm font-medium">{b.project}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.category}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{b.owner}</TableCell>
                        <TableCell className="text-right text-sm">{fmtM(b.planned)}</TableCell>
                        <TableCell className="text-right text-sm">{fmtM(b.committed)}</TableCell>
                        <TableCell className="text-right text-sm">{fmtM(b.spent)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={pct} className="h-1.5" />
                            <div className="text-[10px] text-muted-foreground">{pct}% used</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={b.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="allocation" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <FinanceSection title="Allocation by project" subtitle="Planned distribution">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={c.budgets.map((b) => ({ name: b.project, value: b.planned }))}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {c.budgets.map((_, i) => (
                          <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </FinanceSection>
              <FinanceSection title="Allocation by category">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={c.budgets.map((b) => ({ name: b.category, value: b.planned }))}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                      <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FinanceSection>
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="mt-4">
            <FinanceSection title="Budget adjustments" subtitle="Requests for re-baselining" icon-tone="warn">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Delta</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.adjustments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="font-mono text-xs">{a.budgetId}</TableCell>
                      <TableCell className="text-sm">{a.project}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.reason}</TableCell>
                      <TableCell className={`text-right text-sm font-medium ${a.delta >= 0 ? "text-rose-500" : "text-emerald-500"}`}>
                        {a.delta >= 0 ? "+" : ""}{formatUSD(a.delta)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.requestedAt} · {a.requestedBy}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <FinanceSection title="Planned vs spent" subtitle="Variance across active budgets">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={c.budgets.map((b) => ({ name: b.project, Planned: b.planned, Spent: b.spent, Committed: b.committed }))}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                    <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                    <Bar dataKey="Planned" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Committed" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <FinanceSection title="Budget history" subtitle="Lock-ins, reallocations and approvals">
              <ol className="space-y-3">
                {c.history.map((h) => (
                  <li key={h.id} className="flex gap-3 rounded-xl border p-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{h.project}</div>
                      <p className="text-xs text-muted-foreground">{h.action}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{h.actor}</span>
                        <span>·</span>
                        <span>{h.at}</span>
                        {h.amount !== 0 && <span className={h.amount > 0 ? "text-emerald-500" : "text-rose-500"}>{h.amount > 0 ? "+" : ""}{formatUSD(h.amount)}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="approval" className="mt-4">
            <FinanceSection title="Budget approval workflow" subtitle="Stages required before lock-in">
              <ol className="grid gap-3 md:grid-cols-4">
                {["Draft", "PM Review", "Finance Review", "Approved"].map((step, i) => (
                  <li key={step} className="rounded-xl border p-3">
                    <div className="text-[10px] uppercase text-muted-foreground">Step {i + 1}</div>
                    <div className="text-sm font-semibold">{step}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {i === 0 && "PM drafts budget against scope."}
                      {i === 1 && "PM lead validates scope coverage."}
                      {i === 2 && "Finance validates feasibility & cash."}
                      {i === 3 && "Locked baseline; adjustments require ADJ."}
                    </div>
                  </li>
                ))}
              </ol>
            </FinanceSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
