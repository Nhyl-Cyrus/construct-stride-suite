import { createFileRoute } from "@tanstack/react-router";
import {
  GitBranch,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Wallet,
  FileSignature,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — EasyConstruct" },
      { name: "description", content: "Configure approval pipelines and routing." },
    ],
  }),
  component: WorkflowsPage,
});

const templates = [
  {
    name: "Standard procurement",
    desc: "PM review → Finance → Executive sign-off. Default for purchase orders over $50k.",
    stages: 3,
    avg: "1.8 days",
    active: 14,
  },
  {
    name: "Change order — fast track",
    desc: "Skip mid-tier review for change orders under $25k impact.",
    stages: 2,
    avg: "0.6 days",
    active: 8,
  },
  {
    name: "Public works compliance",
    desc: "Adds Compliance and Legal nodes for public-sector projects.",
    stages: 5,
    avg: "4.2 days",
    active: 3,
  },
  {
    name: "Subcontractor onboarding",
    desc: "HR verification, insurance check, safety review, PM approval.",
    stages: 4,
    avg: "2.4 days",
    active: 6,
  },
];

const pipeline = [
  { role: "Project Manager", icon: UserCheck, status: "done", who: "Maya Rivera", when: "Mon" },
  { role: "Finance", icon: Wallet, status: "done", who: "Lena Park", when: "Tue" },
  {
    role: "Compliance",
    icon: ShieldCheck,
    status: "current",
    who: "Jordan Wells",
    when: "Today",
  },
  { role: "Executive", icon: FileSignature, status: "upcoming", who: "TBD", when: "—" },
];

export default function WorkflowsPage() {
  return (
    <>
      <TopBar title="Workflows" subtitle="Templates, routing, and approval hierarchies" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Workflow builder</h2>
            <p className="text-sm text-muted-foreground">
              Configure how documents, approvals, and decisions flow across departments.
            </p>
          </div>
          <Button className="rounded-xl">
            <Plus className="h-4 w-4" /> New workflow
          </Button>
        </div>

        <Tabs defaultValue="templates" className="space-y-5">
          <TabsList className="h-10 rounded-xl">
            <TabsTrigger value="templates" className="rounded-lg">
              Templates
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg">
              Active pipeline
            </TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg">
              AI suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {templates.map((t) => (
              <Card key={t.name} className="rounded-2xl border-border/70 shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium leading-tight">{t.name}</h3>
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {t.active} active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                    <span className="text-muted-foreground">
                      {t.stages} stages · avg {t.avg}
                    </span>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      Edit <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">PR-2041 · Steel erection proposal</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Westgate Medical Tower · $1.24M · standard procurement
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
                  {pipeline.map((p, i) => (
                    <div key={p.role} className="flex flex-1 items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 ${
                          p.status === "done"
                            ? "border-success bg-success/10 text-success"
                            : p.status === "current"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{p.role}</span>
                          {p.status === "done" && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          )}
                          {p.status === "current" && (
                            <Clock className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.who} · {p.when}
                        </div>
                      </div>
                      {i < pipeline.length - 1 && (
                        <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
              <CardHeader>
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[11px] text-ai"
                >
                  <Sparkles className="mr-1 h-3 w-3" /> AI workflow suggestions
                </Badge>
                <CardTitle className="text-base">3 recommended improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    t: "Add parallel Compliance & Legal review",
                    d: "Sequential review is adding ~1.4 days to public-works contracts. Parallelizing has historically reduced cycle time by 38% without quality regressions.",
                  },
                  {
                    t: "Auto-escalate stale approvals after 48h",
                    d: "12 approvals stalled >48h this month. Auto-escalation to the deputy approver would have unblocked 9 of 12.",
                  },
                  {
                    t: "Merge timesheet exceptions into a daily batch",
                    d: "Reduces HR-side notifications by 84% while preserving SLA compliance.",
                  },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
                    <div className="text-sm font-medium">{s.t}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="rounded-lg">
                        Apply
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-lg">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
