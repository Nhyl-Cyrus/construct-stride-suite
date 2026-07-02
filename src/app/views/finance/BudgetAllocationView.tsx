import { useBudgetAllocationController } from "@/app/controllers/finance/useBudgetAllocationController";
import {
  FinancePageHeader,
  FinanceSection,
  FinanceKpiStrip,
  StatusBadge,
} from "@/components/finance/finance-shell";
import {
  CurrencyDisplay,
  BudgetProgressBar,
  AllocationLegend,
} from "@/components/finance/budget-primitives";
import {
  PieChart,
  Search,
  Plus,
  Copy,
  Pencil,
  Trash2,
  Layers,
  Building2,
  FolderKanban,
  Percent,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RcPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmtM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`;

export function BudgetAllocationView() {
  const c = useBudgetAllocationController();
  const allSelected =
    c.allocations.length > 0 && c.allocations.every((a) => c.selected[a.id]);

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Allocation"
        description="Distribute approved budgets across departments, projects, and categories with real-time coverage and utilization."
        icon={PieChart}
        breadcrumbs={[{ label: "Budget Management" }, { label: "Allocation" }]}
        actions={
          <Button size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            New allocation
          </Button>
        }
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "Allocated", value: fmtM(c.totals.allocated), icon: Wallet },
            { label: "Consumed", value: fmtM(c.totals.consumed), icon: TrendingUp, tone: "warn" },
            { label: "Remaining", value: fmtM(c.totals.remaining), icon: Wallet, tone: "good" },
            {
              label: "Utilization",
              value: `${Math.round(c.totals.utilization * 100)}%`,
              icon: Percent,
              tone: c.totals.utilization > 0.85 ? "warn" : "default",
            },
          ]}
        />
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-3 md:px-6">
        <FinanceSection title="By category" subtitle="Planned distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RcPieChart>
                <Pie
                  data={c.byCategory}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {c.byCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
              </RcPieChart>
            </ResponsiveContainer>
          </div>
          <AllocationLegend items={c.byCategory} />
        </FinanceSection>

        <FinanceSection title="By department" subtitle="Allocated per team">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c.byDepartment} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <YAxis dataKey="label" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>

        <FinanceSection title="By project" subtitle="Coverage of portfolio">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c.byProject}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>
      </div>

      <div className="px-4 md:px-6">
        <FinanceSection
          title="Allocation ledger"
          subtitle={`${c.allocations.length} entries · ${c.selectedIds.length} selected`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-52">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={c.query}
                  onChange={(e) => c.setQuery(e.target.value)}
                  placeholder="Search allocations…"
                  className="h-8 rounded-lg pl-8 text-xs"
                />
              </div>
              <Select value={c.project} onValueChange={c.setProject}>
                <SelectTrigger className="h-8 w-36 rounded-lg text-xs">
                  <FolderKanban className="h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {c.projects.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={c.department} onValueChange={c.setDepartment}>
                <SelectTrigger className="h-8 w-36 rounded-lg text-xs">
                  <Building2 className="h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All depts</SelectItem>
                  {c.departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="rounded-xl" disabled={!c.selectedIds.length}>
                <Copy className="h-3.5 w-3.5" />
                Duplicate ({c.selectedIds.length})
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl" disabled={!c.selectedIds.length}>
                <Layers className="h-3.5 w-3.5" />
                Bulk edit
              </Button>
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => c.toggleAll(Boolean(v))}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% of budget</TableHead>
                <TableHead className="w-40">Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.allocations.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Checkbox
                      checked={Boolean(c.selected[a.id])}
                      onCheckedChange={() => c.toggle(a.id)}
                      aria-label={`Select ${a.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="text-sm font-medium">{a.project}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.department}</TableCell>
                  <TableCell className="text-xs">{a.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.owner}</TableCell>
                  <TableCell className="text-right text-sm">
                    <CurrencyDisplay value={a.amount} />
                  </TableCell>
                  <TableCell className="text-right text-xs">{a.percentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    <BudgetProgressBar planned={a.amount} committed={a.consumed} spent={a.consumed} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FinanceSection>
      </div>
    </div>
  );
}
