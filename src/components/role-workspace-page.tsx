import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, TrendingDown, ArrowUpRight, type LucideIcon } from "lucide-react";

export interface RoleKpi {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  icon: LucideIcon;
}

export interface RoleSection {
  id: string; // matches hash
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface Props {
  defaultSection: string;
  kpis: RoleKpi[];
  sections: RoleSection[];
  /** AI insights specific to this workspace */
  aiInsights: { title: string; body: string; tone?: "info" | "warning" | "success" }[];
  /** Quick actions in right rail */
  quickActions: { label: string; icon: LucideIcon; description: string }[];
}

export function RoleWorkspacePage({
  defaultSection,
  kpis,
  sections,
  aiInsights,
  quickActions,
}: Props) {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [active, setActive] = useState(defaultSection);

  useEffect(() => {
    if (hash) setActive(hash);
  }, [hash]);

  const current =
    sections.find((s) => s.id === active) ??
    sections.find((s) => s.id === defaultSection) ??
    sections[0];

  return (
    <>
      <TopBar />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <Card key={k.label} className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <k.icon className="h-4 w-4" />
                  </div>
                  {k.up !== undefined &&
                    (k.up ? (
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-warning" />
                    ))}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="text-[11px] text-muted-foreground">{k.label}</div>
                {k.delta && (
                  <div className="mt-1 text-[11px] text-muted-foreground/80">{k.delta}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{current?.title}</CardTitle>
                  {current?.subtitle && (
                    <p className="text-xs text-muted-foreground">{current.subtitle}</p>
                  )}
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  Section · {current?.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>{current?.content}</CardContent>
          </Card>

          {/* Right rail: AI + quick actions */}
          <div className="space-y-4">
            <Card className="rounded-2xl border-primary/20 bg-primary-soft/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">AI recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.map((a, i) => (
                  <div key={i} className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold">{a.title}</div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{a.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((a) => (
                  <Button
                    key={a.label}
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-xl px-3 py-2 text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {a.description}
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />
        <p className="text-center text-[11px] text-muted-foreground">
          Use the tabs above to switch sections in this workspace.
        </p>
      </div>
    </>
  );
}
