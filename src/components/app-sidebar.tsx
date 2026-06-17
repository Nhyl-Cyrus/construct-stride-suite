import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

export function AppSidebar() {
  const workspace = useWorkspace();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  const isActive = (url: string) => {
    const [path, frag] = url.split("#");
    if (frag) return pathname === path && hash === frag;
    return pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-2">
        <WorkspaceSwitcher current={workspace} />
      </SidebarHeader>

      <SidebarContent>
        {workspace.sidebar.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white ${workspace.accentBg}`}
          >
            {workspace.shortName}
          </div>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">Maya Rivera</span>
            <span className="truncate text-[11px] text-muted-foreground">
              {workspace.name} workspace
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
