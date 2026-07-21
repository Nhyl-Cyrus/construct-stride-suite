import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GitBranch, GitCompareArrows } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRevisions } from "@/app/controllers/architect/useArchitect";
import { CreateRevisionDialog } from "@/components/architect/dialogs";
import { formatDate } from "@/app/utils/date";

export const Route = createFileRoute("/_app/architect/revisions")({
  head: () => ({
    meta: [
      { title: "Revisions — EasyConstruct" },
      { name: "description", content: "Timeline, version tree and comparison of design revisions." },
    ],
  }),
  component: RevisionsPage,
});

function RevisionsPage() {
  const navigate = useNavigate();
  const rows = useRevisions();
  const [createOpen, setCreateOpen] = useState(false);

  // Simple version tree grouped by design
  const grouped = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    acc[r.designName] = acc[r.designName] ? [...acc[r.designName], r] : [r];
    return acc;
  }, {});

  return (
    <>
      <TopBar title="Revisions" subtitle="Design Studio" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Revisions</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Version history, branching and side-by-side comparison across every design.
            </p>
          </div>
          <Button size="sm" className="rounded-xl" onClick={() => setCreateOpen(true)}>
            <GitBranch className="h-4 w-4" /> Create revision
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {rows
                .slice()
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((r) => (
                  <button
                    key={r.id}
                    className="flex w-full items-start gap-3 rounded-xl border p-3 text-left hover:bg-muted/30"
                    onClick={() => navigate({ to: "/architect/revisions/$revisionId", params: { revisionId: r.id } })}
                  >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{r.designName} · {r.version}</div>
                        <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Branched from {r.parentVersion} · {r.createdBy} · {formatDate(r.createdAt)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{r.reason}</div>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Version tree</CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl">
                <GitCompareArrows className="h-4 w-4" /> Compare
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(grouped).map(([design, revs]) => (
                <div key={design}>
                  <div className="text-sm font-semibold">{design}</div>
                  <div className="mt-2 space-y-1 border-l pl-4">
                    {revs
                      .slice()
                      .sort((a, b) => a.revisionNumber - b.revisionNumber)
                      .map((r) => (
                        <button
                          key={r.id}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted/40"
                          onClick={() => navigate({ to: "/architect/revisions/$revisionId", params: { revisionId: r.id } })}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-xs">{r.version}</span>
                            <span className="text-xs text-muted-foreground">← {r.parentVersion}</span>
                          </span>
                          <Badge variant="outline" className="rounded-full text-[10px]">{r.status}</Badge>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateRevisionDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
