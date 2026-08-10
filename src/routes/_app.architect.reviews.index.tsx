import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckSquare, AlertTriangle, Clock } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useReviews } from "@/app/controllers/architect/useArchitect";
import { SubmitReviewDialog } from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";
import type { Review } from "@/app/models/architect";

export const Route = createFileRoute("/_app/architect/reviews/")({
  head: () => ({
    meta: [
      { title: "Review queue — EasyConstruct" },
      { name: "description", content: "Design reviews awaiting action, grouped by status." },
    ],
  }),
  component: ReviewsPage,
});

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
  { key: "rejected", label: "Rejected" },
  { key: "approved", label: "Approved" },
] as const;

function matchTab(r: Review, key: (typeof TABS)[number]["key"]) {
  if (key === "overdue") return r.overdue;
  if (key === "pending") return r.status === "Pending";
  if (key === "in-progress") return r.status === "In Progress";
  if (key === "completed") return r.status === "Approved" || r.status === "Rejected";
  if (key === "approved") return r.status === "Approved";
  if (key === "rejected") return r.status === "Rejected" || r.status === "Changes Requested";
  return true;
}

function ReviewsPage() {
  const navigate = useNavigate();
  const rows = useReviews();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("pending");
  const [submitOpen, setSubmitOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    TABS.forEach((t) => (c[t.key] = rows.filter((r) => matchTab(r, t.key)).length));
    return c;
  }, [rows]);

  const filtered = rows.filter((r) => matchTab(r, tab));

  return (
    <>
      <TopBar title="Review queue" subtitle="Design Studio" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Review queue</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Track every design review across disciplines. Filter by status, open a detail view to approve or request changes.
            </p>
          </div>
          <Button size="sm" className="rounded-xl" onClick={() => setSubmitOpen(true)}>
            <CheckSquare className="h-4 w-4" /> Submit a new review
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi label="Pending" value={counts.pending} icon={<Clock className="h-4 w-4" />} />
          <Kpi label="In progress" value={counts["in-progress"]} icon={<CheckSquare className="h-4 w-4" />} />
          <Kpi label="Overdue" value={counts.overdue} icon={<AlertTriangle className="h-4 w-4" />} tone="warning" />
          <Kpi label="Approved" value={counts.approved} icon={<CheckSquare className="h-4 w-4" />} tone="success" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex-wrap">
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
                <Badge variant="outline" className="ml-2 rounded-full text-[10px]">{counts[t.key]}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-4">
              <Card className="rounded-2xl">
                <CardContent className="p-0">
                  {filtered.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">No reviews in this bucket.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                          <th className="px-5 py-2.5">Review</th>
                          <th className="px-5 py-2.5">Design</th>
                          <th className="px-5 py-2.5">Priority</th>
                          <th className="px-5 py-2.5">Reviewers</th>
                          <th className="px-5 py-2.5">Due</th>
                          <th className="px-5 py-2.5">Status</th>
                          <th className="px-5 py-2.5" />
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((r) => (
                          <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-5 py-3">
                              <div className="text-sm font-medium">{r.code}</div>
                              <div className="text-[11px] text-muted-foreground">{r.discipline}</div>
                            </td>
                            <td className="px-5 py-3 text-sm">{r.designName}</td>
                            <td className="px-5 py-3">
                              <Badge variant="outline" className="rounded-full text-[10px]">{r.priority}</Badge>
                            </td>
                            <td className="px-5 py-3 text-sm">{r.reviewers.join(", ")}</td>
                            <td className="px-5 py-3">
                              <span className={r.overdue ? "text-destructive" : "text-muted-foreground"}>
                                {formatDate(r.dueDate)}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate({ to: "/architect/reviews/$reviewId", params: { reviewId: r.id } })}>
                                Open
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <SubmitReviewDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </>
  );
}

function Kpi({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone?: "success" | "warning" }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={`mt-1 text-2xl font-semibold tabular-nums ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : ""}`}>
            {value}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}
