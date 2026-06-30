import { useMemo, useState } from "react";
import { expenses, purchaseRequests, reimbursements, procurement } from "@/app/models/finance";

export function useExpensesController() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return expenses.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (!q || `${e.vendor} ${e.project} ${e.id}`.toLowerCase().includes(q)),
    );
  }, [query, category]);
  const breakdown = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return Array.from(map, ([category, amount]) => ({ category, amount }));
  }, []);
  return {
    query,
    setQuery,
    category,
    setCategory,
    expenses: filtered,
    breakdown,
    purchaseRequests,
    reimbursements,
    procurement,
  };
}
