import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  CheckSquare,
  Files,
  Sparkles,
  CalendarRange,
  FileBarChart2,
  ShieldCheck,
  LifeBuoy,
  Users,
  UserCheck,
  CalendarCheck,
  Wallet,
  Activity,
  Bell,
  Brain,
  Building2,
  Compass,
  Wrench,
  HardHat,
  ClipboardList,
  Receipt,
  TrendingUp,
  PieChart,
  PencilRuler,
  Layers,
  BookOpen,
  Hammer,
  Map,
  ShieldAlert,
  Truck,
  ListChecks,
  CalendarDays,
  FileSearch,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceId =
  | "project-manager"
  | "human-resources"
  | "finance"
  | "architect"
  | "engineer"
  | "site-personnel"
  | "consultant";

export interface NavItem {
  title: string;
  url: string; // can be a route or route#hash
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface KpiSummary {
  label: string;
  value: string;
  delta?: string;
}

export interface Workspace {
  id: WorkspaceId;
  name: string;
  shortName: string;
  systemContext: string;
  rootPath: string;
  accent: string; // tailwind text color for accent dot
  accentBg: string; // tailwind bg color for accent dot
  icon: LucideIcon;
  primaryAi: string;
  primaryNotifications: string;
  primaryAction: { label: string; icon: LucideIcon };
  searchPlaceholder: string;
  tabs: NavItem[];
  sidebar: NavGroup[];
}

const hr: Workspace = {
  id: "human-resources",
  name: "Human Resources",
  shortName: "HR",
  systemContext: "HR Operations",
  rootPath: "/hr",
  accent: "text-rose-500",
  accentBg: "bg-rose-500",
  icon: Users,
  primaryAi: "Workforce Intelligence",
  primaryNotifications: "HR Alerts",
  primaryAction: { label: "Add employee", icon: Users },
  searchPlaceholder: "Search employees, IDs, departments…",
  tabs: [
    { title: "Employees", url: "/hr#employees", icon: Users },
    { title: "Attendance", url: "/hr#attendance", icon: CalendarCheck },
    { title: "Payroll", url: "/hr#payroll", icon: Wallet },
    { title: "Workforce", url: "/hr#workforce", icon: Activity },
    { title: "Reports", url: "/hr#reports", icon: FileBarChart2 },
  ],
  sidebar: [
    {
      label: "Dashboard",
      items: [{ title: "HR Dashboard", url: "/hr#overview", icon: LayoutDashboard }],
    },
    {
      label: "People",
      items: [
        { title: "Employees", url: "/hr#employees", icon: Users },
        { title: "Employee Profiles", url: "/hr#profiles", icon: UserCheck },
        { title: "Documents", url: "/hr#documents", icon: Files },
        { title: "Performance", url: "/hr#performance", icon: TrendingUp },
      ],
    },
    {
      label: "Attendance",
      items: [
        { title: "Daily Attendance", url: "/hr#attendance", icon: CalendarCheck },
        { title: "Verification Queue", url: "/hr#verification", icon: ShieldCheck },
        { title: "Geofence Monitoring", url: "/hr#geofence", icon: Map },
        { title: "Photo Authentication", url: "/hr#photo-auth", icon: ShieldAlert },
        { title: "Attendance Issues", url: "/hr#issues", icon: ShieldAlert },
      ],
    },
    {
      label: "Payroll",
      items: [
        { title: "Processing", url: "/hr#payroll", icon: Wallet },
        { title: "History", url: "/hr#payroll-history", icon: Receipt },
        { title: "Approvals", url: "/hr#payroll-approvals", icon: CheckSquare },
        { title: "Gross Labor", url: "/hr#gross-labor", icon: PieChart },
      ],
    },
    {
      label: "Workforce",
      items: [
        { title: "Allocation", url: "/hr#workforce", icon: Activity },
        { title: "Capacity", url: "/hr#capacity", icon: Layers },
        { title: "Availability", url: "/hr#availability", icon: CalendarDays },
        { title: "Departments", url: "/hr#departments", icon: Building2 },
      ],
    },
    {
      label: "Analytics",
      items: [
        { title: "Workforce Reports", url: "/hr#reports", icon: FileBarChart2 },
        { title: "Attendance Reports", url: "/hr#reports-att", icon: FileBarChart2 },
        { title: "Payroll Reports", url: "/hr#reports-pay", icon: FileBarChart2 },
      ],
    },
    {
      label: "AI Workforce Intelligence",
      items: [
        { title: "Forecasting", url: "/hr#ai-forecast", icon: Sparkles },
        { title: "Attendance Risk", url: "/hr#ai-risk", icon: ShieldAlert },
        { title: "Retention Insights", url: "/hr#ai-retention", icon: Brain },
        { title: "Payroll Anomalies", url: "/hr#ai-anomaly", icon: Sparkles },
      ],
    },
    {
      label: "Inbox",
      items: [{ title: "Notifications", url: "/hr#notifications", icon: Bell }],
    },
  ],
};

const pm: Workspace = {
  id: "project-manager",
  name: "Project Manager",
  shortName: "PM",
  systemContext: "Construction Operations",
  rootPath: "/dashboard",
  accent: "text-primary",
  accentBg: "bg-primary",
  icon: ClipboardList,
  primaryAi: "Project Intelligence",
  primaryNotifications: "Project Risks",
  primaryAction: { label: "New project", icon: FolderKanban },
  searchPlaceholder: "Search projects, proposals, people…",
  tabs: [
    { title: "Projects", url: "/projects", icon: FolderKanban },
    { title: "Workflows", url: "/workflows", icon: GitBranch },
    { title: "Approvals", url: "/approvals", icon: CheckSquare },
    { title: "Documents", url: "/documents", icon: Files },
    { title: "Resources", url: "/resources", icon: CalendarRange },
  ],
  sidebar: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Projects", url: "/projects", icon: FolderKanban },
        { title: "Workflows", url: "/workflows", icon: GitBranch },
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Documents", url: "/documents", icon: Files },
      ],
    },
    {
      label: "Intelligence",
      items: [
        { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
        { title: "Resources", url: "/resources", icon: CalendarRange },
        { title: "Reports", url: "/reports", icon: FileBarChart2 },
        { title: "Audit & Security", url: "/audit", icon: ShieldCheck },
        { title: "Support", url: "/support", icon: LifeBuoy },
      ],
    },
  ],
};

