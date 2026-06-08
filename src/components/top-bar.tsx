import { Bell, Search, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold leading-tight tracking-tight">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, proposals, people…"
            className="h-9 rounded-xl border-border bg-muted/50 pl-9"
          />
        </div>
      </div>
      <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      <Button size="sm" className="rounded-xl">
        <Plus className="h-4 w-4" />
        New project
      </Button>
    </header>
  );
}
