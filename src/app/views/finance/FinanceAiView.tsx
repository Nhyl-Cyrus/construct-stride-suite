import { FinancePageHeader, FinanceSection, StatusBadge } from "@/components/finance/finance-shell";
import { aiInsights, financialRisks } from "@/app/models/finance";
import { Sparkles, ShieldAlert, TrendingUp, Brain, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FinanceAiView() {
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Financial Intelligence"
        description="AI-powered forecasting, anomaly detection and risk advisory. Advisory only — humans approve all decisions."
        icon={Sparkles}
        breadcrumbs={[{ label: "Financial Intelligence" }]}
      />
      <div className="grid gap-4 px-4 md:px-6 lg:grid-cols-2">
        {aiInsights.map((i) => (
          <Card key={i.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" /> {i.category}
                </div>
                <Badge variant="outline" className="rounded-full text-[10px]">{(i.confidence * 100).toFixed(0)}% confidence</Badge>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{i.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{i.body}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Confidence</div>
                <Progress value={i.confidence * 100} className="h-1.5" />
              </div>
              {i.suggestedActions && (
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Suggested actions</div>
                  <ul className="space-y-1">
                    {i.suggestedActions.map((a) => (
                      <li key={a} className="flex items-start gap-1.5 text-xs">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs">Acknowledge</Button>
                <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs">Dismiss</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-4 md:px-6">
        <FinanceSection title="Financial risk register" subtitle="AI-detected exposures" badge={`${financialRisks.length}`}>
          <ul className="space-y-2">
            {financialRisks.map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-xl border p-3">
                <ShieldAlert className={`mt-0.5 h-4 w-4 ${r.level === "critical" ? "text-rose-500" : r.level === "high" ? "text-amber-500" : "text-emerald-500"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.title}</div>
                    <StatusBadge status={r.level} />
                  </div>
                  <p className="text-xs text-muted-foreground">{r.impact} · {r.project}</p>
                </div>
              </li>
            ))}
          </ul>
        </FinanceSection>
      </div>
    </div>
  );
}
