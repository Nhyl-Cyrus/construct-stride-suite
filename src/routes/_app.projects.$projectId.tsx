import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/lib/pm-data";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Download,
  Printer,
  Share2,
  Settings,
  GanttChart,
  ListChecks,
  Flag,
  HardHat,
  Truck,
  ClipboardList,
  ShieldAlert,
  Bug,
  BadgeCheck,
  LineChart,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { projects, toneClasses, riskClasses } from "@/lib/pm-data";

export const Route = createFileRoute("/_app/projects/$projectId")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.code === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.name ?? "Project"} — EasyConstruct` },
      { name: "description", content: `Detailed view of project ${loaderData?.project.code}.` },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Project not found.</div>
  ),
  errorComponent: ({ reset }) => (
    <div className="p-10 text-center">
      <p className="text-sm text-muted-foreground">Something went wrong loading this project.</p>
      <Button onClick={reset} className="mt-3 rounded-xl">
        Try again
      </Button>
    </div>
  ),
  component: ProjectDetailPage,
});

const milestones = [
  { name: "Site mobilization", date: "Feb 18, 2025", status: "done" },
  { name: "Foundations complete", date: "Jun 02, 2025", status: "done" },
  { name: "Structural steel topped out", date: "Nov 14, 2025", status: "done" },
  { name: "Enclosure complete", date: "Apr 30, 2026", status: "current" },
  { name: "MEP rough-in complete", date: "Jul 12, 2026", status: "upcoming" },
  { name: "Substantial completion", date: "Aug 14, 2026", status: "upcoming" },
];

const team = [
  { name: "Maya Rivera", role: "Project Manager", initials: "MR" },
  { name: "Daniel Cho", role: "Site Superintendent", initials: "DC" },
  { name: "Priya Anand", role: "Lead Architect", initials: "PA" },
  { name: "Omar Hassan", role: "Structural Engineer", initials: "OH" },
  { name: "Lena Park", role: "Cost Controller", initials: "LP" },
];

const docs = [
  { id: "DR-302", title: "Curtain wall — Rev C", type: "Drawing", updated: "2h ago" },
  { id: "PR-2041", title: "Steel erection proposal", type: "Proposal", updated: "1d ago" },
  { id: "CT-014", title: "MEP subcontract", type: "Contract", updated: "3d ago" },
  { id: "RP-208", title: "Geotech report", type: "Report", updated: "1w ago" },
];

const risks = [
  { name: "Curtain wall lead time", severity: "High", owner: "Procurement", trend: "+5d" },
  { name: "Crane availability week 26", severity: "Medium", owner: "Operations", trend: "stable" },
  { name: "Permit revision pending", severity: "Medium", owner: "Compliance", trend: "-1d" },
];

const quickLinks = [
  { to: "/projects/$projectId/timeline", label: "Timeline", icon: GanttChart },
  { to: "/projects/$projectId/tasks", label: "Tasks", icon: ListChecks },
  { to: "/projects/$projectId/milestones", label: "Milestones", icon: Flag },
  { to: "/projects/$projectId/workforce", label: "Workforce", icon: HardHat },
  { to: "/projects/$projectId/equipment", label: "Equipment", icon: Truck },
  { to: "/projects/$projectId/documents", label: "Documents", icon: FileText },
  { to: "/projects/$projectId/daily-logs", label: "Daily logs", icon: ClipboardList },
  { to: "/projects/$projectId/risks", label: "Risks", icon: ShieldAlert },
  { to: "/projects/$projectId/issues", label: "Issues", icon: Bug },
  { to: "/projects/$projectId/quality", label: "Quality", icon: BadgeCheck },
  { to: "/projects/$projectId/analytics", label: "Analytics", icon: LineChart },
] as const;

function ProjectDetailPage() {
  const { project } = Route.useLoaderData() as { project: Project };
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const shareLink = () => {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(window.location.href);
    toast.success("Project link copied");
  };
  const exportProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.code}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Project export downloaded");
  };

  return (
    <>
      <TopBar title={project.name} subtitle={`${project.code} · ${project.client}`} />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/projects" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All projects
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{project.code}</span>
        </div>

        {/* Hero card */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className={`rounded-full px-2.5 py-0.5 text-[11px] ${toneClasses[project.statusTone]}`}
                >
                  {project.status}
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight">{project.name}</h2>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {project.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {project.startDate} → {project.due}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {project.workforce} on site
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  asChild
                >
                  <Link to="/projects/$projectId/documents" params={{ projectId: project.code }}>
                    <FileText className="h-4 w-4" /> Open documents
                  </Link>
                </Button>
                <Button className="rounded-xl" onClick={() => setAiOpen(true)}>
                  <Sparkles className="h-4 w-4" /> Ask AI about this project
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onSelect={() => toast.info("Edit project opened")}>
                      <Settings className="h-4 w-4" /> Edit project
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => toast.success(`${project.code} duplicated`)}>
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={shareLink}>
                      <Share2 className="h-4 w-4" /> Share link
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportProject}>
                      <Download className="h-4 w-4" /> Export JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => window.print()}>
                      <Printer className="h-4 w-4" /> Print
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => toast.success(`${project.code} archived`)}>
                      <Archive className="h-4 w-4" /> Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => setDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>


            <Separator />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Metric
                label="Progress"
                value={`${project.progress}%`}
                hint="Schedule completion"
                icon={TrendingUp}
              />
              <Metric
                label="Budget utilization"
                value={`${project.budget}%`}
                hint={`of $${project.budgetTotal}M plan`}
                icon={Wallet}
                tone={project.budget > 100 ? "danger" : "neutral"}
              />
              <Metric
                label="Workforce"
                value={String(project.workforce)}
                hint="Personnel on site"
                icon={Users}
              />
              <Metric
                label="Risk level"
                value={project.risk}
                hint="AI-assessed"
                icon={AlertTriangle}
                tone={
                  project.risk === "High"
                    ? "danger"
                    : project.risk === "Medium"
                      ? "warning"
                      : "neutral"
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick-access to sub-modules */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11">
            {quickLinks.map((q) => (
              <Link
                key={q.label}
                to={q.to}
                params={{ projectId: project.code }}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-transparent p-3 text-center text-xs font-medium text-muted-foreground hover:border-border/60 hover:bg-muted/40 hover:text-foreground"
              >
                <q.icon className="h-4 w-4" />
                {q.label}
              </Link>
            ))}
          </CardContent>
        </Card>


        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="h-10 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-lg">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="budget" className="rounded-lg">
              Budget
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg">
              Team
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg">
              Documents
            </TabsTrigger>
            <TabsTrigger value="risks" className="rounded-lg">
              Risks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Schedule health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Overall completion</span>
                    <span className="tabular-nums">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Budget consumed</span>
                    <span
                      className={`tabular-nums ${project.budget > 100 ? "text-destructive" : ""}`}
                    >
                      {project.budget}%
                    </span>
                  </div>
                  <Progress value={Math.min(project.budget, 100)} className="h-2" />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Milestones hit</span>
                    <span className="tabular-nums">3 / 6</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-ai/20 bg-gradient-to-br from-ai-soft/60 to-card shadow-sm">
              <CardHeader className="pb-3">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[11px] text-ai"
                >
                  <Sparkles className="mr-1 h-3 w-3" /> AI summary
                </Badge>
                <CardTitle className="pt-1 text-base">What to watch this week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="leading-relaxed text-muted-foreground">
                  Curtain wall delivery is the dominant constraint. Reassigning Crew 4 to interior
                  drywall reduces idle exposure by an estimated{" "}
                  <span className="font-medium text-foreground">$48k</span>.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg px-2 text-xs text-ai hover:bg-ai/10 hover:text-ai"
                >
                  See full analysis <ChevronRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-5 border-l border-border/70 pl-6">
                  {milestones.map((m, i) => (
                    <li key={i} className="relative">
                      <span
                        className={`absolute -left-[29px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          m.status === "done"
                            ? "border-success bg-success text-success-foreground"
                            : m.status === "current"
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                        }`}
                      >
                        {m.status === "done" && <CheckCircle2 className="h-3 w-3" />}
                        {m.status === "current" && <Clock className="h-3 w-3" />}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {m.date}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs capitalize text-muted-foreground">
                        {m.status === "current" ? "In progress" : m.status}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Cost breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2">Category</th>
                        <th className="py-2">Budget</th>
                        <th className="py-2">Committed</th>
                        <th className="py-2">Variance</th>
                        <th className="py-2 w-1/3">Utilization</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { c: "Structural", b: 18.4, com: 17.2, v: -0.4 },
                        { c: "Envelope", b: 12.1, com: 13.6, v: +1.1 },
                        { c: "MEP", b: 21.6, com: 14.9, v: 0 },
                        { c: "Interiors", b: 11.0, com: 4.2, v: 0 },
                        { c: "Sitework", b: 8.4, com: 7.9, v: -0.1 },
                      ].map((row) => {
                        const util = Math.round((row.com / row.b) * 100);
                        return (
                          <tr key={row.c} className="border-b border-border/50 last:border-0">
                            <td className="py-3 font-medium">{row.c}</td>
                            <td className="py-3 tabular-nums">${row.b.toFixed(1)}M</td>
                            <td className="py-3 tabular-nums">${row.com.toFixed(1)}M</td>
                            <td
                              className={`py-3 tabular-nums ${
                                row.v > 0
                                  ? "text-destructive"
                                  : row.v < 0
                                    ? "text-success"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {row.v > 0 ? "+" : ""}
                              {row.v === 0 ? "—" : `${row.v.toFixed(1)}M`}
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={Math.min(util, 100)} className="h-1.5 flex-1" />
                                <span className="w-9 text-xs tabular-nums text-muted-foreground">
                                  {util}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Core team</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {team.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recent documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {docs.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3 hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 text-secondary-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{d.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.id} · {d.type} · updated {d.updated}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      Open <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Active risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {risks.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          r.severity === "High"
                            ? "text-destructive"
                            : "text-warning-foreground"
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">Owner · {r.owner}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={`font-medium ${
                          r.severity === "High"
                            ? riskClasses.High
                            : riskClasses.Medium
                        }`}
                      >
                        {r.severity}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{r.trend}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof TrendingUp;
  tone?: "neutral" | "danger" | "warning";
}) {
  const valueClass =
    tone === "danger"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning-foreground"
        : "text-foreground";
  return (
    <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className={`text-2xl font-semibold tabular-nums ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}
