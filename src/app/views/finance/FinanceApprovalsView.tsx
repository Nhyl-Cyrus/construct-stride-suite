import { FinancePageHeader, FinanceSection, StatusBadge } from "@/components/finance/finance-shell";
import { approvalsQueue } from "@/app/models/finance";
import { CheckSquare, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/utils/currency";

export function FinanceApprovalsView() {
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Financial Approvals"
        description="Centralized approval queue for budgets, payroll, expenses, procurement and invoices."
        icon={CheckSquare}
        breadcrumbs={[{ label: "Approvals" }]}
      />
      <div className="px-4 md:px-6">
        <FinanceSection title="Approval queue" subtitle={`${approvalsQueue.length} items awaiting decision`} badge="Live">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvalsQueue.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="text-sm font-medium">{a.kind}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.reference}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.requestedBy}</TableCell>
                  <TableCell className="text-right text-sm">{formatUSD(a.amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.slaHours}h</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg"><Check className="h-3.5 w-3.5 text-emerald-500" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg"><X className="h-3.5 w-3.5 text-rose-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FinanceSection>
      </div>
    </div>
  );
}
