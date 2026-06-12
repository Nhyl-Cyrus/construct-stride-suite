import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Send,
  ShieldCheck,
  Lightbulb,
  Activity,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — EasyConstruct" },
      { name: "description", content: "Explainable AI recommendations and impact forecasts." },
    ],
  }),
  component: AIInsightsPage,
});

const insights = [
  {
    title: "Schedule slip risk on HLH-118",
    summary:
      "Concrete pour dependencies for Block C show a 9-day projected slip based on supplier lead times and weather forecasts.",
    confidence: 86,
    impact: "High",
    category: "Schedule",
    reasoning: [
      "Supplier lead time data shows 5-day average extension vs. Q1.",
      "Weather model predicts 70% chance of >0.5in rain Tue–Thu.",
      "Crew calendar shows no slack until week 26.",
    ],
    actions: ["Re-sequence Block C pour", "Notify subcontractor", "Update master schedule"],
  },
  {
    title: "Proposal P-2041 ready for review",
    summary:
      "Validated against scope, pricing band, and 3 historical comparables. Two clauses flagged for legal.",
    confidence: 92,
    impact: "Medium",
    category: "Proposal",
    reasoning: [
      "Unit pricing within 4% of historical median.",
      "Clause 7.2 (liability cap) differs from standard template.",
      "Clause 12.4 (force majeure) missing pandemic carve-out.",
    ],
    actions: ["Open validation report", "Route to legal", "Approve with conditions"],
  },
  {
    title: "Crew reallocation opportunity",
    summary:
      "Shifting 6 electricians from RCC-077 (week 14) to NRT-330 saves ~$48k without milestone impact.",
    confidence: 74,
    impact: "Medium",
    category: "Resource",
    reasoning: [
      "RCC-077 electrical scope concludes wk 13 — buffer detected.",
      "NRT-330 backlogged on rough-in by 4 days.",
      "Travel time within company policy threshold.",
    ],
    actions: ["Simulate reallocation", "Notify crew leads", "Update assignments"],
  },
];

function AIInsightsPage() {
  return (
    <>
      <TopBar title="AI Insights" subtitle="Explainable recommendations across your portfolio" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {/* Hero */}
        <Card className="overflow-hidden rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft via-card to-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[11px] text-ai"
            >
              <Sparkles className="mr-1 h-3 w-3" /> Project intelligence
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Ask anything about your portfolio</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              The assistant reasons over schedule, budget, workforce, and proposals — and shows
              its sources so you can verify every claim.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder='e.g. "Which projects are most at risk of slipping in Q3?"'
                className="h-11 rounded-xl border-ai/20 bg-card pl-4"
              />
              <Button size="lg" className="rounded-xl bg-ai text-ai-foreground hover:bg-ai/90">
                <Send className="h-4 w-4" /> Ask
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Summarize this week's risks",
                "Find idle crews",
                "Compare bids on WMT-204",
                "Forecast budget for HLH-118",
              ].map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer rounded-full border-ai/20 bg-card/60 px-3 py-1 text-xs text-muted-foreground hover:border-ai/40 hover:text-foreground"
                >
                  {q}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Active insights", v: "14", icon: Lightbulb },
            { l: "High impact", v: "3", icon: AlertTriangle, tone: "text-destructive" },
            { l: "Acted on this wk", v: "9", icon: TrendingUp, tone: "text-success" },
            { l: "Avg confidence", v: "82%", icon: ShieldCheck },
          ].map((s) => (
            <Card key={s.l} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-1 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </span>
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div
                  className={`text-2xl font-semibold tabular-nums ${s.tone ?? "text-foreground"}`}
                >
                  {s.v}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="h-10 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-lg">Schedule</TabsTrigger>
            <TabsTrigger value="proposal" className="rounded-lg">Proposal</TabsTrigger>
            <TabsTrigger value="resource" className="rounded-lg">Resource</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {insights.map((insight, i) => (
              <Card key={i} className="rounded-2xl border-border/70 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-ai/30 bg-ai/10 px-2 py-0.5 text-[10px] text-ai"
                      >
                        {insight.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          insight.impact === "High"
                            ? "border-destructive/20 bg-destructive/10 text-destructive"
                            : "border-warning/30 bg-warning/15 text-warning-foreground"
                        }`}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Confidence
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-ai"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{insight.confidence}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  <Separator />
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" /> Reasoning
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {insight.reasoning.map((r, ri) => (
                        <li key={ri} className="flex gap-2">
                          <span className="text-ai">·</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {insight.actions.map((a, ai) => (
                      <Button
                        key={ai}
                        size="sm"
                        variant={ai === 0 ? "default" : "outline"}
                        className="rounded-lg"
                      >
                        {a} <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
