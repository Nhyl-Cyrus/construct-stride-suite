import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Lock,
  KeyRound,
  UserCog,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/audit")({
  head: () => ({
    meta: [
      { title: "Audit & Security — EasyConstruct" },
      { name: "description", content: "Audit logs, user activity, access integrity." },
    ],
  }),
  component: AuditPage,
});

const events = [
  {
    when: "14:02",
    actor: "tomi.okafor@ec.io",
    action: "Approved",
    target: "PR-2041",
    ip: "10.4.22.18",
    tone: "success",
    icon: CheckCircle2,
  },
  {
    when: "13:47",
    actor: "system",
    action: "Auto-escalated",
    target: "CO-118 → R. Doyle",
    ip: "—",
    tone: "info",
    icon: ShieldCheck,
  },
  {
    when: "13:11",
    actor: "lena.park@ec.io",
    action: "Rotated API key",
    target: "billing-svc",
    ip: "10.4.22.41",
    tone: "warn",
    icon: KeyRound,
  },
  {
    when: "12:54",
    actor: "maya.rivera@ec.io",
    action: "Modified permissions",
    target: "Engineer role · NRT-330",
    ip: "10.4.22.07",
    tone: "warn",
    icon: UserCog,
  },
  {
    when: "12:18",
    actor: "unknown",
    action: "Failed login",
    target: "admin@ec.io ×4",
    ip: "84.221.5.93",
    tone: "danger",
    icon: AlertTriangle,
  },
  {
    when: "11:42",
    actor: "sara.aquino@ec.io",
    action: "Downloaded contract",
    target: "CT-014",
    ip: "10.4.22.55",
    tone: "info",
    icon: Lock,
  },
];

const toneClass: Record<string, string> = {
  success: "text-success bg-success/10",
  info: "text-info bg-info/10",
  warn: "text-warning-foreground bg-warning/15",
  danger: "text-destructive bg-destructive/10",
};

function AuditPage() {
  return (
    <>
      <TopBar title="Audit & Security" subtitle="Activity, access integrity, security alerts" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Events (24h)", v: "1,284", tone: "text-foreground" },
            { l: "Failed logins", v: "7", tone: "text-destructive" },
            { l: "Permission changes", v: "12", tone: "text-warning-foreground" },
            { l: "Compliance score", v: "98%", tone: "text-success" },
          ].map((s) => (
            <Card key={s.l} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-1 p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </div>
                <div className={`text-2xl font-semibold tabular-nums ${s.tone}`}>{s.v}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-warning/30 bg-warning/5 shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                4 failed login attempts from 84.221.5.93 in the last hour
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Source is outside the office IP range. Recommend blocking and notifying the account
                owner.
              </p>
            </div>
            <Button size="sm" className="rounded-xl">
              Review
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Audit log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by actor or target…"
                  className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border/70 bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5">Time</th>
                    <th className="px-3 py-2.5">Actor</th>
                    <th className="px-3 py-2.5">Action</th>
                    <th className="px-3 py-2.5">Target</th>
                    <th className="px-5 py-2.5">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                        {e.when}
                      </td>
                      <td className="px-3 py-3 text-xs">{e.actor}</td>
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1 rounded-full border-transparent px-2 py-0.5 text-[10px] ${toneClass[e.tone]}`}
                        >
                          <e.icon className="h-3 w-3" /> {e.action}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-xs">{e.target}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {e.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
