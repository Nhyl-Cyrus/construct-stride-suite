// Reusable Finance / Budget primitives. Cross-module: safe to reuse across
// Finance, PM, and HR (payroll cost) surfaces.
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/utils/currency";
import {
  budgetApprovalLabel,
  budgetApprovalOrder,
  type BudgetApprovalState,
  type BudgetApprovalStep,
} from "@/app/models/finance/budget-extended";

// ---- Currency ----
export function CurrencyDisplay({
  value,
  scale = "auto",
  className,
}: {
  value: number;
  scale?: "auto" | "full" | "m" | "k";
  className?: string;
}) {
  const abs = Math.abs(value);
  let text: string;
  if (scale === "full") text = formatUSD(value);
  else if (scale === "m") text = `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(2)}M`;
  else if (scale === "k") text = `${value < 0 ? "-" : ""}$${(abs / 1_000).toFixed(1)}K`;
  else if (abs >= 1_000_000) text = `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(2)}M`;
  else if (abs >= 1_000) text = `${value < 0 ? "-" : ""}$${(abs / 1_000).toFixed(1)}K`;
  else text = formatUSD(value);
  return <span className={cn("tabular-nums", className)}>{text}</span>;
}

// ---- Variance ----
export function VarianceIndicator({
  value,
  invert = false,
  suffix = "%",
}: {
  value: number; // as ratio (e.g. 0.048) or percent depending on suffix
  invert?: boolean; // if true, negative is good
  suffix?: string;
}) {
  const good = invert ? value < 0 : value > 0;
  const bad = invert ? value > 0 : value < 0;
  const Icon = value === 0 ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  const cls =
    value === 0
      ? "text-muted-foreground bg-muted"
      : good
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
        : bad
          ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
          : "text-muted-foreground bg-muted";
  const display =
    suffix === "%" ? `${(value * 100).toFixed(1)}${suffix}` : `${value.toFixed(1)}${suffix}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums",
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {display}
    </span>
  );
}

// ---- Budget status badge ----
const stateClass: Record<BudgetApprovalState, string> = {
  draft: "border-slate-500/30 text-slate-600 dark:text-slate-300 bg-slate-500/10",
  "pending-review": "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  "finance-review": "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10",
  "manager-review": "border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10",
  approved: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  rejected: "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10",
  returned: "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10",
  cancelled: "border-border text-muted-foreground",
};

export function BudgetStatusBadge({ state }: { state: BudgetApprovalState }) {
  return (
    <Badge variant="outline" className={cn("rounded-full text-[10px]", stateClass[state])}>
      {budgetApprovalLabel(state)}
    </Badge>
  );
}

// ---- Progress ----
export function BudgetProgressBar({
  planned,
  committed,
  spent,
}: {
  planned: number;
  committed: number;
  spent: number;
}) {
  const spentPct = planned === 0 ? 0 : Math.min(100, Math.round((spent / planned) * 100));
  const commitPct = planned === 0 ? 0 : Math.min(100, Math.round((committed / planned) * 100));
  const tone =
    spentPct >= 90 ? "bg-rose-500" : spentPct >= 75 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 bg-sky-500/40" style={{ width: `${commitPct}%` }} />
        <div className={cn("absolute inset-y-0 left-0", tone)} style={{ width: `${spentPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{spentPct}% spent</span>
        <span>{commitPct}% committed</span>
      </div>
    </div>
  );
}

// ---- Financial metric card ----
export function FinancialMetricCard({
  label,
  value,
  hint,
  delta,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  delta?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon: LucideIcon;
}) {
  const toneCls =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "warn"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : tone === "bad"
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : "bg-primary-soft text-primary";
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", toneCls)}>
            <Icon className="h-4 w-4" />
          </div>
          {delta && (
            <span className="text-[10px] font-medium text-muted-foreground">{delta}</span>
          )}
        </div>
        <div className="mt-3 text-xl font-semibold tabular-nums tracking-tight">{value}</div>
        <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground/70">{hint}</div>}
      </CardContent>
    </Card>
  );
}

