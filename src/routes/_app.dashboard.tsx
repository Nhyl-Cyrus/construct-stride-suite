import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Wallet,
  HardHat,
  FileCheck2,
  ChevronRight,
  Activity,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Project Manager Dashboard — EasyConstruct" },
      {
        name: "description",
        content:
          "Live operational view of active construction projects: KPIs, milestones, workforce, approvals, and AI insights.",
      },
      { property: "og:title", content: "Project Manager Dashboard — EasyConstruct" },
      {
        property: "og:description",
        content: "KPIs, milestones, workforce, approvals, and AI insights at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

type Trend = "up" | "down" | "flat";
const kpis: {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  icon: typeof TrendingUp;
  hint: string;
}[] = [
  { label: "Active projects", value: "24", delta: "+3 this month", trend: "up", icon: TrendingUp, hint: "vs. last quarter" },
  { label: "On-time milestones", value: "87%", delta: "+4.2%", trend: "up", icon: CheckCircle2, hint: "rolling 30d" },
  { label: "Budget utilization", value: "$12.4M", delta: "62% of plan", trend: "flat", icon: Wallet, hint: "across portfolio" },
  { label: "Workforce on site", value: "342", delta: "-12 vs. yesterday", trend: "down", icon: HardHat, hint: "9 sites" },
];

const projects = [
  {
    name: "Westgate Medical Tower",
    code: "WMT-204",
    pm: "M. Rivera",
    status: "In Progress",
    statusTone: "info" as const,
    progress: 68,
    budget: 92,
    due: "Aug 14",
    risk: "Low",
  },
  {
    name: "Harbor Logistics Hub",
    code: "HLH-118",
    pm: "T. Okafor",
    status: "Delayed",
    statusTone: "destructive" as const,
    progress: 41,
    budget: 104,
    due: "Jun 30",
    risk: "High",
  },
  {
    name: "Riverside Civic Center",
    code: "RCC-077",
    pm: "S. Aquino",
    status: "Under Review",
    statusTone: "warning" as const,
    progress: 55,
    budget: 71,
    due: "Sep 02",
    risk: "Medium",
  },
  {
    name: "North Ridge Terminal 2",
    code: "NRT-330",
    pm: "K. Singh",
    status: "On Track",
    statusTone: "success" as const,
    progress: 82,
    budget: 78,
    due: "Jul 21",
    risk: "Low",
  },
  {
    name: "Eastfield Solar Farm",
    code: "ESF-051",
    pm: "L. Park",
    status: "Planning",
    statusTone: "muted" as const,
    progress: 12,
    budget: 18,
    due: "Nov 10",
    risk: "Low",
  },
];

const aiInsights = [
  {
    title: "Schedule slip risk on HLH-118",
    summary:
      "Concrete pour dependencies for Block C show a 9-day projected slip based on supplier lead times and weather.",
    confidence: 86,
    impact: "High",
    action: "Re-sequence Block C pour",
  },
  {
    title: "Proposal P-2041 ready for review",
    summary:
      "Validated against scope, pricing band, and 3 historical comparables. Two clauses flagged for legal.",
    confidence: 92,
    impact: "Medium",
    action: "Open validation report",
  },
  {
    title: "Crew reallocation opportunity",
    summary:
      "Shifting 6 electricians from RCC-077 (week 14) to NRT-330 saves ~$48k without milestone impact.",
    confidence: 74,
    impact: "Medium",
    action: "Simulate reallocation",
  },
];

const approvals = [
  { id: "PR-2041", title: "Subcontractor proposal — Steel erection", amount: "$1.24M", owner: "Finance", age: "2d" },
  { id: "CO-118", title: "Change order — Block C foundations", amount: "$182k", owner: "Engineering", age: "1d" },
  { id: "TS-009", title: "Timesheet exception — Crew 14", amount: "48 hrs", owner: "HR", age: "4h" },
  { id: "DR-302", title: "Drawing revision — Curtain wall", amount: "Rev. C", owner: "Architect", age: "6h" },
];

const activity = [
  { who: "T. Okafor", what: "uploaded RFI-208 to Harbor Logistics Hub", when: "12m" },
  { who: "AI Assistant", what: "flagged margin variance on PR-2041", when: "38m" },
  { who: "S. Aquino", what: "moved 'Roof framing' to Completed", when: "1h" },
  { who: "K. Singh", what: "approved timesheet batch #228", when: "2h" },
  { who: "L. Park", what: "drafted proposal P-2052", when: "3h" },
];

const toneClasses: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
};

