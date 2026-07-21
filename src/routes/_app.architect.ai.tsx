import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, ShieldAlert, Layers, Ruler, Leaf, Wallet, Accessibility, LayoutDashboard, Radar } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AiRecommendationCard } from "@/components/architect/ai-recommendation-card";
import { useAiRecommendations } from "@/app/controllers/architect/useArchitect";
import type { AiPanelKey } from "@/app/models/architect";

export const Route = createFileRoute("/_app/architect/ai")({
  head: () => ({
    meta: [
      { title: "AI Design Assist — EasyConstruct" },
      { name: "description", content: "AI-generated design recommendations across validation, compliance, materials and risk." },
    ],
  }),
  component: AiAssistPage,
});

const PANELS: { key: AiPanelKey | "all"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All insights", icon: LayoutDashboard },
  { key: "validation", label: "Validation", icon: Sparkles },
  { key: "conflicts", label: "Conflicts", icon: Layers },
  { key: "compliance", label: "Compliance", icon: ShieldAlert },
  { key: "materials", label: "Materials", icon: Ruler },
  { key: "accessibility", label: "Accessibility", icon: Accessibility },
  { key: "sustainability", label: "Sustainability", icon: Leaf },
  { key: "cost", label: "Cost impact", icon: Wallet },
  { key: "risk", label: "Risk analysis", icon: Radar },
];

function AiAssistPage() {
  const recs = useAiRecommendations();
  const [tab, setTab] = useState<AiPanelKey | "all">("all");

  const filtered = useMemo(
    () => (tab === "all" ? recs : recs.filter((r) => r.panel === tab)),
    [recs, tab],
  );

  const avgConfidence = Math.round(recs.reduce((s, r) => s + r.confidence, 0) / (recs.length || 1));
  const critical = recs.filter((r) => r.impact === "Critical").length;

  return (
    <>
      <TopBar title="AI Design Assist" subtitle="Design Studio" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">AI Design Assist</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Automated design analysis across compliance, conflicts, materials and risk. Every insight is advisory — the design team retains the final decision.
          </p>
        </div>

        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Advisory only</AlertTitle>
          <AlertDescription>
            AI Design Assist provides recommendations and never takes autonomous action. Review each suggestion before applying.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total insights" value={`${recs.length}`} />
          <StatCard label="Avg. confidence" value={`${avgConfidence}%`} />
          <StatCard label="Critical impact" value={`${critical}`} tone="destructive" />
          <StatCard label="Panels active" value={`${PANELS.length - 1}`} />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex-wrap">
            {PANELS.map((p) => {
              const Icon = p.icon;
              return (
                <TabsTrigger key={p.key} value={p.key}>
                  <Icon className="h-3.5 w-3.5" /> {p.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value={tab} className="mt-4">
            {filtered.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  No recommendations in this panel yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((r) => (
                  <AiRecommendationCard key={r.id} rec={r} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "destructive" }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold tabular-nums ${tone === "destructive" ? "text-destructive" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
