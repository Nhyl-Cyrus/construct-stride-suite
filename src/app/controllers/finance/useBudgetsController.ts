import { useMemo, useState } from "react";
import { budgets, budgetAdjustments, budgetHistory } from "@/app/models/finance";

export function useBudgetsController() {
  const [query, setQuery] = useState("");
  const [fy, setFy] = useState<string>("all");

  const filtered = useMemo(() => {
    return budgets.filter((b) => {
      const q = query.trim().toLowerCase();
      const matches = !q || `${b.project} ${b.category} ${b.owner}`.toLowerCase().includes(q);
      const fyMatch = fy === "all" || b.fiscalYear === fy;
      return matches && fyMatch;
    });
  }, [query, fy]);

  const totals = useMemo(() => {
    const planned = filtered.reduce((s, b) => s + b.planned, 0);
    const committed = filtered.reduce((s, b) => s + b.committed, 0);
    const spent = filtered.reduce((s, b) => s + b.spent, 0);
    return { planned, committed, spent, remaining: planned - spent };
  }, [filtered]);

  return {
    query,
    setQuery,
    fy,
    setFy,
    budgets: filtered,
    adjustments: budgetAdjustments,
    history: budgetHistory,
    totals,
  };
}