// ---- Approval stepper (horizontal) ----
export function ApprovalStepper({
  current,
  steps,
}: {
  current: BudgetApprovalState;
  steps?: BudgetApprovalStep[];
}) {
  const order = budgetApprovalOrder();
  const currentIdx = order.indexOf(current === "rejected" || current === "returned" || current === "cancelled" ? "manager-review" : current);
  return (
    <ol className="grid gap-2 md:grid-cols-5">
      {order.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const step = steps?.find((x) => x.stage === s);
        return (
          <li
            key={s}
            className={cn(
              "rounded-xl border p-3",
              done && "border-emerald-500/30 bg-emerald-500/5",
              active && "border-primary/40 bg-primary/5",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  done && "bg-emerald-500 text-white",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="text-[11px] font-medium">{budgetApprovalLabel(s)}</span>
            </div>
            {step?.approver && (
              <div className="mt-2 text-[10px] text-muted-foreground">
                {step.approver} · {step.role}
              </div>
            )}
            {step?.decidedAt && (
              <div className="text-[10px] text-muted-foreground/70">{step.decidedAt}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---- Approval timeline (vertical) ----
export function ApprovalTimeline({ steps }: { steps: BudgetApprovalStep[] }) {
  if (!steps.length)
    return <div className="text-xs text-muted-foreground">No approval history yet.</div>;
  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.id} className="flex gap-3 rounded-xl border p-3">
          <div
            className={cn(
              "mt-1 h-2 w-2 shrink-0 rounded-full",
              s.decision === "approve"
                ? "bg-emerald-500"
                : s.decision === "reject"
                  ? "bg-rose-500"
                  : s.decision === "return"
                    ? "bg-orange-500"
                    : "bg-muted-foreground/40",
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{budgetApprovalLabel(s.stage)}</span>
              {s.decision && (
                <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                  {s.decision}
                </Badge>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {s.approver} · {s.role}
              {s.decidedAt && <> · {s.decidedAt}</>}
            </div>
            {s.comments && <p className="mt-1 text-xs text-muted-foreground">{s.comments}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ---- Generic history timeline ----
export interface HistoryTimelineItem {
  id: string;
  title: string;
  meta?: string;
  actor?: string;
  at: string;
  amount?: number;
  tone?: "good" | "bad" | "neutral";
}
export function HistoryTimeline({ items }: { items: HistoryTimelineItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((h) => (
        <li key={h.id} className="flex gap-3 rounded-xl border p-3">
          <div
            className={cn(
              "mt-1 h-2 w-2 shrink-0 rounded-full",
              h.tone === "good" && "bg-emerald-500",
              h.tone === "bad" && "bg-rose-500",
              (!h.tone || h.tone === "neutral") && "bg-sky-500",
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{h.title}</div>
            {h.meta && <p className="text-xs text-muted-foreground">{h.meta}</p>}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              {h.actor && <span>{h.actor}</span>}
              <span>·</span>
              <span>{h.at}</span>
              {typeof h.amount === "number" && h.amount !== 0 && (
                <span className={h.amount > 0 ? "text-emerald-500" : "text-rose-500"}>
                  {h.amount > 0 ? "+" : ""}
                  <CurrencyDisplay value={h.amount} />
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ---- Allocation donut helper (color/percent pair) ----
export function AllocationLegend({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <ul className="space-y-2">
      {items.map((i) => {
        const pct = total === 0 ? 0 : Math.round((i.value / total) * 100);
        return (
          <li key={i.label} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
            <span className="min-w-0 flex-1 truncate text-xs">{i.label}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              <CurrencyDisplay value={i.value} />
            </span>
            <span className="w-10 text-right text-[10px] text-muted-foreground/80">{pct}%</span>
            <Progress value={pct} className="h-1 w-16" />
          </li>
        );
      })}
    </ul>
  );
}
