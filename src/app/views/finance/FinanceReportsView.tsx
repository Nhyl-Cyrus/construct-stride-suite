import { FinancePageHeader, FinanceSection } from "@/components/finance/finance-shell";
import { FileBarChart2, Download, Printer, Share2, Calendar, TrendingUp, Activity, Wallet, Receipt, ClipboardList, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "RPT-BUD", title: "Budget Reports", desc: "Planned vs committed vs actual, by project and FY.", icon: Wallet },
  { id: "RPT-EXP", title: "Expense Reports", desc: "Operational expenses, vendor breakdown, anomalies.", icon: Receipt },
  { id: "RPT-PAY", title: "Payroll Review Reports", desc: "Approved batches, variance, labor cost analytics.", icon: ClipboardList },
  { id: "RPT-CF", title: "Cash Flow Reports", desc: "Inflow vs outflow, rolling 6/12 months.", icon: Activity },
  { id: "RPT-PL", title: "Profit & Loss", desc: "Portfolio P&L by project and category.", icon: TrendingUp },
  { id: "RPT-FC", title: "Forecast Reports", desc: "AI-augmented financial forecasts and scenarios.", icon: TrendingUp },
  { id: "RPT-EX", title: "Executive Financial Reports", desc: "Board-ready financial summary pack.", icon: FileSearch },
];

export function FinanceReportsView() {
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Financial Reports"
        description="Export-ready financial reporting with scheduled distribution to stakeholders."
        icon={FileBarChart2}
        breadcrumbs={[{ label: "Reports" }]}
      />
      <div className="grid gap-4 px-4 md:px-6 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                  <r.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{r.id}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs"><Download className="h-3 w-3" />PDF</Button>
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs"><Download className="h-3 w-3" />Excel</Button>
                <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs"><Printer className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs"><Share2 className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs"><Calendar className="h-3 w-3" />Schedule</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-4 md:px-6">
        <FinanceSection title="Scheduled reports" subtitle="Auto-distributed to stakeholders">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-xl border p-3"><span>Weekly Cash Flow Digest</span><span className="text-xs text-muted-foreground">Every Mon · 7:00</span></li>
            <li className="flex items-center justify-between rounded-xl border p-3"><span>Monthly P&amp;L Pack</span><span className="text-xs text-muted-foreground">1st of month · 9:00</span></li>
            <li className="flex items-center justify-between rounded-xl border p-3"><span>Quarterly Executive Brief</span><span className="text-xs text-muted-foreground">Quarterly · 10:00</span></li>
          </ul>
        </FinanceSection>
      </div>
    </div>
  );
}
