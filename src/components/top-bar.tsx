import { Bell, Search } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWorkspace } from "@/hooks/use-workspace";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const workspace = useWorkspace();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const ActionIcon = workspace.primaryAction.icon;

  const displayTitle = title ?? workspace.name;
  const displaySubtitle = subtitle ?? workspace.systemContext;

  const isTabActive = (url: string) => {
    const [path, frag] = url.split("#");
    if (frag) return pathname === path && hash === frag;
    return pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
  };

  return (
    <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <header className="flex h-16 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1 h-6" />
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`hidden h-2 w-2 shrink-0 rounded-full md:inline-block ${workspace.accentBg}`}
              aria-hidden
            />
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight tracking-tight">
                {displayTitle}
              </h1>
              <p className="truncate text-xs text-muted-foreground">{displaySubtitle}</p>
            </div>
            <Badge
              variant="outline"
              className="ml-1 hidden rounded-full border-border/60 text-[10px] font-medium uppercase tracking-wide text-muted-foreground lg:inline-flex"
            >
              {workspace.shortName}
            </Badge>
          </div>
          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={workspace.searchPlaceholder}
              className="h-9 rounded-xl border-border bg-muted/50 pl-9"
            />
          </div>
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-xl" aria-label={workspace.primaryNotifications}>
          <Bell className="h-4 w-4" />
        </Button>
        <Button size="sm" className="rounded-xl">
          <ActionIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{workspace.primaryAction.label}</span>
        </Button>
      </header>

      <nav className="flex h-11 items-center gap-1 overflow-x-auto border-t bg-muted/30 px-4 md:px-6">
        {workspace.tabs.map((tab) => {
          const active = isTabActive(tab.url);
          return (
            <Link
              key={tab.title}
              to={tab.url}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition ${
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.title}
            </Link>
          );
        })}
        <span className="ml-auto hidden text-[11px] text-muted-foreground md:inline">
          AI · {workspace.primaryAi}
        </span>
      </nav>
    </div>
  );
}
