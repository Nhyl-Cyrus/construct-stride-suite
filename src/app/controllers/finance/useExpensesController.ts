import { useMemo, useState } from "react";
import { expenses as fixtureExpenses, purchaseRequests, reimbursements, procurement } from "@/app/models/finance";
import type { ExpenseRecord } from "@/app/models/finance";
import { useCreatedTransactions } from "@/app/controllers/shared/useWorkflows";

export function useExpensesController() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const created = useCreatedTransactions();

  // Transactions recorded through the primary action, mapped onto the
  // expense row shape so both sources render in the same table.
  const expenses = useMemo<ExpenseRecord[]>(
    () => [
      ...created.map((t) => ({
        id: t.number,
        vendor: t.vendor,
        project: t.project,
        category: t.category as ExpenseRecord["category"],
        amount: t.amount,
        status: (t.flagged ? "Pending" : "Approved") as ExpenseRecord["status"],
        submittedBy: t.createdBy,
        submittedAt: t.date,
        anomalyScore: t.flagged ? 0.72 : 0.12,
      })),
      ...fixtureExpenses,
    ],
    [created],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return expenses.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (!q || `${e.vendor} ${e.project} ${e.id}`.toLowerCase().includes(q)),
    );
  }, [query, category, expenses]);
  const breakdown = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return Array.from(map, ([category, amount]) => ({ category, amount }));
  }, [expenses]);
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
