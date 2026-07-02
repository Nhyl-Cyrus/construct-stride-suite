import { useBudgetAnalyticsController } from "@/app/controllers/finance/useBudgetAnalyticsController";
import {
  FinancePageHeader,
  FinanceSection,
} from "@/components/finance/finance-shell";
import {
  FinancialMetricCard,
  VarianceIndicator,
} from "@/components/finance/budget-primitives";
import { PieChart as PieIcon, Wallet, TrendingUp, Activity, Layers, Percent, ShieldAlert, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const fmtM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`;
const colors = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#f43f5e"];

export function BudgetAnalyticsView() {
  const c = useBudgetAnalyticsController();

  // Waterfall: planned → adjustments → actuals → remaining
  const waterfall = c.analytics
    ? [
        { name: "Planned", value: c.analytics.allocated / 1_000_000 },
        { name: "Consumed", value: -c.analytics.consumed / 1_000_000 },
        { name: "Remaining", value: c.analytics.remaining / 1_000_000 },
        { name: "Forecast Δ", value: (c.analytics.forecast - c.analytics.allocated) / 1_000_000 },
      ]
    : [];

  const stackedByProject = c.budgets.map((b) => ({
    name: b.project,
    Spent: b.spent,
    Committed: Math.max(0, b.committed - b.spent),
    Remaining: Math.max(0, b.planned - b.committed),
  }));

  return (
    <div className="space-y-6 pb-10">
      <FinancePageHeader
        title="Budget Analytics"
        description="Portfolio KPIs, forecast accuracy, monthly burn, health index, and cost efficiency."
        icon={PieIcon}
        breadcrumbs={[{ label: "Budget Management" }, { label: "Analytics" }]}
      />

      <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 md:px-6">
        <FinancialMetricCard
          label="Allocated"
          value={fmtM(c.analytics?.allocated ?? 0)}
          icon={Wallet}
        />
        <FinancialMetricCard
          label="Consumed"
          value={fmtM(c.analytics?.consumed ?? 0)}
          icon={TrendingUp}
          tone="warn"
        />
        <FinancialMetricCard
          label="Remaining"
          value={fmtM(c.analytics?.remaining ?? 0)}
          icon={Layers}
          tone="good"
        />
        <FinancialMetricCard
          label="Forecast"
          value={fmtM(c.analytics?.forecast ?? 0)}
          icon={Activity}
          tone={c.analytics && c.analytics.forecast > c.analytics.allocated ? "bad" : "default"}
        />
        <FinancialMetricCard
          label="Variance"
          value={
            c.analytics ? (
              <VarianceIndicator value={c.analytics.variancePct} invert />
            ) : (
              "—"
            )
          }
          icon={Percent}
        />
        <FinancialMetricCard
          label="Monthly burn"
          value={fmtM(c.analytics?.monthlyBurn ?? 0)}
          icon={TrendingUp}
        />
        <FinancialMetricCard
          label="Efficiency"
          value={`${Math.round((c.analytics?.efficiencyPct ?? 0) * 100)}%`}
          icon={Sparkles}
        />
        <FinancialMetricCard
          label="Health"
          value={c.analytics?.health ?? "—"}
          icon={ShieldAlert}
          tone={
            c.analytics?.health === "at-risk"
              ? "bad"
              : c.analytics?.health === "watch"
                ? "warn"
                : "good"
          }
        />
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 md:px-6">
        <FinanceSection title="Forecast vs actual" subtitle="Rolling monthly">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.forecast}>
                <defs>
                  <linearGradient id="fa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area dataKey="actual" name="Actual" fill="url(#fa)" stroke="#10b981" />
                <Line dataKey="planned" name="Planned" stroke="#0ea5e9" dot={false} />
                <Line dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>

        <FinanceSection title="Portfolio breakdown" subtitle="Stacked spent · committed · remaining">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedByProject}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Spent" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Committed" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="Remaining" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>

        <FinanceSection title="Allocation donut" subtitle="Planned share per project">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={c.budgets.map((b) => ({ name: b.project, value: b.planned }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {c.budgets.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>

        <FinanceSection title="Waterfall" subtitle="Planned → consumed → remaining → forecast Δ">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfall}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => `$${Number(v).toFixed(2)}M`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {waterfall.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.value >= 0 ? "#10b981" : "#f43f5e"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>
      </div>

      <div className="px-4 md:px-6">
        <FinanceSection title="Burn rate" subtitle="Actual monthly consumption">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={c.forecast.filter((f) => f.actual !== null)}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => fmtM(Number(v))} />
                <Line dataKey="actual" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </FinanceSection>
      </div>
    </div>
  );
}
