import { useMemo, useState } from "react";
import { payrollBatches } from "@/app/models/finance";

export function usePayrollReviewController() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const visible = useMemo(
    () =>
      payrollBatches.filter((b) => statusFilter === "all" || b.status === statusFilter),
    [statusFilter],
  );
  const labor = useMemo(() => {
    const gross = payrollBatches.reduce((s, b) => s + b.gross, 0);
    const net = payrollBatches.reduce((s, b) => s + b.net, 0);
    const headcount = payrollBatches.reduce((s, b) => s + b.headcount, 0);
    return { gross, net, headcount, avg: gross / headcount };
  }, []);
  return { batches: visible, all: payrollBatches, statusFilter, setStatusFilter, labor };
}
