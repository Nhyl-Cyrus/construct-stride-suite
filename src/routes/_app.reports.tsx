import { createFileRoute } from "@tanstack/react-router";
import {
  FileBarChart2,
  Download,
  TrendingUp,
  Wallet,
  Users,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EasyConstruct" },
      { name: "description", content: "Operational, financial, and risk reports." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { name: "Operational summary", desc: "Live KPIs and milestone health.", icon: TrendingUp, updated: "Just now" },
  { name: "Financial portfolio", desc: "Budget vs. actuals across all projects.", icon: Wallet, updated: "1h ago" },
  { name: "Workforce utilization", desc: "Crew assignment, idle time, overtime.", icon: Users, updated: "2h ago" },
  { name: "Approval cycle health", desc: "Stage times, escalations, SLAs.", icon: ShieldCheck, updated: "4h ago" },
  { name: "Risk register", desc: "Active risks, owners, trend deltas.", icon: AlertTriangle, updated: "Today" },
  { name: "AI insight log", desc: "Recommendations issued and acted upon.", icon: Sparkles, updated: "Today" },
];

// simple sparkline bars
function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-16 items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-primary/70"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function ReportsPage() {
  return (
    <>
      <TopBar title="Reports" subtitle="Operational, financial, and AI-driven analytics" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Reporting & analytics</h2>
            <p className="text-sm text-muted-foreground">
              Generate, schedule, and export executive-ready reports.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4" /> Export all
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Portfolio progress — last 12 weeks</CardTitle>
              <p className="text-xs text-muted-foreground">Weekly completion velocity</p>
            </CardHeader>
            <CardContent>
              <Bars values={[42, 48, 51, 47, 55, 59, 62, 61, 67, 70, 72, 78]} />
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>W14</span>
                <span>W26</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Budget burn</CardTitle>
              <p className="text-xs text-muted-foreground">Planned vs. actual ($M)</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "Planned", v: 12.4, max: 16, tone: "bg-muted" },
                { l: "Committed", v: 11.8, max: 16, tone: "bg-primary/70" },
                { l: "Actual", v: 9.2, max: 16, tone: "bg-success" },
              ].map((row) => (
                <div key={row.l}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{row.l}</span>
                    <span className="tabular-nums">${row.v}M</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${row.tone}`}
                      style={{ width: `${(row.v / row.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Card key={r.name} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <r.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    Updated {r.updated}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium">{r.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    <FileBarChart2 className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    Export <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
