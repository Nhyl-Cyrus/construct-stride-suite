import { createFileRoute } from "@tanstack/react-router";
import {
  PencilRuler,
  Layers,
  CheckSquare,
  GitBranch,
  BookOpen,
  Sparkles,
  Eye,
  Upload,
  MessageSquare,
} from "lucide-react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/architect")({
  head: () => ({
    meta: [
      { title: "Architect — EasyConstruct" },
      { name: "description", content: "Design studio for blueprints, reviews and revisions." },
    ],
  }),
  component: ArchitectPage,
});

const designs = [
  { name: "Westgate Tower · Floor 14", status: "In review", revision: "v3.2" },
  { name: "Harborline Hub · Atrium", status: "Approved", revision: "v2.1" },
  { name: "Northgate Plaza · Facade", status: "Draft", revision: "v0.4" },
  { name: "Phoenix HQ · Lobby", status: "Revision needed", revision: "v4.0" },
];

function ArchitectPage() {
  return (
    <RoleWorkspacePage
      defaultSection="designs"
      kpis={[
        { label: "Active designs", value: "28", delta: "6 in review", icon: PencilRuler, up: true },
        { label: "Blueprints", value: "142", delta: "+9 this week", icon: Layers, up: true },
        { label: "Pending reviews", value: "11", delta: "4 overdue", icon: CheckSquare, up: false },
        { label: "Open revisions", value: "17", delta: "3 critical", icon: GitBranch, up: false },
        { label: "Doc library", value: "318", delta: "DWG + PDF", icon: BookOpen, up: true },
        { label: "AI suggestions", value: "23", delta: "Awaiting your call", icon: Sparkles, up: true },
      ]}
      aiInsights={[
        {
          title: "Structural conflict detected",
          body: "Floor 14 HVAC duct routing intersects the beam grid on grid line E-7. Suggest 12cm offset.",
        },
        {
          title: "Material substitution",
          body: "Switching facade cladding to perforated aluminium reduces embodied carbon by ~18%.",
        },
        {
          title: "Compliance check",
          body: "Lobby egress width is 5cm below code on the Phoenix HQ plan revision v4.0.",
        },
      ]}
      quickActions={[
        { label: "Upload drawing", icon: Upload, description: "Add a new DWG or PDF revision" },
        { label: "Request review", icon: Eye, description: "Send a design to consultants" },
        { label: "Comment thread", icon: MessageSquare, description: "Open active review discussions" },
        { label: "Generate options", icon: Sparkles, description: "AI design variations" },
      ]}
      sections={[
        {
          id: "designs",
          title: "Active designs",
          content: (
            <div className="space-y-2">
              {designs.map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">Revision {d.revision}</div>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    {d.status}
                  </Badge>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "blueprints",
          title: "Blueprint library",
          content: <p className="text-sm text-muted-foreground">142 blueprints indexed across 12 projects with version history.</p>,
        },
        {
          id: "reviews",
          title: "Review queue",
          content: <p className="text-sm text-muted-foreground">11 reviews awaiting response from consultants and engineers.</p>,
        },
        {
          id: "revisions",
          title: "Revision tracker",
          content: <p className="text-sm text-muted-foreground">Side-by-side comparison of design revisions and change requests.</p>,
        },
        {
          id: "docs",
          title: "Documentation",
          content: <p className="text-sm text-muted-foreground">Specifications, material schedules and as-built documentation.</p>,
        },
      ]}
    />
  );
}
