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
import { useState } from "react";
import { RoleWorkspacePage } from "@/components/role-workspace-page";
import { Badge } from "@/components/ui/badge";
import { WorkflowDialog } from "@/components/workflows/workflow-dialog";
import { CONSULTANT_REVIEW_TYPES } from "@/app/models/consultant-reviews";
import { useWorkflows, useConsultantReviews } from "@/app/controllers/shared/useWorkflows";

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
  const { permissions, actions } = useWorkflows("consultant");
  const created = useConsultantReviews();
  const [open, setOpen] = useState(false);

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
        {
          label: "New review",
          icon: FileSearch,
          description: "Submit an advisory review",
          onSelect: () => setOpen(true),
        },
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
                ...created.map((r) => ({
                  id: r.id,
                  topic: `${r.title} · ${r.project}`,
                  status: r.status as string,
                })),
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
    >
      <WorkflowDialog
        open={open}
        onOpenChange={setOpen}
        title="New consultant review"
        description="Record findings and recommendations for a design or document."
        submitLabel="Submit review"
        disabled={!permissions.canCreateReview}
        onSubmit={async (v) => {
          const saved = await actions.createConsultantReview({
            ...v,
            dueDate: v.dueDate || new Date().toISOString().slice(0, 10),
            checklist: v.checklist ? [v.checklist] : ["Technical compliance"],
          });
          return saved !== null;
        }}
        fields={[
          { name: "title", label: "Review title", span: 2, placeholder: "Structural calculations review" },
          { name: "project", label: "Project", placeholder: "Westgate Tower" },
          { name: "subject", label: "Subject under review", placeholder: "DSG-1042 · Level 14 plan" },
          { name: "type", label: "Review type", type: "select", options: [...CONSULTANT_REVIEW_TYPES] },
          { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"], defaultValue: "Medium" },
          { name: "reviewer", label: "Reviewer", placeholder: "A. Silva" },
          { name: "dueDate", label: "Due date", type: "date" },
          { name: "checklist", label: "Checklist focus", type: "select", options: ["Technical compliance", "Code compliance", "Design quality", "Cost impact", "Constructability"], defaultValue: "Technical compliance" },
          { name: "findings", label: "Findings", type: "textarea", span: 2 },
          { name: "comments", label: "Comments (optional)", type: "textarea", span: 2 },
          { name: "recommendations", label: "Recommendations", type: "textarea", span: 2 },
          { name: "requiredChanges", label: "Required changes (optional)", type: "textarea", span: 2 },
        ]}
      />
    </RoleWorkspacePage>
  );
}
