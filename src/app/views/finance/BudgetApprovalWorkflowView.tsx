import { useBudgetApprovalController } from "@/app/controllers/finance/useBudgetApprovalController";
import {
  FinancePageHeader,
  FinanceSection,
} from "@/components/finance/finance-shell";
import {
  ApprovalStepper,
  ApprovalTimeline,
  BudgetStatusBadge,
} from "@/components/finance/budget-primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Check, X, RotateCcw } from "lucide-react";

export function BudgetApprovalWorkflowView() {
  const c = useBudgetApprovalController();

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Approval Workflow"
        description="Multi-stage approvals: Draft → Pending → Finance → Manager → Approved. Return, reject, or cancel with full audit trail."
        icon={CheckSquare}
        breadcrumbs={[{ label: "Budget Management" }, { label: "Approvals" }]}
      />

      <div className="px-4 md:px-6">
        <FinanceSection
          title="Workflow"
          subtitle="Select a budget to review"
          actions={
            <div className="flex items-center gap-2">
              <BudgetStatusBadge state={c.current} />
              <Select value={c.selectedBudgetId} onValueChange={c.setSelectedBudgetId}>
                <SelectTrigger className="h-8 w-56 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {c.budgets.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.id} · {b.project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          <ApprovalStepper current={c.current} steps={c.budgetSteps} />
        </FinanceSection>
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-3 md:px-6">
        <FinanceSection title="Approval timeline" subtitle="Every decision with comments" className="md:col-span-2">
          <ApprovalTimeline steps={c.budgetSteps} />
        </FinanceSection>

        <FinanceSection title="Decision panel" subtitle="Reviewer actions">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                Comments
              </label>
              <Textarea rows={5} placeholder="Provide context for your decision…" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-600/90">
                <Check className="h-3.5 w-3.5" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl">
                <RotateCcw className="h-3.5 w-3.5" />
                Return
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl text-rose-500">
                <X className="h-3.5 w-3.5" />
                Reject
              </Button>
            </div>
            <div className="rounded-xl border bg-muted/40 p-3 text-[11px] text-muted-foreground">
              Every decision is signed, timestamped, and written to the immutable
              audit log. Supporting documents can be attached at any stage.
            </div>
          </div>
        </FinanceSection>
      </div>

      <div className="px-4 md:px-6">
        <FinanceSection title="Pipeline overview" subtitle="Approval state per budget">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {c.budgets.map((b) => {
              const steps = c.grouped.get(b.id) ?? [];
              const undecided = steps.find((s) => !s.decision);
              const current = undecided?.stage ?? (steps.at(-1)?.stage ?? "draft");
              return (
                <button
                  key={b.id}
                  onClick={() => c.setSelectedBudgetId(b.id)}
                  className={`rounded-2xl border p-3 text-left transition hover:border-primary/40 hover:bg-primary/5 ${b.id === c.selectedBudgetId ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{b.project}</div>
                    <BudgetStatusBadge state={current} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {b.id} · {b.category} · {b.owner}
                  </div>
                </button>
              );
            })}
          </div>
        </FinanceSection>
      </div>
    </div>
  );
}