function DashboardPage() {
  return (
    <>
      <TopBar
        title="Project Manager workspace"
        subtitle="Portfolio overview · Monday, June 8"
      />

      <div className="flex-1 space-y-8 p-4 md:p-8">
        {/* Hero header */}
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary-soft/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
              <Activity className="mr-1.5 h-3 w-3" /> Operations live
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Good morning, Maya.
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              24 active projects across 9 sites. 3 items need your attention today, including a delayed pour
              on Harbor Logistics Hub.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              <FileCheck2 className="h-4 w-4" /> Export report
            </Button>
            <Button className="rounded-xl">
              <Sparkles className="h-4 w-4" /> Ask AI
            </Button>
          </div>
        </section>

        {/* KPI grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <k.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">{k.value}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={
                      k.trend === "up"
                        ? "inline-flex items-center gap-1 font-medium text-success"
                        : k.trend === "down"
                        ? "inline-flex items-center gap-1 font-medium text-destructive"
                        : "inline-flex items-center gap-1 font-medium text-muted-foreground"
                    }
                  >
                    {k.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                    {k.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                    {k.delta}
                  </span>
                  <span className="text-muted-foreground">{k.hint}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Projects table */}
          <Card className="rounded-2xl border-border/70 shadow-sm xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Active projects</CardTitle>
                <p className="text-xs text-muted-foreground">5 of 24 — sorted by attention required</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5 font-medium">Project</th>
                      <th className="px-3 py-2.5 font-medium">Status</th>
                      <th className="px-3 py-2.5 font-medium">Progress</th>
                      <th className="px-3 py-2.5 font-medium">Budget</th>
                      <th className="px-3 py-2.5 font-medium">Due</th>
                      <th className="px-5 py-2.5 font-medium">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.code} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3.5">
                          <div className="font-medium leading-tight">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.code} · PM {p.pm}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${toneClasses[p.statusTone]}`}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <Progress value={p.progress} className="h-1.5 w-24" />
                            <span className="w-9 text-xs tabular-nums text-muted-foreground">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={
                              p.budget > 100
                                ? "text-sm font-medium tabular-nums text-destructive"
                                : "text-sm tabular-nums"
                            }
                          >
                            {p.budget}%
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-sm tabular-nums text-muted-foreground">{p.due}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={
                              p.risk === "High"
                                ? "text-xs font-medium text-destructive"
                                : p.risk === "Medium"
                                ? "text-xs font-medium text-warning-foreground"
                                : "text-xs font-medium text-muted-foreground"
                            }
                          >
                            {p.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="rounded-full border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[11px] font-medium text-ai">
                  <Sparkles className="mr-1 h-3 w-3" /> AI assistant
                </Badge>
                <span className="text-[11px] text-muted-foreground">Advisory · explainable</span>
              </div>
              <CardTitle className="text-lg">Today's insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-medium leading-snug">{insight.title}</h4>
                    <Badge variant="outline" className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${insight.impact === "High" ? toneClasses.destructive : toneClasses.warning}`}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{insight.summary}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-ai" style={{ width: `${insight.confidence}%` }} />
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{insight.confidence}% confidence</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-xs text-ai hover:bg-ai/10 hover:text-ai">
                      {insight.action} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Bottom row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Approvals */}
          <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Awaiting your approval</CardTitle>
                <p className="text-xs text-muted-foreground">4 items · oldest 2 days</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground">
                Open inbox <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {approvals.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-secondary-foreground">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                        <span className="truncate text-sm font-medium">{a.title}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{a.owner}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" /> {a.age} old
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-sm font-medium tabular-nums sm:inline">{a.amount}</span>
                    <Button size="sm" variant="outline" className="h-8 rounded-lg">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity + workforce snapshot */}
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-lg">Today on the ground</CardTitle>
              <p className="text-xs text-muted-foreground">Workforce & activity stream</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3">
                <div>
                  <div className="text-xs text-muted-foreground">Present</div>
                  <div className="text-lg font-semibold tabular-nums text-success">298</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Late</div>
                  <div className="text-lg font-semibold tabular-nums text-warning-foreground">31</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                  <div className="text-lg font-semibold tabular-nums text-destructive">13</div>
                </div>
              </div>

              <Separator />

              <ul className="space-y-3">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        a.who === "AI Assistant" ? "bg-ai" : "bg-primary"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="leading-snug">
                        <span className="font-medium">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.what}</span>
                      </p>
                      <span className="text-[11px] text-muted-foreground">{a.when} ago</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                  <div>
                    <p className="text-xs font-medium text-warning-foreground">Weather advisory</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Heavy rain expected at Harbor & Riverside sites Thursday. Consider rescheduling exterior pours.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          Showing data for 9 active sites · refreshed just now
        </div>
      </div>
    </>
  );
}