const finance: Workspace = {
  id: "finance",
  name: "Finance Operations",
  shortName: "FIN",
  systemContext: "Financial Operations",
  rootPath: "/finance",
  accent: "text-emerald-500",
  accentBg: "bg-emerald-500",
  icon: Wallet,
  primaryAi: "Financial Intelligence",
  primaryNotifications: "Finance Alerts",
  primaryAction: { label: "Record transaction", icon: Receipt },
  searchPlaceholder: "Search budgets, vendors, invoices, batches…",
  tabs: [
    { title: "Budgets", url: "/finance/budgets", icon: Wallet },
    { title: "Payroll Review", url: "/finance/payroll-review", icon: ClipboardList },
    { title: "Expenses", url: "/finance/expenses", icon: Receipt },
    { title: "Reports", url: "/finance/reports", icon: FileBarChart2 },
    { title: "AI Intelligence", url: "/finance/ai", icon: Sparkles },
    { title: "Approvals", url: "/finance/approvals", icon: CheckSquare },
  ],
  sidebar: [
    {
      label: "Overview",
      items: [
        { title: "Finance Dashboard", url: "/finance", icon: LayoutDashboard },
      ],
    },
    {
      label: "Budget Management",
      items: [
        { title: "Budget Overview", url: "/finance/budgets", icon: Wallet },
        { title: "Budget Allocation", url: "/finance/budgets#allocation", icon: PieChart },
        { title: "Budget Adjustments", url: "/finance/budgets#adjustments", icon: GitBranch },
        { title: "Budget History", url: "/finance/budgets#history", icon: BookOpen },
      ],
    },
    {
      label: "Payroll Review",
      items: [
        { title: "Pending Payroll", url: "/finance/payroll-review", icon: ClipboardList },
        { title: "Payroll Approvals", url: "/finance/payroll-review#approvals", icon: CheckSquare },
        { title: "Payroll History", url: "/finance/payroll-review#history", icon: Receipt },
        { title: "Labor Cost Summary", url: "/finance/payroll-review#labor", icon: PieChart },
      ],
    },
    {
      label: "Expense Management",
      items: [
        { title: "Expense Tracking", url: "/finance/expenses", icon: Receipt },
        { title: "Purchase Requests", url: "/finance/expenses#requests", icon: ListChecks },
        { title: "Reimbursements", url: "/finance/expenses#reimbursements", icon: Wallet },
        { title: "Procurement", url: "/finance/expenses#procurement", icon: Truck },
      ],
    },
    {
      label: "Financial Reports",
      items: [
        { title: "Budget Reports", url: "/finance/reports#budget", icon: FileBarChart2 },
        { title: "Expense Reports", url: "/finance/reports#expense", icon: FileBarChart2 },
        { title: "Payroll Reports", url: "/finance/reports#payroll", icon: FileBarChart2 },
        { title: "Profit & Loss", url: "/finance/reports#pnl", icon: TrendingUp },
        { title: "Cash Flow", url: "/finance/reports#cashflow", icon: Activity },
        { title: "Executive", url: "/finance/reports#executive", icon: FileSearch },
      ],
    },
    {
      label: "Financial Intelligence",
      items: [
        { title: "Budget Forecasting", url: "/finance/ai#forecast", icon: TrendingUp },
        { title: "Cost Prediction", url: "/finance/ai#cost", icon: Brain },
        { title: "Spending Trends", url: "/finance/ai#trends", icon: Activity },
        { title: "Risk Detection", url: "/finance/ai#risk", icon: ShieldAlert },
        { title: "AI Recommendations", url: "/finance/ai#recommendations", icon: Sparkles },
      ],
    },
    {
      label: "Governance",
      items: [
        { title: "Approvals", url: "/finance/approvals", icon: CheckSquare },
        { title: "Audit Logs", url: "/finance/audit", icon: ShieldCheck },
        { title: "Notifications", url: "/finance/notifications", icon: Bell },
      ],
    },
  ],
};

