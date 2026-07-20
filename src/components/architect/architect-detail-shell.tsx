import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MetadataItem {
  label: string;
  value: ReactNode;
}

export interface TimelineItem {
  at: string;
  actor: string;
  action: string;
}

interface Props {
  backTo: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  status?: { label: string; tone?: "default" | "success" | "warning" | "destructive" | "info" };
  headerActions?: ReactNode;
  metadata: MetadataItem[];
  files?: { name: string; type: string; size: string }[];
  timeline: TimelineItem[];
  comments?: { author: string; body: string; at: string; resolved?: boolean }[];
  approvals?: { name: string; role: string; status: string; at?: string }[];
  related?: { label: string; href: string }[];
  aiInsights?: { title: string; body: string }[];
  activity?: TimelineItem[];
  children?: ReactNode;
}

const toneMap: Record<NonNullable<Props["status"]>["tone"] & string, string> = {
  default: "",
  success: "text-success",
  warning: "text-warning-foreground",
  destructive: "text-destructive",
  info: "text-info",
};

export function ArchitectDetailShell(props: Props) {
  return (
    <>
      <TopBar />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 rounded-xl">
            <Link to={props.backTo}>
              <ChevronLeft className="h-4 w-4" /> {props.backLabel}
            </Link>
          </Button>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {props.eyebrow}
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">{props.title}</h2>
              {props.subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{props.subtitle}</p>
              )}
              {props.status && (
                <Badge
                  variant="outline"
                  className={`mt-2 rounded-full ${toneMap[props.status.tone ?? "default"]}`}
                >
                  {props.status.label}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">{props.headerActions}</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {props.metadata.map((m) => (
                    <div key={m.label}>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </div>
                      <div className="mt-1 text-sm font-medium">{m.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="timeline">
              <TabsList className="flex-wrap">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                {props.files && <TabsTrigger value="files">Files</TabsTrigger>}
                {props.comments && <TabsTrigger value="comments">Comments</TabsTrigger>}
                {props.approvals && <TabsTrigger value="approvals">Approvals</TabsTrigger>}
                {props.related && <TabsTrigger value="related">Related</TabsTrigger>}
                {props.activity && <TabsTrigger value="activity">Activity</TabsTrigger>}
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="space-y-3 p-4">
                    {props.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border p-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{t.action}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {t.actor} · {t.at}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              {props.files && (
                <TabsContent value="files" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardContent className="p-0">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          {props.files.map((f, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="px-4 py-2">{f.name}</td>
                              <td className="px-4 py-2">
                                <Badge variant="outline" className="rounded-full text-[10px]">
                                  {f.type}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 tabular-nums">{f.size}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {props.comments && (
                <TabsContent value="comments" className="mt-4 space-y-3">
                  {props.comments.map((c, i) => (
                    <Card key={i} className="rounded-2xl">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">{c.author}</div>
                          <div className="text-[11px] text-muted-foreground">{c.at}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.body}</p>
                        {c.resolved && (
                          <Badge variant="outline" className="mt-2 rounded-full text-[10px] text-success">
                            Resolved
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}
              {props.approvals && (
                <TabsContent value="approvals" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardContent className="space-y-2 p-4">
                      {props.approvals.map((a, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                          <div>
                            <div className="text-sm font-medium">{a.name}</div>
                            <div className="text-[11px] text-muted-foreground">{a.role}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="rounded-full text-[10px]">
                              {a.status}
                            </Badge>
                            {a.at && (
                              <div className="mt-1 text-[10px] text-muted-foreground">{a.at}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {props.related && (
                <TabsContent value="related" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardContent className="space-y-2 p-4">
                      {props.related.map((r, i) => (
                        <Link
                          key={i}
                          to={r.href}
                          className="block rounded-xl border p-3 text-sm hover:bg-muted/40"
                        >
                          {r.label}
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {props.activity && (
                <TabsContent value="activity" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardContent className="space-y-2 p-4">
                      {props.activity.map((t, i) => (
                        <div key={i} className="rounded-xl border p-3">
                          <div className="text-sm">{t.action}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {t.actor} · {t.at}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {props.children}
          </div>

          <div className="space-y-4">
            {props.aiInsights && props.aiInsights.length > 0 && (
              <Card className="rounded-2xl border-primary/20 bg-primary-soft/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">AI Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {props.aiInsights.map((a, i) => (
                    <div key={i} className="rounded-xl border bg-background/60 p-3">
                      <div className="text-xs font-semibold">{a.title}</div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{a.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
