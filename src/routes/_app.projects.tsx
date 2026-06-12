import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  ChevronRight,
  MapPin,
  Users,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, toneClasses, riskClasses } from "@/lib/pm-data";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({
    meta: [
      { title: "Projects — EasyConstruct" },
      { name: "description", content: "Manage and monitor your construction project portfolio." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [query, setQuery] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <TopBar title="Projects" subtitle="Portfolio of 24 active engagements across 9 sites" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">All projects</h2>
            <p className="text-sm text-muted-foreground">
              Filter, triage, and drill into project performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-xl">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/projects/new">
                <Plus className="h-4 w-4" /> New project
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Active", value: "24", tone: "text-foreground" },
            { label: "On track", value: "17", tone: "text-success" },
            { label: "At risk", value: "5", tone: "text-warning-foreground" },
            { label: "Delayed", value: "2", tone: "text-destructive" },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-1 p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className={`text-2xl font-semibold tabular-nums ${s.tone}`}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative max-w-sm flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or code…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9 rounded-xl border-border bg-muted/40 pl-9"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as "table" | "grid")}>
              <TabsList className="h-9 rounded-xl">
                <TabsTrigger value="table" className="gap-1.5 rounded-lg text-xs">
                  <ListIcon className="h-3.5 w-3.5" /> Table
                </TabsTrigger>
                <TabsTrigger value="grid" className="gap-1.5 rounded-lg text-xs">
                  <LayoutGrid className="h-3.5 w-3.5" /> Grid
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {view === "table" ? (
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5">Project</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Progress</th>
                      <th className="px-3 py-2.5">Budget</th>
                      <th className="px-3 py-2.5">Workforce</th>
                      <th className="px-3 py-2.5">Due</th>
                      <th className="px-3 py-2.5">Risk</th>
                      <th className="px-5 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr
                        key={p.code}
                        className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-5 py-3.5">
                          <Link
                            to="/projects/$projectId"
                            params={{ projectId: p.code }}
                            className="font-medium leading-tight hover:underline"
                          >
                            {p.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {p.code} · {p.client}
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${toneClasses[p.statusTone]}`}
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <Progress value={p.progress} className="h-1.5 w-24" />
                            <span className="w-9 text-xs tabular-nums text-muted-foreground">
                              {p.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={
                              p.budget > 100
                                ? "text-sm font-medium tabular-nums text-destructive"
                                : "text-sm tabular-nums"
                            }
                          >
                            {p.budget}%
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-sm tabular-nums">{p.workforce}</td>
                        <td className="px-3 py-3.5 text-sm tabular-nums text-muted-foreground">
                          {p.due}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`text-xs font-medium ${riskClasses[p.risk]}`}>
                            {p.risk}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button asChild variant="ghost" size="sm" className="rounded-lg">
                            <Link to="/projects/$projectId" params={{ projectId: p.code }}>
                              Open <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.code}
                to="/projects/$projectId"
                params={{ projectId: p.code }}
                className="group"
              >
                <Card className="h-full rounded-2xl border-border/70 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{p.code}</div>
                        <div className="mt-0.5 font-medium leading-tight group-hover:text-primary">
                          {p.name}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-0.5 text-[10px] ${toneClasses[p.statusTone]}`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {p.workforce}
                      </span>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Progress</span>
                        <span className="tabular-nums">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <span className="text-muted-foreground">Due {p.due}</span>
                      <span className={`font-medium ${riskClasses[p.risk]}`}>{p.risk} risk</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
