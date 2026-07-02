import { useEffect, useMemo, useState } from "react";
import { budgetService } from "@/app/services/budget.service";
import type { BudgetAllocation, BudgetCategory } from "@/app/models/finance/budget-extended";
import type { Budget } from "@/app/models/finance";

export function useBudgetAllocationController() {
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void Promise.all([
      budgetService.allocations(),
      budgetService.categories(),
      budgetService.list(),
    ]).then(([a, c, b]) => {
      setAllocations(a);
      setCategories(c);
      setBudgets(b);
    });
  }, []);

  const projects = useMemo(() => Array.from(new Set(allocations.map((a) => a.project))), [allocations]);
  const departments = useMemo(
    () => Array.from(new Set(allocations.map((a) => a.department))),
    [allocations],
  );

  const filtered = useMemo(() => {
    return allocations.filter((a) => {
      const q = query.trim().toLowerCase();
      const qMatch = !q || `${a.project} ${a.department} ${a.category} ${a.owner}`.toLowerCase().includes(q);
      const dMatch = department === "all" || a.department === department;
      const pMatch = project === "all" || a.project === project;
      return qMatch && dMatch && pMatch;
    });
  }, [allocations, query, department, project]);

  const totals = useMemo(() => {
    const allocated = filtered.reduce((s, a) => s + a.amount, 0);
    const consumed = filtered.reduce((s, a) => s + a.consumed, 0);
    const portfolioPlanned = budgets.reduce((s, b) => s + b.planned, 0);
    return {
      allocated,
      consumed,
      remaining: allocated - consumed,
      utilization: allocated ? consumed / allocated : 0,
      coverage: portfolioPlanned ? allocated / portfolioPlanned : 0,
    };
  }, [filtered, budgets]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { label: string; value: number; color: string }>();
    for (const a of filtered) {
      const cat = categories.find((c) => c.id === a.categoryId);
      const prev = map.get(a.categoryId);
      map.set(a.categoryId, {
        label: a.category,
        color: cat?.color ?? "#64748b",
        value: (prev?.value ?? 0) + a.amount,
      });
    }
    return Array.from(map.values());
  }, [filtered, categories]);

  const byDepartment = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of filtered) map.set(a.department, (map.get(a.department) ?? 0) + a.amount);
    return Array.from(map, ([label, value]) => ({ label, value }));
  }, [filtered]);

  const byProject = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of filtered) map.set(a.project, (map.get(a.project) ?? 0) + a.amount);
    return Array.from(map, ([label, value]) => ({ label, value }));
  }, [filtered]);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const toggleAll = (on: boolean) => {
    const next: Record<string, boolean> = {};
    if (on) filtered.forEach((a) => (next[a.id] = true));
    setSelected(next);
  };

  return {
    query,
    setQuery,
    department,
    setDepartment,
    project,
    setProject,
    departments,
    projects,
    categories,
    allocations: filtered,
    totals,
    byCategory,
    byDepartment,
    byProject,
    selected,
    selectedIds,
    toggle,
    toggleAll,
  };
}
