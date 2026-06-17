import { createFileRoute } from "@tanstack/react-router";
import {
  ListChecks,
  CalendarCheck,
  ClipboardList,
  Truck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Camera,
  MapPin,
} from "lucide-react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/site")({
  head: () => ({
    meta: [
      { title: "Site Personnel — EasyConstruct" },
      { name: "description", content: "On-site tasks, attendance, safety and daily reporting." },
    ],
  }),
  component: SitePage,
});

function SitePage() {
  return (
    <RoleWorkspacePage
      defaultSection="tasks"
      kpis={[
        { label: "My tasks today", value: "7", delta: "2 high priority", icon: ListChecks, up: true },
        { label: "Hours clocked", value: "5.4h", delta: "Shift ends 17:30", icon: CalendarCheck, up: true },
        { label: "Reports filed", value: "2", delta: "1 awaiting review", icon: ClipboardList, up: true },
        { label: "Equipment in use", value: "4", delta: "All checked-in", icon: Truck, up: true },
        { label: "Safety checks", value: "3/3", delta: "Completed", icon: CheckCircle2, up: true },
        { label: "Site alerts", value: "1", delta: "Heat advisory", icon: AlertTriangle, up: false },
      ]}
      aiInsights={[
        { title: "Heat advisory", body: "Site temperature expected to exceed 36°C between 13:00–15:00 — schedule extra hydration breaks." },
        { title: "Equipment due", body: "Excavator EX-12 due for daily safety check before next operation." },
        { title: "Task suggestion", body: "Pair task #SR-2218 with #SR-2221 — both require the same crane setup." },
      ]}
      quickActions={[
        { label: "Clock in / out", icon: MapPin, description: "Geofence + photo verified" },
        { label: "Photo check-in", icon: Camera, description: "Submit on-site photo proof" },
        { label: "Report safety issue", icon: ShieldAlert, description: "Escalate to safety officer" },
        { label: "File daily report", icon: ClipboardList, description: "Submit end-of-shift summary" },
      ]}
      sections={[
        {
          id: "tasks",
          title: "Assigned tasks",
          content: (
            <div className="space-y-2">
              {[
                { id: "T-441", title: "Pour zone B foundation", priority: "High" },
                { id: "T-442", title: "Inspect scaffolding level 4", priority: "Medium" },
                { id: "T-443", title: "Material handoff to crew C", priority: "Low" },
              ].map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{t.id}</div>
                    <div className="text-sm font-medium">{t.title}</div>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">{t.priority}</Badge>
                </div>
              ))}
            </div>
          ),
        },
        { id: "attendance", title: "Attendance log", content: <p className="text-sm text-muted-foreground">Geofence + photo verified clock-in and clock-out history.</p> },
        { id: "reports", title: "Daily reports", content: <p className="text-sm text-muted-foreground">End-of-shift reports submitted to your supervisor.</p> },
        { id: "equipment", title: "Equipment checklist", content: <p className="text-sm text-muted-foreground">Tools and machinery assigned to you with daily safety checks.</p> },
        { id: "safety", title: "Safety briefings", content: <p className="text-sm text-muted-foreground">Toolbox talks, PPE compliance and incident reporting.</p> },
      ]}
    />
  );
}
