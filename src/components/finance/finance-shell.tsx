import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Share2, type LucideIcon } from "lucide-react";

interface Crumb {
  label: string;
}

interface FinancePageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  accentTone?: "emerald" | "amber" | "violet" | "sky" | "rose";
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  showExport?: boolean;
}

const toneMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
};

export function FinancePageHeader({
  title,
  description,
  icon: Icon,
  accentTone = "emerald",
  breadcrumbs,
  actions,
  showExport = true,
}: FinancePageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${toneMap[accentTone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>Finance Operations</span>
              {breadcrumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1">
                  <span>/</span>
                  <span>{c.label}</span>
                </span>
              ))}
            </div>
          )}
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {showExport && (
          <>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl">
              <Printer className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export interface FinanceKpi {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "good" | "warn" | "bad";
}

const kpiTone: Record<string, string> = {
  default: "bg-primary-soft text-primary",
  good: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  bad: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function FinanceKpiStrip({ items }: { items: FinanceKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8">
      {items.map((k) => (
        <Card key={k.label} className="rounded-2xl">
          <CardContent className="p-4">
            <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${kpiTone[k.tone ?? "default"]}`}>
              <k.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-xl font-semibold tracking-tight">{k.value}</div>
            <div className="text-[11px] font-medium text-muted-foreground">{k.label}</div>
            {k.delta && <div className="mt-1 text-[11px] text-muted-foreground/80">{k.delta}</div>}
            {k.hint && <div className="text-[10px] text-muted-foreground/60">{k.hint}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FinanceSection({
  title,
  subtitle,
  badge,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`rounded-2xl ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {badge}
            </Badge>
          )}
          {actions}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

export function statusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === "approved" || s === "paid" || s === "success" || s === "delivered")
    return "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
  if (s === "pending" || s === "review" || s === "in transit" || s === "open" || s === "issued")
    return "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10";
  if (s === "rejected" || s === "overdue" || s === "disputed" || s === "critical")
    return "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10";
  return "border-border text-muted-foreground";
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`rounded-full text-[10px] capitalize ${statusTone(status)}`}>
      {status}
    </Badge>
  );
}
