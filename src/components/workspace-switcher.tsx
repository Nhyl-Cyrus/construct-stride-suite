import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WORKSPACE_LIST, type Workspace } from "@/lib/workspaces";

interface Props {
  current: Workspace;
}

export function WorkspaceSwitcher({ current }: Props) {
  const navigate = useNavigate();
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group/ws flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-sidebar-accent"
          aria-label="Switch workspace"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${current.accentBg}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold tracking-tight">
              {current.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {current.systemContext}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition group-hover/ws:opacity-100 group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="w-64 rounded-xl p-1">
        <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Switch workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACE_LIST.map((w) => {
          const WIcon = w.icon;
          const active = w.id === current.id;
          return (
            <DropdownMenuItem
              key={w.id}
              onClick={() => navigate({ to: w.rootPath })}
              className="flex items-start gap-2.5 rounded-lg p-2"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${w.accentBg}`}
              >
                <WIcon className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-medium">{w.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {w.systemContext}
                </span>
              </div>
              {active && <Check className="ml-auto mt-1 h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
