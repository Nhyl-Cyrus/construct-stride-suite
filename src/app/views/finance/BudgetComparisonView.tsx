import { useBudgetComparisonController, type ComparisonMode } from "@/app/controllers/finance/useBudgetComparisonController";
import {
  FinancePageHeader,
  FinanceSection,
} from "@/components/finance/finance-shell";
import {
  CurrencyDisplay,
  VarianceIndicator,
} from "@/components/finance/budget-primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Scale } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  ComposedChart,
} from "recharts";

const fmtM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`;

const modes: { value: ComparisonMode; label: string }[] = [
  { value: "budget-vs-actual", label: "Budget vs Actual" },
  { value: "budget-vs-forecast", label: "Budget vs Forecast" },
  { value: "dept-vs-dept", label: "Department vs Department" },
  { value: "project-vs-project", label: "Project vs Project" },
  { value: "quarter", label: "Current vs Previous Quarter" },
  { value: "year", label: "Current vs Previous Year" },
];

export function BudgetComparisonView() {
  const c = useBudgetComparisonController();
  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Comparison"
        description="Contrast budgets against actuals, forecasts, departments, projects, quarters, and years."
        icon={Scale}
        breadcrumbs={[{ label: "Budget Management" }, { label: "Comparison" }]}
        accentTone="sky"
      />

      <div className="px-4 md:px-6">
        <FinanceSection
          title="Comparison chart"
          subtitle="Select a comparison lens"
          actions={
            <Select value={c.mode} onValueChange={(v) => c.setMode(v as ComparisonMode)}>
              <SelectTrigger className="h-8 w-56 rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={c.chartData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="A" name={c.labels.A} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="B" name={c.labels.B} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line dataKey="A" name={`${c.labels.A} trend`} stroke="#0ea5e9" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>
      </div>

      <div className="px-4 md:px-6">
        <FinanceSection title="Variance ledger" subtitle="Overspending, remaining, and forecast per project">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Forecast</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm font-medium">{r.project}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-right text-sm">
                    <CurrencyDisplay value={r.planned} />
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    <CurrencyDisplay value={r.spent} />
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    <CurrencyDisplay value={r.forecast} />
                  </TableCell>
                  <TableCell
                    className={`text-right text-sm ${r.remaining < 0 ? "text-rose-500" : "text-emerald-600"}`}
                  >
                    <CurrencyDisplay value={r.remaining} />
                  </TableCell>
                  <TableCell>
                    <VarianceIndicator value={r.variance} invert />
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
