import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type {
  BudgetAdjustmentExt,
  AdjustmentKind,
  BudgetApprovalState,
} from "@/app/models/finance/budget-extended";

export function useBudgetAdjustmentsController() {
  const [items, setItems] = useState<BudgetAdjustmentExt[]>([]);
  const [kind, setKind] = useState<AdjustmentKind | "all">("all");
  const [status, setStatus] = useState<BudgetApprovalState | "all">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    void budgetService.adjustments().then(setItems);
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((a) => {
        const q = query.trim().toLowerCase();
        const qm = !q || `${a.project} ${a.reason} ${a.requestedBy}`.toLowerCase().includes(q);
        const km = kind === "all" || a.kind === kind;
        const sm = status === "all" || a.status === status;
        return qm && km && sm;
      }),
    [items, kind, status, query],
  );

  const totals = useMemo(() => {
    const inc = filtered.filter((a) => a.adjustmentAmount > 0).reduce((s, a) => s + a.adjustmentAmount, 0);
    const dec = filtered.filter((a) => a.adjustmentAmount < 0).reduce((s, a) => s + a.adjustmentAmount, 0);
    return {
      count: filtered.length,
      increases: inc,
      decreases: dec,
      net: inc + dec,
      pending: filtered.filter((a) => a.status !== "approved" && a.status !== "rejected").length,
    };
  }, [filtered]);

  return { items: filtered, kind, setKind, status, setStatus, query, setQuery, totals };
}
