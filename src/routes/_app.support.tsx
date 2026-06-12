import { createFileRoute } from "@tanstack/react-router";
import {
  LifeBuoy,
  UserPlus,
  KeyRound,
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/support")({
  head: () => ({
    meta: [
      { title: "Support — EasyConstruct" },
      { name: "description", content: "Support tickets, access and account assistance." },
    ],
  }),
  component: SupportPage,
});

const tickets = [
  {
    id: "T-4421",
    title: "Cannot upload drawings on WMT-204",
    user: "P. Anand · Architect",
    age: "12m",
    status: "open",
    severity: "high",
  },
  {
    id: "T-4419",
    title: "MFA reset needed",
    user: "R. Doyle · Engineer",
    age: "1h",
    status: "open",
    severity: "medium",
  },
  {
    id: "T-4415",
    title: "Mobile timesheet sync stuck",
    user: "Crew 3 · MEP",
    age: "3h",
    status: "in_progress",
    severity: "medium",
  },
  {
    id: "T-4411",
    title: "Request — Finance role on RCC-077",
    user: "L. Park · Cost Controller",
    age: "6h",
    status: "in_progress",
    severity: "low",
  },
  {
    id: "T-4402",
    title: "Resolved: Slow report export",
    user: "M. Rivera",
    age: "1d",
    status: "resolved",
    severity: "low",
  },
];

const sevTone: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/15 text-warning-foreground border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

const statusTone: Record<string, string> = {
  open: "bg-info/10 text-info border-info/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-success/10 text-success border-success/20",
};

function SupportPage() {
  return (
    <>
      <TopBar title="Support" subtitle="Tickets, access requests, and user assistance" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ActionCard
            icon={UserPlus}
            title="Access request"
            desc="3 users awaiting role assignment for new projects."
            cta="Review requests"
            count={3}
          />
          <ActionCard
            icon={KeyRound}
            title="Account recovery"
            desc="MFA resets, password unlocks, device de-authorization."
            cta="Open queue"
            count={2}
          />
          <ActionCard
            icon={MessageSquare}
            title="Knowledge base"
            desc="Self-service guides and onboarding checklists."
            cta="Browse articles"
          />
        </div>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Open tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3 hover:bg-muted/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-secondary-foreground">
                    {t.status === "resolved" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <LifeBuoy className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                      <span className="truncate text-sm font-medium">{t.title}</span>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-0.5 text-[10px] ${sevTone[t.severity]}`}
                      >
                        {t.severity}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t.user}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" /> {t.age}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2 py-0.5 text-[10px] ${statusTone[t.status]}`}
                  >
                    {t.status.replace("_", " ")}
                  </Badge>
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
  cta,
  count,
}: {
  icon: typeof LifeBuoy;
  title: string;
  desc: string;
  cta: string;
  count?: number;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
          {count !== undefined && (
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
            >
              {count} pending
            </Badge>
          )}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full rounded-xl">
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
