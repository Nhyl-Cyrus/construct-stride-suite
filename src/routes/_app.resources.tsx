import { createFileRoute } from "@tanstack/react-router";
import { Users, TrendingUp, Calendar, Plus, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/resources")({
  head: () => ({
    meta: [
      { title: "Resources — EasyConstruct" },
      { name: "description", content: "Workforce allocation, utilization, and availability." },
    ],
  }),
  component: ResourcesPage,
});

const crews = [
  { name: "Crew 1 · Concrete", lead: "D. Cho", project: "WMT-204", utilization: 96, headcount: 18 },
  { name: "Crew 2 · Steel", lead: "R. Singh", project: "WMT-204", utilization: 88, headcount: 14 },
  { name: "Crew 3 · MEP", lead: "T. Okafor", project: "HLH-118", utilization: 72, headcount: 22 },
  { name: "Crew 4 · Drywall", lead: "S. Aquino", project: "RCC-077", utilization: 41, headcount: 12 },
  { name: "Crew 5 · Electrical", lead: "K. Singh", project: "NRT-330", utilization: 102, headcount: 16 },
  { name: "Crew 6 · Finishes", lead: "L. Park", project: "BRC-409", utilization: 64, headcount: 10 },
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const heat = [
  [3, 4, 4, 3, 4, 1],
  [2, 3, 4, 4, 3, 0],
  [4, 4, 4, 3, 2, 0],
  [1, 2, 3, 3, 2, 0],
  [3, 4, 4, 4, 4, 2],
  [2, 3, 3, 2, 2, 0],
];

const heatTone = ["bg-muted", "bg-primary/15", "bg-primary/35", "bg-primary/60", "bg-primary"];

function ResourcesPage() {
  return (
    <>
      <TopBar title="Resources" subtitle="Workforce distribution, utilization, availability" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Workforce board</h2>
            <p className="text-sm text-muted-foreground">
              342 personnel across 9 sites · 12 active crews
            </p>
          </div>
          <Button className="rounded-xl">
            <Plus className="h-4 w-4" /> Assign crew
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Total headcount", v: "342", icon: Users },
            { l: "Avg utilization", v: "78%", icon: TrendingUp },
            { l: "Over-allocated", v: "1", icon: TrendingUp, tone: "text-destructive" },
            { l: "Available next wk", v: "47", icon: Calendar, tone: "text-success" },
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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Crew utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {crews.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-4 rounded-xl border border-border/60 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{c.name}</span>
                      <Badge variant="outline" className="rounded-full text-[10px] font-mono">
                        {c.project}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Lead {c.lead} · {c.headcount} people
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress
                        value={Math.min(c.utilization, 100)}
                        className="h-1.5 flex-1"
                      />
                      <span
                        className={`w-10 text-xs tabular-nums ${
                          c.utilization > 100
                            ? "text-destructive"
                            : c.utilization < 50
                              ? "text-warning-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {c.utilization}%
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">This week — site density</CardTitle>
              <p className="text-xs text-muted-foreground">Personnel concentration per day</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-7 gap-1.5 text-[10px] text-muted-foreground">
                <div />
                {weekdays.map((d) => (
                  <div key={d} className="text-center">
                    {d}
                  </div>
                ))}
                {heat.map((row, ri) => (
                  <>
                    <div key={`l-${ri}`} className="self-center font-mono text-[9px]">
                      Site {ri + 1}
                    </div>
                    {row.map((v, ci) => (
                      <div
                        key={`${ri}-${ci}`}
                        className={`aspect-square rounded-md ${heatTone[v]}`}
                        title={`${v * 25}%`}
                      />
                    ))}
                  </>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {heatTone.map((c, i) => (
                    <div key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
