// Shared mock data for the HR module.
export type HRStatusTone = "success" | "info" | "warning" | "destructive" | "muted" | "ai";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: "Field Ops" | "Engineering" | "Architecture" | "Finance" | "Admin" | "Safety";
  status: "Active" | "On Leave" | "Suspended" | "Archived";
  site: string;
  hiredOn: string;
  attendanceRate: number; // %
  performance: number; // 1-5
  hourlyRate: number;
}

export const employees: Employee[] = [
  { id: "EC-1042", name: "Maya Rivera", initials: "MR", role: "Project Manager", department: "Admin", status: "Active", site: "Phoenix HQ", hiredOn: "Mar 12, 2021", attendanceRate: 98, performance: 4.8, hourlyRate: 62 },
  { id: "EC-1108", name: "Daniel Okafor", initials: "DO", role: "Site Foreman", department: "Field Ops", status: "Active", site: "Westgate Tower", hiredOn: "Jul 02, 2019", attendanceRate: 96, performance: 4.6, hourlyRate: 48 },
  { id: "EC-1183", name: "Priya Shah", initials: "PS", role: "Structural Engineer", department: "Engineering", status: "Active", site: "Harborline Hub", hiredOn: "Sep 14, 2022", attendanceRate: 99, performance: 4.9, hourlyRate: 55 },
  { id: "EC-1207", name: "Jonas Berger", initials: "JB", role: "Architect II", department: "Architecture", status: "On Leave", site: "Phoenix HQ", hiredOn: "Feb 28, 2020", attendanceRate: 88, performance: 4.2, hourlyRate: 58 },
  { id: "EC-1255", name: "Adaeze Nwosu", initials: "AN", role: "Safety Officer", department: "Safety", status: "Active", site: "Harborline Hub", hiredOn: "Oct 18, 2023", attendanceRate: 97, performance: 4.5, hourlyRate: 44 },
  { id: "EC-1290", name: "Theo Martin", initials: "TM", role: "Equipment Operator", department: "Field Ops", status: "Active", site: "Northgate Plaza", hiredOn: "Apr 05, 2024", attendanceRate: 91, performance: 3.9, hourlyRate: 38 },
  { id: "EC-1322", name: "Linnea Holm", initials: "LH", role: "Payroll Analyst", department: "Finance", status: "Active", site: "Phoenix HQ", hiredOn: "Jan 22, 2023", attendanceRate: 99, performance: 4.7, hourlyRate: 46 },
  { id: "EC-1411", name: "Marcus Bell", initials: "MB", role: "Laborer", department: "Field Ops", status: "Suspended", site: "Westgate Tower", hiredOn: "Nov 30, 2024", attendanceRate: 72, performance: 2.8, hourlyRate: 28 },
];

export interface AttendanceLog {
  empId: string;
  name: string;
  initials: string;
  site: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  geofence: "Inside" | "Edge" | "Outside";
  photo: "Verified" | "Pending" | "Failed";
  status: "Verified" | "Flagged" | "Pending";
}

export const attendanceLogs: AttendanceLog[] = [
  { empId: "EC-1108", name: "Daniel Okafor", initials: "DO", site: "Westgate Tower", clockIn: "06:54", clockOut: "16:08", hours: 9.2, geofence: "Inside", photo: "Verified", status: "Verified" },
  { empId: "EC-1183", name: "Priya Shah", initials: "PS", site: "Harborline Hub", clockIn: "07:02", clockOut: "17:11", hours: 10.1, geofence: "Inside", photo: "Verified", status: "Verified" },
  { empId: "EC-1255", name: "Adaeze Nwosu", initials: "AN", site: "Harborline Hub", clockIn: "07:18", clockOut: "16:30", hours: 9.2, geofence: "Edge", photo: "Verified", status: "Flagged" },
  { empId: "EC-1290", name: "Theo Martin", initials: "TM", site: "Northgate Plaza", clockIn: "08:24", clockOut: "16:02", hours: 7.6, geofence: "Inside", photo: "Pending", status: "Pending" },
  { empId: "EC-1411", name: "Marcus Bell", initials: "MB", site: "Westgate Tower", clockIn: "—", clockOut: "—", hours: 0, geofence: "Outside", photo: "Failed", status: "Flagged" },
  { empId: "EC-1042", name: "Maya Rivera", initials: "MR", site: "Phoenix HQ", clockIn: "08:01", clockOut: "18:22", hours: 10.3, geofence: "Inside", photo: "Verified", status: "Verified" },
];

