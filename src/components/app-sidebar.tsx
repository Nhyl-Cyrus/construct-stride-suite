import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  HardHat,
  Users,
  Wallet,
  Compass,
  Wrench,
  Sparkles,
  FileBarChart2,
  CheckSquare,
  Building2,
  GitBranch,
  Files,
  CalendarRange,
  ShieldCheck,
  LifeBuoy,
  ClipboardList,
} from "lucide-react";

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

const overview = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
  { title: "Approvals", url: "/approvals", icon: CheckSquare },
  { title: "Documents", url: "/documents", icon: Files },
];

const intelligence = [
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
  { title: "Resources", url: "/resources", icon: CalendarRange },
  { title: "Reports", url: "/reports", icon: FileBarChart2 },
  { title: "Audit & Security", url: "/audit", icon: ShieldCheck },
  { title: "Support", url: "/support", icon: LifeBuoy },
];

const roles = [
  { title: "Project Manager", url: "/dashboard", icon: ClipboardList },
  { title: "Human Resources", url: "/hr", icon: Users },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Architect", url: "/architect", icon: Compass },
  { title: "Engineer", url: "/engineer", icon: Wrench },
  { title: "Site Personnel", url: "/site", icon: HardHat },
  { title: "Consultant", url: "/consultant", icon: Building2 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url + "/"));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">EasyConstruct</span>
            <span className="text-[11px] text-muted-foreground">Operations Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overview.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
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

        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {intelligence.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
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

        <SidebarGroup>
          <SidebarGroupLabel>Role views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roles.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
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
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
            MR
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Maya Rivera</span>
            <span className="text-[11px] text-muted-foreground">Project Manager</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
