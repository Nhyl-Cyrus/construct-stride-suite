import { useBudgetHistoryController } from "@/app/controllers/finance/useBudgetHistoryController";
import {
  FinancePageHeader,
  FinanceSection,
} from "@/components/finance/finance-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BudgetHistoryView() {
  const c = useBudgetHistoryController();
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget History"
        description="Immutable timeline of every budget change: creation, edits, transfers, approvals, and adjustments."
        icon={BookOpen}
        breadcrumbs={[{ label: "Budget Management" }, { label: "History" }]}
        accentTone="violet"
      />

      <div className="px-4 md:px-6">
        <FinanceSection
          title="Audit ledger"
          subtitle={`${c.items.length} events`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-52">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={c.query}
                  onChange={(e) => c.setQuery(e.target.value)}
                  placeholder="Search project, field, reason…"
                  className="h-8 rounded-lg pl-8 text-xs"
                />
              </div>
              <Select value={c.action} onValueChange={c.setAction}>
                <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="adjusted">Adjusted</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={c.actor} onValueChange={c.setActor}>
                <SelectTrigger className="h-8 w-40 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actors</SelectItem>
                  {c.actors.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="rounded-xl">
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Old</TableHead>
                <TableHead>New</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.items.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {h.at}
                  </TableCell>
                  <TableCell className="text-xs">{h.actor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                      {h.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{h.budgetId}</TableCell>
                  <TableCell className="text-sm">{h.project}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.field ?? "—"}</TableCell>
                  <TableCell className="text-xs">{h.oldValue ?? "—"}</TableCell>
                  <TableCell className="text-xs">{h.newValue ?? "—"}</TableCell>
                  <TableCell className="max-w-[280px] text-xs text-muted-foreground">
                    {h.reason ?? "—"}
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
