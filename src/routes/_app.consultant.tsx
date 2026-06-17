import { createFileRoute } from "@tanstack/react-router";
import {
  FileSearch,
  Sparkles,
  FileBarChart2,
  CheckSquare,
  Files,
  Briefcase,
  MessageSquare,
  Upload,
} from "lucide-react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/consultant")({
  head: () => ({
    meta: [
      { title: "Consultant — EasyConstruct" },
      { name: "description", content: "Advisory workspace for reviews, recommendations and reports." },
    ],
  }),
  component: ConsultantPage,
});

function ConsultantPage() {
  return (
    <RoleWorkspacePage
      defaultSection="reviews"
      kpis={[
        { label: "Active engagements", value: "8", delta: "3 clients", icon: Briefcase, up: true },
        { label: "Pending reviews", value: "12", delta: "5 due this week", icon: FileSearch, up: false },
        { label: "Recommendations", value: "34", delta: "+6 this month", icon: Sparkles, up: true },
        { label: "Reports delivered", value: "21", delta: "Quarter to date", icon: FileBarChart2, up: true },
        { label: "Approvals signed", value: "47", delta: "Avg 1.2 days", icon: CheckSquare, up: true },
        { label: "Documents", value: "186", delta: "Shared with clients", icon: Files, up: true },
      ]}
      aiInsights={[
        { title: "Schedule risk", body: "Phoenix HQ Phase 2 is trending 9 days behind — recommend a critical path review." },
        { title: "Recommendation impact", body: "Your last 5 cost recommendations averaged 6.2% project savings when adopted." },
        { title: "Documentation gap", body: "Harborline Hub is missing 3 ISO 19650 deliverables before milestone gate." },
      ]}
      quickActions={[
        { label: "Open review queue", icon: FileSearch, description: "12 documents awaiting review" },
        { label: "Send recommendation", icon: Sparkles, description: "Draft advisory note to client" },
        { label: "Upload report", icon: Upload, description: "Share with stakeholders" },
        { label: "Client thread", icon: MessageSquare, description: "Active client discussions" },
      ]}
      sections={[
        {
          id: "reviews",
          title: "Review queue",
          content: (
            <div className="space-y-2">
              {[
                { id: "RV-091", topic: "Structural calculations · Westgate", status: "In review" },
                { id: "RV-092", topic: "Sustainability audit · Harborline", status: "Awaiting client" },
                { id: "RV-093", topic: "Cost model · Phoenix HQ", status: "Drafting" },
              ].map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{r.id}</div>
                    <div className="text-sm font-medium">{r.topic}</div>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
                </div>
              ))}
            </div>
          ),
        },
        { id: "recommendations", title: "Advisory recommendations", content: <p className="text-sm text-muted-foreground">Active recommendations with adoption tracking and impact estimates.</p> },
        { id: "reports", title: "Delivered reports", content: <p className="text-sm text-muted-foreground">All reports shared with clients this quarter, with read receipts.</p> },
        { id: "approvals", title: "Approval workflow", content: <p className="text-sm text-muted-foreground">Items awaiting your sign-off as the engaged consultant.</p> },
        { id: "documents", title: "Shared documents", content: <p className="text-sm text-muted-foreground">Client-shared documentation library with permissions.</p> },
      ]}
    />
  );
}
