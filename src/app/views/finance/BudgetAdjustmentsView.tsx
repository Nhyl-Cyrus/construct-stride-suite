import { useBudgetAdjustmentsController } from "@/app/controllers/finance/useBudgetAdjustmentsController";
import {
  FinancePageHeader,
  FinanceSection,
  FinanceKpiStrip,
} from "@/components/finance/finance-shell";
import {
  BudgetStatusBadge,
  CurrencyDisplay,
} from "@/components/finance/budget-primitives";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Shuffle,
  AlertTriangle,
  FileText,
  ScrollText,
} from "lucide-react";
import type { AdjustmentKind, BudgetApprovalState } from "@/app/models/finance/budget-extended";

const kindIcon: Record<AdjustmentKind, typeof ArrowUpRight> = {
  increase: ArrowUpRight,
  decrease: ArrowDownRight,
  transfer: Shuffle,
  emergency: AlertTriangle,
};

const kindTone: Record<AdjustmentKind, string> = {
  increase: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  decrease: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  transfer: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
  emergency: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
};

export function BudgetAdjustmentsView() {
  const c = useBudgetAdjustmentsController();
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Adjustments"
        description="Request increases, decreases, transfers and emergency allocations against approved baselines."
        icon={GitBranch}
        breadcrumbs={[{ label: "Budget Management" }, { label: "Adjustments" }]}
        accentTone="amber"
        actions={
          <Button size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            Request adjustment
          </Button>
        }
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "Total requests", value: c.totals.count.toString(), icon: ScrollText },
            { label: "Pending", value: c.totals.pending.toString(), icon: FileText, tone: "warn" },
            {
              label: "Increases",
              value: `+$${(c.totals.increases / 1_000).toFixed(0)}K`,
              icon: ArrowUpRight,
              tone: "bad",
            },
            {
              label: "Decreases",
              value: `-$${Math.abs(c.totals.decreases / 1_000).toFixed(0)}K`,
              icon: ArrowDownRight,
              tone: "good",
            },
          ]}
        />
      </div>

      <div className="px-4 md:px-6">
        <FinanceSection
          title="Adjustment ledger"
          subtitle="All requests with revision history"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={c.query}
                  onChange={(e) => c.setQuery(e.target.value)}
                  placeholder="Search reason, project…"
                  className="h-8 rounded-lg pl-8 text-xs"
                />
              </div>
              <Select value={c.kind} onValueChange={(v) => c.setKind(v as AdjustmentKind | "all")}>
                <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All kinds</SelectItem>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={c.status}
                onValueChange={(v) => c.setStatus(v as BudgetApprovalState | "all")}
              >
                <SelectTrigger className="h-8 w-36 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="finance-review">Finance Review</SelectItem>
                  <SelectItem value="manager-review">Manager Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Original</TableHead>
                <TableHead className="text-right">Δ</TableHead>
                <TableHead className="text-right">New total</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.items.map((a) => {
                const Icon = kindIcon[a.kind];
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${kindTone[a.kind]}`}
                      >
                        <Icon className="h-3 w-3" />
                        {a.kind}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{a.project}</TableCell>
                    <TableCell className="text-right text-xs">
                      <CurrencyDisplay value={a.originalAmount} />
                    </TableCell>
                    <TableCell
                      className={`text-right text-sm font-medium ${a.adjustmentAmount > 0 ? "text-rose-500" : a.adjustmentAmount < 0 ? "text-emerald-500" : "text-muted-foreground"}`}
                    >
                      {a.adjustmentAmount > 0 ? "+" : ""}
                      <CurrencyDisplay value={a.adjustmentAmount} />
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <CurrencyDisplay value={a.newAmount} />
                    </TableCell>
                    <TableCell className="max-w-[240px] text-xs text-muted-foreground">
                      {a.reason}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">
                      {a.requestedAt}
                      <div>{a.requestedBy}</div>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">
                      {a.approvedAt ? (
                        <>
                          {a.approvedAt}
                          <div>{a.approvedBy}</div>
                        </>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {a.supportingDocs.length ? (
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          <FileText className="h-3 w-3" />
                          {a.supportingDocs.length}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <BudgetStatusBadge state={a.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </FinanceSection>
      </div>
    </div>
  );
}