export interface PayrollRow {
  empId: string;
  name: string;
  initials: string;
  role: string;
  hours: number;
  overtime: number;
  gross: number;
  deductions: number;
  net: number;
  status: "Approved" | "Pending" | "Review";
}

export const payrollRows: PayrollRow[] = [
  { empId: "EC-1042", name: "Maya Rivera", initials: "MR", role: "Project Manager", hours: 168, overtime: 4, gross: 10792, deductions: 2158, net: 8634, status: "Approved" },
  { empId: "EC-1108", name: "Daniel Okafor", initials: "DO", role: "Site Foreman", hours: 176, overtime: 12, gross: 9312, deductions: 1862, net: 7450, status: "Pending" },
  { empId: "EC-1183", name: "Priya Shah", initials: "PS", role: "Structural Engineer", hours: 172, overtime: 6, gross: 9956, deductions: 1991, net: 7965, status: "Approved" },
  { empId: "EC-1207", name: "Jonas Berger", initials: "JB", role: "Architect II", hours: 96, overtime: 0, gross: 5568, deductions: 1114, net: 4454, status: "Review" },
  { empId: "EC-1255", name: "Adaeze Nwosu", initials: "AN", role: "Safety Officer", hours: 168, overtime: 2, gross: 7480, deductions: 1496, net: 5984, status: "Pending" },
  { empId: "EC-1290", name: "Theo Martin", initials: "TM", role: "Equipment Operator", hours: 160, overtime: 8, gross: 6536, deductions: 1307, net: 5229, status: "Pending" },
];

export const departments = [
  { name: "Field Ops", count: 312, color: "bg-primary" },
  { name: "Engineering", count: 88, color: "bg-info" },
  { name: "Architecture", count: 42, color: "bg-chart-4" },
  { name: "Finance", count: 26, color: "bg-warning" },
  { name: "Safety", count: 31, color: "bg-success" },
  { name: "Admin", count: 19, color: "bg-muted-foreground" },
];

export const attendanceWeek = [
  { day: "Mon", present: 478, late: 22, absent: 18 },
  { day: "Tue", present: 491, late: 14, absent: 13 },
  { day: "Wed", present: 482, late: 19, absent: 17 },
  { day: "Thu", present: 469, late: 28, absent: 21 },
  { day: "Fri", present: 458, late: 31, absent: 29 },
  { day: "Sat", present: 312, late: 11, absent: 9 },
];

export const aiInsights = [
  {
    title: "Absenteeism spike forecast — Westgate Tower",
    detail:
      "Crew rotation conflicts with regional public holiday next Thursday. Expect ~14% drop in field attendance unless shift swaps are issued.",
    confidence: 0.86,
    impact: "Schedule slip risk on slab pour milestone",
    action: "Open shift swap workflow",
  },
  {
    title: "Overtime trending above policy ceiling",
    detail:
      "Field Ops projected to exceed the 12% overtime cap this pay period. Three foremen account for 64% of overage.",
    confidence: 0.79,
    impact: "+$38,400 unplanned labor cost",
    action: "Review crew rebalancing",
  },
  {
    title: "Retention risk — 6 high performers",
    detail:
      "Sentiment from exit surveys and assignment patterns suggests elevated attrition probability over the next 60 days.",
    confidence: 0.72,
    impact: "Loss of ~18 yrs combined site tenure",
    action: "Trigger retention conversation",
  },
];