const architect: Workspace = {
  id: "architect",
  name: "Architect",
  shortName: "ARC",
  systemContext: "Design Studio",
  rootPath: "/architect",
  accent: "text-violet-500",
  accentBg: "bg-violet-500",
  icon: Compass,
  primaryAi: "Design Intelligence",
  primaryNotifications: "Design Reviews",
  primaryAction: { label: "New design", icon: PencilRuler },
  searchPlaceholder: "Search designs, blueprints, reviews…",
  tabs: [
    { title: "Designs", url: "/architect#designs", icon: PencilRuler },
    { title: "Blueprints", url: "/architect#blueprints", icon: Layers },
    { title: "Reviews", url: "/architect#reviews", icon: CheckSquare },
    { title: "Revisions", url: "/architect#revisions", icon: GitBranch },
    { title: "Documentation", url: "/architect#docs", icon: BookOpen },
  ],
  sidebar: [
    {
      label: "Studio",
      items: [
        { title: "Studio Dashboard", url: "/architect#overview", icon: LayoutDashboard },
        { title: "Designs", url: "/architect#designs", icon: PencilRuler },
        { title: "Blueprints", url: "/architect#blueprints", icon: Layers },
      ],
    },
    {
      label: "Collaboration",
      items: [
        { title: "Reviews", url: "/architect#reviews", icon: CheckSquare },
        { title: "Revisions", url: "/architect#revisions", icon: GitBranch },
        { title: "Documentation", url: "/architect#docs", icon: BookOpen },
        { title: "AI Design Assist", url: "/architect#ai", icon: Sparkles },
      ],
    },
  ],
};

const engineer: Workspace = {
  id: "engineer",
  name: "Engineer",
  shortName: "ENG",
  systemContext: "Engineering Operations",
  rootPath: "/engineer",
  accent: "text-amber-500",
  accentBg: "bg-amber-500",
  icon: Wrench,
  primaryAi: "Engineering Intelligence",
  primaryNotifications: "Inspection Alerts",
  primaryAction: { label: "New report", icon: ClipboardList },
  searchPlaceholder: "Search reports, drawings, inspections…",
  tabs: [
    { title: "Site Reports", url: "/engineer#reports", icon: ClipboardList },
    { title: "Technical Reviews", url: "/engineer#reviews", icon: FileSearch },
    { title: "Inspections", url: "/engineer#inspections", icon: ShieldCheck },
    { title: "Drawings", url: "/engineer#drawings", icon: Layers },
    { title: "Resources", url: "/engineer#resources", icon: CalendarRange },
  ],
  sidebar: [
    {
      label: "Field",
      items: [
        { title: "Engineering Dashboard", url: "/engineer#overview", icon: LayoutDashboard },
        { title: "Site Reports", url: "/engineer#reports", icon: ClipboardList },
        { title: "Inspections", url: "/engineer#inspections", icon: ShieldCheck },
      ],
    },
    {
      label: "Technical",
      items: [
        { title: "Technical Reviews", url: "/engineer#reviews", icon: FileSearch },
        { title: "Drawings", url: "/engineer#drawings", icon: Layers },
        { title: "Resources", url: "/engineer#resources", icon: CalendarRange },
        { title: "AI Analysis", url: "/engineer#ai", icon: Sparkles },
      ],
    },
  ],
};

