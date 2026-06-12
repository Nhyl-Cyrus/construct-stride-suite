// Shared mock data for Project Manager module pages.

export type StatusTone = "success" | "info" | "warning" | "destructive" | "muted";

export interface Project {
  code: string;
  name: string;
  client: string;
  pm: string;
  status: string;
  statusTone: StatusTone;
  progress: number;
  budget: number; // % of plan used
  budgetTotal: number; // USD millions
  due: string;
  risk: "Low" | "Medium" | "High";
  location: string;
  workforce: number;
  startDate: string;
}

export const projects: Project[] = [
  {
    code: "WMT-204",
    name: "Westgate Medical Tower",
    client: "Westgate Health Network",
    pm: "M. Rivera",
    status: "In Progress",
    statusTone: "info",
    progress: 68,
    budget: 92,
    budgetTotal: 84.5,
    due: "Aug 14, 2026",
    risk: "Low",
    location: "Phoenix, AZ",
    workforce: 142,
    startDate: "Jan 12, 2025",
  },
  {
    code: "HLH-118",
    name: "Harbor Logistics Hub",
    client: "Pacific Freight Co.",
    pm: "T. Okafor",
    status: "Delayed",
    statusTone: "destructive",
    progress: 41,
    budget: 104,
    budgetTotal: 38.2,
    due: "Jun 30, 2026",
    risk: "High",
    location: "Long Beach, CA",
    workforce: 88,
    startDate: "Mar 03, 2025",
  },
  {
    code: "RCC-077",
    name: "Riverside Civic Center",
    client: "City of Riverside",
    pm: "S. Aquino",
    status: "Under Review",
    statusTone: "warning",
    progress: 55,
    budget: 71,
    budgetTotal: 22.0,
    due: "Sep 02, 2026",
    risk: "Medium",
    location: "Riverside, CA",
    workforce: 64,
    startDate: "Aug 20, 2024",
  },
  {
    code: "NRT-330",
    name: "North Ridge Terminal 2",
    client: "NRT Aviation Authority",
    pm: "K. Singh",
    status: "On Track",
    statusTone: "success",
    progress: 82,
    budget: 78,
    budgetTotal: 156.0,
    due: "Jul 21, 2026",
    risk: "Low",
    location: "Denver, CO",
    workforce: 312,
    startDate: "Feb 05, 2023",
  },
  {
    code: "ESF-051",
    name: "Eastfield Solar Farm",
    client: "Helios Energy Group",
    pm: "L. Park",
    status: "Planning",
    statusTone: "muted",
    progress: 12,
    budget: 18,
    budgetTotal: 64.0,
    due: "Nov 10, 2027",
    risk: "Low",
    location: "Bakersfield, CA",
    workforce: 24,
    startDate: "Apr 18, 2026",
  },
  {
    code: "BRC-409",
    name: "Brookline Residential Phase III",
    client: "Brookline Homes LLC",
    pm: "J. Costa",
    status: "On Track",
    statusTone: "success",
    progress: 47,
    budget: 53,
    budgetTotal: 18.4,
    due: "Dec 14, 2026",
    risk: "Low",
    location: "Boston, MA",
    workforce: 76,
    startDate: "Sep 11, 2025",
  },
];

export const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export const riskClasses: Record<Project["risk"], string> = {
  High: "text-destructive",
  Medium: "text-warning-foreground",
  Low: "text-muted-foreground",
};
