import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  FileSearch,
  ShieldCheck,
  Layers,
  CalendarRange,
  AlertTriangle,
  Sparkles,
  Plus,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";
import { WorkflowDialog } from "@/components/workflows/workflow-dialog";
import {
  useWorkflows,
  useEngineeringReports,
} from "@/app/controllers/shared/useWorkflows";

export const Route = createFileRoute("/_app/engineer")({
  head: () => ({
    meta: [
      { title: "Engineer — EasyConstruct" },
      { name: "description", content: "Site reports, technical reviews and inspections workspace." },
    ],
  }),
  component: EngineerPage,
});

const TODAY = () => new Date().toISOString().slice(0, 10);

function EngineerPage() {
  const { permissions, actions } = useWorkflows("engineer");
  const created = useEngineeringReports();
  const [open, setOpen] = useState(false);

  return (
    <RoleWorkspacePage
      defaultSection="reports"
      kpis={[
        { label: "Site reports today", value: "26", delta: "5 awaiting sign-off", icon: ClipboardList, up: true },
        { label: "Open inspections", value: "9", delta: "2 overdue", icon: ShieldCheck, up: false },
        { label: "Technical reviews", value: "14", delta: "3 with consultants", icon: FileSearch, up: true },
        { label: "Drawings on file", value: "412", delta: "v-controlled", icon: Layers, up: true },
        { label: "Resources booked", value: "78%", delta: "Next 14 days", icon: CalendarRange, up: true },
        { label: "Safety flags", value: "3", delta: "1 critical", icon: AlertTriangle, up: false },
      ]}
      aiInsights={[
        {
          title: "Foundation cure window",
          body: "Pour at Westgate Tower zone B should be delayed 6h based on rising humidity forecast.",
        },
        {
          title: "Inspection prioritisation",
          body: "Electrical inspection at Phoenix HQ basement is blocking 3 downstream tasks — escalate today.",
        },
        {
          title: "Drawing conflict",
          body: "Rebar layout in drawing S-204-v3 contradicts revised architectural plan A-114-v3.",
        },
      ]}
      quickActions={[
        {
          label: "New report",
          icon: Plus,
          description: "Technical / inspection report",
          onSelect: () => setOpen(true),
        },
        { label: "Upload drawing", icon: Upload, description: "Versioned upload with notes" },
        { label: "Schedule inspection", icon: ShieldCheck, description: "Coordinate with safety officer" },
        { label: "Run AI analysis", icon: Sparkles, description: "Detect technical conflicts" },
      ]}
      sections={[
        {
          id: "reports",
          title: "Recent site reports",
          content: (
            <div className="space-y-2">
              {[
                ...created.map((r) => ({
                  id: r.id,
                  site: `${r.project} · ${r.title}`,
                  author: r.engineer,
                  status: r.status,
                })),
                { id: "SR-2218", site: "Westgate Tower", author: "K. Okafor", status: "Submitted" },
                { id: "SR-2219", site: "Harborline Hub", author: "L. Mendes", status: "Approved" },
                { id: "SR-2220", site: "Phoenix HQ", author: "T. Nakamura", status: "Revisions" },
              ].map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{r.id}</div>
                    <div className="text-sm font-medium">
                      {r.site} · <span className="text-muted-foreground">{r.author}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
                </div>
              ))}
            </div>
          ),
        },
        { id: "reviews", title: "Technical reviews", content: <p className="text-sm text-muted-foreground">14 technical reviews in progress across structural, MEP and civil disciplines.</p> },
        { id: "inspections", title: "Inspection schedule", content: <p className="text-sm text-muted-foreground">Calendar of upcoming inspections across active sites and zones.</p> },
        { id: "drawings", title: "Drawing register", content: <p className="text-sm text-muted-foreground">Versioned register with cross-references and clash detection.</p> },
        { id: "resources", title: "Resource bookings", content: <p className="text-sm text-muted-foreground">Equipment, lab time and engineering capacity allocations.</p> },
      ]}
    >
      <WorkflowDialog
        open={open}
        onOpenChange={setOpen}
        title="New engineering report"
        description="Submit a technical, inspection or safety report."
        submitLabel="Submit report"
        disabled={!permissions.canCreateReport}
        onSubmit={async (v) => {
          const saved = await actions.createEngineeringReport({
            ...v,
            date: v.date || TODAY(),
          });
          return saved !== null;
        }}
        fields={[
          { name: "title", label: "Report title", span: 2, placeholder: "Foundation cure inspection — zone B" },
          { name: "type", label: "Report type", type: "select", options: ["Inspection", "Structural", "Safety", "Quality", "Progress", "Incident"] },
          { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"], defaultValue: "Medium" },
          { name: "project", label: "Project", placeholder: "Westgate Tower" },
          { name: "location", label: "Location / zone", placeholder: "Zone B, Level 3" },
          { name: "date", label: "Report date", type: "date" },
          { name: "engineer", label: "Engineer", placeholder: "K. Okafor" },
          { name: "description", label: "Description", type: "textarea", span: 2 },
          { name: "findings", label: "Findings", type: "textarea", span: 2 },
          { name: "measurements", label: "Measurements (optional)", type: "textarea", span: 2 },
          { name: "recommendations", label: "Recommendations", type: "textarea", span: 2 },
          { name: "requiredActions", label: "Required actions (optional)", type: "textarea", span: 2 },
        ]}
      />
    </RoleWorkspacePage>
  );
}
