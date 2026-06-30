import { useState } from "react";
import { usePayrollReviewController } from "@/app/controllers/finance/usePayrollReviewController";
import {
  FinanceKpiStrip,
  FinancePageHeader,
  FinanceSection,
  StatusBadge,
} from "@/components/finance/finance-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Check, X, PieChart as PieIcon, Users, Wallet, Activity } from "lucide-react";
import { formatUSD } from "@/app/utils/currency";

export function PayrollReviewView({ tab = "pending" }: { tab?: string }) {
  const c = usePayrollReviewController();
  const [active, setActive] = useState(tab);

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Payroll Review"
        description="Validate HR-submitted payroll batches. Finance reviews, approves or rejects — HR generates."
        icon={ClipboardList}
        breadcrumbs={[{ label: "Payroll Review" }]}
        showExport
      />

      <div className="px-4 md:px-6">
        <FinanceKpiStrip
          items={[
            { label: "Total gross", value: formatUSD(c.labor.gross), icon: Wallet },
            { label: "Net disbursed", value: formatUSD(c.labor.net), icon: Wallet, tone: "good" },
            { label: "Headcount", value: `${c.labor.headcount}`, icon: Users },
            { label: "Avg per employee", value: formatUSD(Math.round(c.labor.avg)), icon: Activity },
          ]}
        />
      </div>

      <div className="px-4 md:px-6">
        <Card className="mb-4 rounded-2xl border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-3 text-xs">
            <PieIcon className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Finance does not generate payroll.</span> HR owns generation;
              Finance reviews calculations, variance, and disbursement timing.
            </span>
          </CardContent>
        </Card>

        <Tabs value={active} onValueChange={setActive}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="pending" className="rounded-lg">Pending</TabsTrigger>
            <TabsTrigger value="approvals" className="rounded-lg">Approvals</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
            <TabsTrigger value="labor" className="rounded-lg">Labor cost</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <FinanceSection
              title="Pending payroll batches"
              subtitle="Awaiting Finance approval"
              actions={
                <Select value={c.statusFilter} onValueChange={c.setStatusFilter}>
                  <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="review">In review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Headcount</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.batches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.period}</TableCell>
                      <TableCell className="text-sm font-medium">{b.group}</TableCell>
                      <TableCell className="text-right text-sm">{b.headcount}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(b.gross)}</TableCell>
                      <TableCell className="text-right text-sm">{formatUSD(b.net)}</TableCell>
                      <TableCell className={`text-right text-sm font-medium ${b.variance > 0.02 ? "text-amber-500" : "text-emerald-500"}`}>
                        {(b.variance * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" title="Approve">
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" title="Reject">
                            <X className="h-3.5 w-3.5 text-rose-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="approvals" className="mt-4">
            <FinanceSection title="Payroll approval queue" subtitle="Decisions due in the next 24 hours">
              <ul className="space-y-2 text-sm">
                {c.all
                  .filter((b) => b.status !== "approved")
                  .map((b) => (
                    <li key={b.id} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                          <span className="ml-2 font-medium">{b.group}</span>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{b.period}</span>
                        <span>·</span>
                        <span>{b.headcount} employees</span>
                        <span>·</span>
                        <span>Gross {formatUSD(b.gross)}</span>
                        <span>·</span>
                        <span>Variance {(b.variance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" className="h-7 rounded-lg text-xs">
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs">
                          Request changes
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs text-rose-500">
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <FinanceSection title="Payroll history" subtitle="Approved batches">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Headcount</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead>Approved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.all
                    .filter((b) => b.status === "approved")
                    .map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{b.period}</TableCell>
                        <TableCell className="text-sm">{b.group}</TableCell>
                        <TableCell className="text-right text-sm">{b.headcount}</TableCell>
                        <TableCell className="text-right text-sm">{formatUSD(b.net)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{b.submittedAt}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </FinanceSection>
          </TabsContent>

          <TabsContent value="labor" className="mt-4">
            <FinanceSection title="Labor cost summary" subtitle="Gross labor expenditure across groups">
              <div className="grid gap-3 md:grid-cols-3">
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Gross labor</div>
                    <div className="text-xl font-semibold">{formatUSD(c.labor.gross)}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Deductions</div>
                    <div className="text-xl font-semibold">{formatUSD(c.labor.gross - c.labor.net)}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Net disbursed</div>
                    <div className="text-xl font-semibold">{formatUSD(c.labor.net)}</div>
                  </CardContent>
                </Card>
              </div>
            </FinanceSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
