import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/pm-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/projects/$projectId/analytics")({
  head: () => ({ meta: [{ title: "Project Analytics — EasyConstruct" }] }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = projects.find((p) => p.code === projectId);
  if (!project) return null;

  const kpis = [
    { label: "Progress", value: `${project.progress}%`, tone: "text-info" },
    { label: "Budget used", value: `${project.budget}%`, tone: project.budget > 100 ? "text-destructive" : "text-foreground" },
    { label: "Risk", value: project.risk, tone: project.risk === "High" ? "text-destructive" : "text-muted-foreground" },
    { label: "Workforce", value: String(project.workforce), tone: "text-foreground" },
  ];

  const trends = [
    { label: "Schedule variance (weeks)", value: -1.5, target: 0 },
    { label: "Cost variance (% of plan)", value: project.budget - 100, target: 0 },
    { label: "RFI cycle time (days)", value: 4.2, target: 3 },
    { label: "Change orders (open)", value: 6, target: 3 },
  ];

  return (
    <>
      <TopBar title={`Analytics · ${project.name}`} subtitle="Project-level analytics" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Performance summary</h2>
            <p className="text-sm text-muted-foreground">Trend indicators and AI observations for {project.code}.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => toast.success("Report exported")}>
              <Download className="h-4 w-4" /> Export report
            </Button>
            <Button size="sm" className="rounded-xl" onClick={() => toast.success("AI narrative generated")}>
              <Sparkles className="h-4 w-4" /> AI narrative
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="rounded-2xl">
              <CardContent className="space-y-1 p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <div className={`text-2xl font-semibold tabular-nums ${k.tone}`}>{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-base">Key variance indicators</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {trends.map((t) => {
                const bad = Math.abs(t.value) > Math.abs(t.target);
                return (
                  <div key={t.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t.label}</span>
                      <Badge variant="outline" className={`rounded-full ${bad ? "text-destructive" : "text-muted-foreground"}`}>
                        {t.value > 0 ? "+" : ""}{t.value} · target {t.target}
                      </Badge>
                    </div>
                    <Progress value={Math.min(100, Math.abs(t.value * 20))} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-base">AI observations</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-xs uppercase text-muted-foreground">Cost trajectory</div>
                <p className="mt-1">Projected end-of-project cost variance <strong>+{Math.max(0, project.budget - 95)}%</strong> vs plan. Suggest re-baselining phase 3 procurement.</p>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs uppercase text-muted-foreground">Schedule</div>
                <p className="mt-1">Critical path shifted by 3 days due to MEP rework. Recovery window intact if fabrication accelerates by May 24.</p>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs uppercase text-muted-foreground">Workforce</div>
                <p className="mt-1">Utilization steady at 82%. Overtime trending down 4% WoW — healthy signal.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
