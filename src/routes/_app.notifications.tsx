import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell, CheckCheck, Filter, Trash2, Circle } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notifications as seed } from "@/lib/enterprise-mock";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — EasyConstruct" },
      { name: "description", content: "Approvals, alerts, tasks, and system updates across projects." },
    ],
  }),
  component: Page,
});

const categoryTone: Record<string, string> = {
  Approval: "bg-info/10 text-info border-info/20",
  Alert: "bg-destructive/10 text-destructive border-destructive/20",
  Task: "bg-success/10 text-success border-success/20",
  System: "bg-muted text-muted-foreground border-border",
};

function Page() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<"all" | "unread" | "Approval" | "Alert" | "Task" | "System">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (tab !== "all" && tab !== "unread" && n.category !== tab) return false;
      if (query && !`${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [items, tab, query]);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const toggle = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  const remove = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  };

  return (
    <>
      <TopBar title="Notifications" subtitle={`${unread} unread of ${items.length}`} />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Inbox</h2>
            <p className="text-sm text-muted-foreground">
              Cross-project alerts, approvals, deadlines, and system events.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => toast.info("Notification preferences opened")}>
              <Filter className="h-4 w-4" /> Preferences
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total", value: items.length, tone: "text-foreground" },
            { label: "Unread", value: unread, tone: "text-info" },
            { label: "Approvals", value: items.filter((n) => n.category === "Approval").length, tone: "text-info" },
            { label: "Alerts", value: items.filter((n) => n.category === "Alert").length, tone: "text-destructive" },
          ].map((k) => (
            <Card key={k.label} className="rounded-2xl border-border/70 shadow-sm">
              <CardContent className="space-y-1 p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <div className={`text-2xl font-semibold tabular-nums ${k.tone}`}>{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search notifications…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 max-w-sm rounded-xl border-border bg-muted/40"
            />
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="h-9 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg text-xs">All</TabsTrigger>
                <TabsTrigger value="unread" className="rounded-lg text-xs">Unread</TabsTrigger>
                <TabsTrigger value="Approval" className="rounded-lg text-xs">Approvals</TabsTrigger>
                <TabsTrigger value="Alert" className="rounded-lg text-xs">Alerts</TabsTrigger>
                <TabsTrigger value="Task" className="rounded-lg text-xs">Tasks</TabsTrigger>
                <TabsTrigger value="System" className="rounded-lg text-xs">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-0">
            <ScrollArea className="h-[560px]">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-16 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 opacity-40" />
                  <span>No notifications match this view.</span>
                </div>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 border-b border-border/60 p-4 last:border-0 hover:bg-muted/30 ${
                      n.read ? "" : "bg-info/5"
                    }`}
                  >
                    <button
                      onClick={() => toggle(n.id)}
                      className="mt-1.5"
                      aria-label={n.read ? "Mark unread" : "Mark read"}
                    >
                      <Circle className={`h-2.5 w-2.5 ${n.read ? "text-muted-foreground/40" : "fill-info text-info"}`} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`rounded-full border ${categoryTone[n.category]}`}>
                          {n.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{n.when}</span>
                      </div>
                      <div className={`mt-1 text-sm ${n.read ? "font-normal" : "font-semibold"}`}>
                        {n.title}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-xs"
                        onClick={() => toast.info(`Opening ${n.title}`)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                        onClick={() => remove(n.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
