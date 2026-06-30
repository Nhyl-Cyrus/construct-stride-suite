import { useState } from "react";
import { useExpensesController } from "@/app/controllers/finance/useExpensesController";
import {
  FinanceKpiStrip,
  FinancePageHeader,
  FinanceSection,
  StatusBadge,
} from "@/components/finance/finance-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Receipt, Search, Plus, Truck, Wallet, ListChecks, Sparkles, Paperclip } from "lucide-react";
import { formatUSD } from "@/app/utils/currency";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ExpensesView({ tab = "tracking" }: { tab?: string }) {
  const c = useExpensesController();
  const [active, setActive] = useState(tab);

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Expense Management"
        description="Track operational expenses, purchase requests, vendor payments, reimbursements and AI anomaly detection."
        icon={Receipt}
        breadcrumbs={[{ label: "Expense Management" }]}
        actions={
          <Button size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            Record expense
          </Button>
        }
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "MTD spend", value: formatUSD(c.expenses.reduce((s, e) => s + e.amount, 0)), icon: Receipt },
            { label: "Open requests", value: `${c.purchaseRequests.filter((r) => r.status !== "approved").length}`, icon: ListChecks, tone: "warn" },
            { label: "Reimbursements", value: formatUSD(c.reimbursements.reduce((s, r) => s + r.amount, 0)), icon: Wallet },
            { label: "Procurement in transit", value: `${c.procurement.filter((p) => p.status === "In transit").length}`, icon: Truck },
          ]}
        />
      </div>

      <div className="px-4 md:px-6">
        <Tabs value={active} onValueChange={setActive}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="tracking" className="rounded-lg">Tracking</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg">Purchase Requests</TabsTrigger>
            <TabsTrigger value="reimbursements" className="rounded-lg">Reimbursements</TabsTrigger>
            <TabsTrigger value="procurement" className="rounded-lg">Procurement</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="mt-4">
            <FinanceSection
              title="Expense ledger"
              subtitle="All vendor expenses across active projects"
              actions={
                <>
                  <div className="relative w-56">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={c.query}
                      onChange={(e) => c.setQuery(e.target.value)}
                      placeholder="Search vendor, ID, project…"
                      className="h-8 rounded-lg pl-8 text-xs"
                    />
                  </div>
                  <Select value={c.category} onValueChange={c.setCategory}>
                    <SelectTrigger className="h-8 w-36 rounded-lg text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="Materials">Materials</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="PPE">PPE</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>AI</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs">{e.id}</TableCell>
                      <TableCell className="text-sm font-medium">{e.vendor}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.project}</TableCell>
                      <TableCell className="text-xs">{e.category}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(e.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.submittedAt}</TableCell>
                      <TableCell>
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        {e.anomalyScore !== undefined && (
                          <Badge
                            variant="outline"
                            className={`rounded-full text-[10px] ${
                              e.anomalyScore > 0.6
                                ? "border-rose-500/30 text-rose-500 bg-rose-500/10"
                                : e.anomalyScore > 0.3
                                  ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                                  : "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                            }`}
                          >
                            {(e.anomalyScore * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell><StatusBadge status={e.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <FinanceSection title="Purchase requests" subtitle="Awaiting Finance review">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Requested by</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.purchaseRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="text-sm">{r.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.project}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.requestedBy}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(r.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.requestedAt}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="reimbursements" className="mt-4">
            <FinanceSection title="Reimbursements" subtitle="Employee out-of-pocket claims">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.reimbursements.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="text-sm font-medium">{r.employee}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.purpose}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(r.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.submittedAt}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="procurement" className="mt-4">
            <FinanceSection title="Procurement orders" subtitle="Active vendor purchase orders">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.procurement.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id}</TableCell>
                      <TableCell className="text-sm font-medium">{p.vendor}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.project}</TableCell>
                      <TableCell className="text-right text-sm">{p.items}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(p.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.eta}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <FinanceSection title="Spending by category" subtitle="Current cycle">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={c.breakdown}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => formatUSD(Number(v))} />
                      <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FinanceSection>
              <FinanceSection title="AI anomaly detection" subtitle="Outliers worth investigating">
                <ul className="space-y-2">
                  {c.expenses
                    .filter((e) => (e.anomalyScore ?? 0) >= 0.4)
                    .map((e) => (
                      <li key={e.id} className="rounded-xl border bg-amber-500/5 p-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span className="font-mono">{e.id}</span>
                          <span>·</span>
                          <span className="font-medium">{e.vendor}</span>
                          <span className="ml-auto font-semibold">{((e.anomalyScore ?? 0) * 100).toFixed(0)}%</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {formatUSD(e.amount)} · {e.category} · {e.project}
                        </p>
                      </li>
                    ))}
                </ul>
              </FinanceSection>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