const site: Workspace = {
  id: "site-personnel",
  name: "Site Personnel",
  shortName: "SITE",
  systemContext: "On-Site Operations",
  rootPath: "/site",
  accent: "text-orange-500",
  accentBg: "bg-orange-500",
  icon: HardHat,
  primaryAi: "Safety Intelligence",
  primaryNotifications: "Safety Alerts",
  primaryAction: { label: "Submit report", icon: ListChecks },
  searchPlaceholder: "Search tasks, equipment, reports…",
  tabs: [
    { title: "Assigned Tasks", url: "/site#tasks", icon: ListChecks },
    { title: "Attendance", url: "/site#attendance", icon: CalendarCheck },
    { title: "Daily Reports", url: "/site#reports", icon: ClipboardList },
    { title: "Equipment", url: "/site#equipment", icon: Truck },
    { title: "Safety", url: "/site#safety", icon: ShieldAlert },
  ],
  sidebar: [
    {
      label: "My Site",
      items: [
        { title: "Today", url: "/site#overview", icon: LayoutDashboard },
        { title: "Assigned Tasks", url: "/site#tasks", icon: ListChecks },
        { title: "Attendance", url: "/site#attendance", icon: CalendarCheck },
      ],
    },
    {
      label: "Operations",
      items: [
        { title: "Daily Reports", url: "/site#reports", icon: ClipboardList },
        { title: "Equipment", url: "/site#equipment", icon: Truck },
        { title: "Safety", url: "/site#safety", icon: ShieldAlert },
        { title: "Team Chat", url: "/site#chat", icon: MessageSquare },
      ],
    },
  ],
};

const consultant: Workspace = {
  id: "consultant",
  name: "Consultant",
  shortName: "CON",
  systemContext: "Advisory Workspace",
  rootPath: "/consultant",
  accent: "text-sky-500",
  accentBg: "bg-sky-500",
  icon: Building2,
  primaryAi: "Advisory Intelligence",
  primaryNotifications: "Review Queue",
  primaryAction: { label: "New review", icon: FileSearch },
  searchPlaceholder: "Search reviews, recommendations…",
  tabs: [
    { title: "Reviews", url: "/consultant#reviews", icon: FileSearch },
    { title: "Recommendations", url: "/consultant#recommendations", icon: Sparkles },
    { title: "Reports", url: "/consultant#reports", icon: FileBarChart2 },
    { title: "Approvals", url: "/consultant#approvals", icon: CheckSquare },
    { title: "Documents", url: "/consultant#documents", icon: Files },
  ],
  sidebar: [
    {
      label: "Advisory",
      items: [
        { title: "Overview", url: "/consultant#overview", icon: LayoutDashboard },
        { title: "Reviews", url: "/consultant#reviews", icon: FileSearch },
        { title: "Recommendations", url: "/consultant#recommendations", icon: Sparkles },
      ],
    },
    {
      label: "Output",
      items: [
        { title: "Reports", url: "/consultant#reports", icon: FileBarChart2 },
        { title: "Approvals", url: "/consultant#approvals", icon: CheckSquare },
        { title: "Documents", url: "/consultant#documents", icon: Files },
      ],
    },
  ],
};

export const WORKSPACES: Record<WorkspaceId, Workspace> = {
  "project-manager": pm,
  "human-resources": hr,
  finance,
  architect,
  engineer,
  "site-personnel": site,
  consultant,
};

export const WORKSPACE_LIST: Workspace[] = [
  pm,
  hr,
  finance,
  architect,
  engineer,
  site,
  consultant,
];

/** Map current pathname to a workspace. */
export function resolveWorkspace(pathname: string): Workspace {
  if (pathname.startsWith("/hr")) return hr;
  if (pathname.startsWith("/finance")) return finance;
  if (pathname.startsWith("/architect")) return architect;
  if (pathname.startsWith("/engineer")) return engineer;
  if (pathname.startsWith("/site")) return site;
  if (pathname.startsWith("/consultant")) return consultant;
  return pm;
}
