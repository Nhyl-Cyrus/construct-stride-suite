import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { BudgetHistoryEntryExt } from "@/app/models/finance/budget-extended";

export function useBudgetHistoryController() {
  const [items, setItems] = useState<BudgetHistoryEntryExt[]>([]);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<string>("all");
  const [actor, setActor] = useState<string>("all");

  useEffect(() => {
    void budgetService.history().then(setItems);
  }, []);

  const actors = useMemo(() => Array.from(new Set(items.map((i) => i.actor))), [items]);

  const filtered = useMemo(
    () =>
      items
        .filter((h) => {
          const q = query.trim().toLowerCase();
          const qm = !q || `${h.project} ${h.action} ${h.field ?? ""} ${h.reason ?? ""}`.toLowerCase().includes(q);
          const am = action === "all" || h.action === action;
          const acm = actor === "all" || h.actor === actor;
          return qm && am && acm;
        })
        .sort((a, b) => (a.at < b.at ? 1 : -1)),
    [items, query, action, actor],
  );

  return { items: filtered, query, setQuery, action, setAction, actor, setActor, actors };
}
