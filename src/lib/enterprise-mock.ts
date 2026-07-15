// Extended mock data for PM project sub-modules and HR sub-modules.
// In-memory only; matches existing pattern in src/lib/pm-data.ts and hr-data.ts.

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: "Todo" | "In Progress" | "Review" | "Done" | "Blocked";
  priority: "Low" | "Med" | "High" | "Critical";
  due: string;
  progress: number;
}

export const tasks: Task[] = [
  { id: "T-101", title: "Pour foundation slab — Zone A", assignee: "R. Chen", status: "In Progress", priority: "High", due: "May 22", progress: 60 },
  { id: "T-102", title: "Steel erection — Level 3", assignee: "M. Alvarez", status: "Todo", priority: "Critical", due: "May 25", progress: 0 },
  { id: "T-103", title: "MEP rough-in inspection", assignee: "K. Singh", status: "Review", priority: "High", due: "May 20", progress: 90 },
  { id: "T-104", title: "Curtain wall shop drawings", assignee: "S. Aquino", status: "Done", priority: "Med", due: "May 12", progress: 100 },
  { id: "T-105", title: "Fireproofing spec review", assignee: "J. Costa", status: "Blocked", priority: "High", due: "May 24", progress: 25 },
  { id: "T-106", title: "Site drainage remediation", assignee: "T. Okafor", status: "In Progress", priority: "Med", due: "May 28", progress: 40 },
];

export interface Milestone {
  id: string;
  name: string;
  phase: string;
  date: string;
  status: "Complete" | "On Track" | "At Risk" | "Slipping";
  owner: string;
}

export const milestones: Milestone[] = [
  { id: "M-01", name: "Site mobilization", phase: "Phase 1", date: "Jan 12, 2025", status: "Complete", owner: "M. Rivera" },
  { id: "M-02", name: "Foundation completion", phase: "Phase 1", date: "Mar 30, 2025", status: "Complete", owner: "R. Chen" },
  { id: "M-03", name: "Superstructure topping-out", phase: "Phase 2", date: "Aug 18, 2025", status: "On Track", owner: "M. Alvarez" },
  { id: "M-04", name: "Building envelope watertight", phase: "Phase 2", date: "Dec 05, 2025", status: "At Risk", owner: "S. Aquino" },
  { id: "M-05", name: "MEP substantial completion", phase: "Phase 3", date: "Mar 22, 2026", status: "On Track", owner: "K. Singh" },
  { id: "M-06", name: "Final commissioning", phase: "Phase 3", date: "Aug 01, 2026", status: "Slipping", owner: "J. Costa" },
];

export interface Risk {
  id: string;
  title: string;
  category: string;
  severity: "Low" | "Med" | "High" | "Critical";
  likelihood: "Low" | "Med" | "High";
  owner: string;
  status: "Open" | "Mitigating" | "Monitoring" | "Closed";
}

export const risks: Risk[] = [
  { id: "R-01", title: "Supplier delay — precast panels", category: "Supply Chain", severity: "High", likelihood: "Med", owner: "T. Okafor", status: "Mitigating" },
  { id: "R-02", title: "Weather window shrinking (monsoon)", category: "Weather", severity: "Med", likelihood: "High", owner: "M. Rivera", status: "Monitoring" },
  { id: "R-03", title: "Change order backlog >2 weeks", category: "Change Mgmt", severity: "High", likelihood: "High", owner: "J. Costa", status: "Open" },
  { id: "R-04", title: "Crane operator shortage", category: "Workforce", severity: "Critical", likelihood: "Med", owner: "K. Singh", status: "Mitigating" },
  { id: "R-05", title: "Permit re-inspection required", category: "Regulatory", severity: "Med", likelihood: "Med", owner: "S. Aquino", status: "Open" },
];

export interface Issue {
  id: string;
  title: string;
  reporter: string;
  severity: "Low" | "Med" | "High";
  status: "Open" | "In Review" | "Resolved" | "Wontfix";
  opened: string;
}

export const issues: Issue[] = [
  { id: "I-201", title: "Rebar spacing discrepancy Level 2", reporter: "R. Chen", severity: "High", status: "In Review", opened: "May 12" },
  { id: "I-202", title: "HVAC duct conflict with sprinkler", reporter: "K. Singh", severity: "Med", status: "Open", opened: "May 14" },
  { id: "I-203", title: "Missing weld tags — Column C7", reporter: "M. Alvarez", severity: "High", status: "Open", opened: "May 15" },
  { id: "I-204", title: "Slab surface finish rejection", reporter: "S. Aquino", severity: "Low", status: "Resolved", opened: "May 08" },
];

export interface QualityCheck {
  id: string;
  area: string;
  inspection: string;
  inspector: string;
  score: number;
  status: "Pass" | "Conditional" | "Fail";
  date: string;
}

export const qualityChecks: QualityCheck[] = [
  { id: "Q-01", area: "Zone A slab", inspection: "Concrete cure test", inspector: "R. Chen", score: 96, status: "Pass", date: "May 10" },
  { id: "Q-02", area: "Level 3 steel", inspection: "Weld visual", inspector: "M. Alvarez", score: 78, status: "Conditional", date: "May 14" },
  { id: "Q-03", area: "MEP shaft", inspection: "Duct pressure", inspector: "K. Singh", score: 92, status: "Pass", date: "May 16" },
  { id: "Q-04", area: "Curtain wall", inspection: "Anchor pull-out", inspector: "S. Aquino", score: 58, status: "Fail", date: "May 17" },
];

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "Deployed" | "Available" | "Maintenance" | "Reserved";
  site: string;
  operator?: string;
  utilization: number;
}

export const equipment: Equipment[] = [
  { id: "EQ-11", name: "Tower Crane TC-190", type: "Crane", status: "Deployed", site: "Westgate", operator: "R. Aliu", utilization: 82 },
  { id: "EQ-12", name: "Excavator CAT 349", type: "Earthmoving", status: "Deployed", site: "Harbor", operator: "M. Brooks", utilization: 68 },
  { id: "EQ-13", name: "Boom Lift JLG 60", type: "Access", status: "Available", site: "Yard", utilization: 0 },
  { id: "EQ-14", name: "Concrete Pump PM-70", type: "Concrete", status: "Maintenance", site: "Yard", utilization: 0 },
  { id: "EQ-15", name: "Rough Terrain Forklift", type: "Material", status: "Reserved", site: "Ridge", utilization: 34 },
];

export interface DailyLog {
  id: string;
  date: string;
  author: string;
  weather: string;
  headcount: number;
  hoursWorked: number;
  summary: string;
}

export const dailyLogs: DailyLog[] = [
  { id: "DL-0517", date: "May 17", author: "M. Rivera", weather: "Sunny 82°F", headcount: 142, hoursWorked: 1140, summary: "Pours completed in Zone A. Steel erection Level 3 in prep." },
  { id: "DL-0516", date: "May 16", author: "T. Okafor", weather: "Overcast 74°F", headcount: 128, hoursWorked: 1020, summary: "MEP rough-in inspection passed. Minor conflicts logged." },
  { id: "DL-0515", date: "May 15", author: "M. Rivera", weather: "Sunny 80°F", headcount: 136, hoursWorked: 1085, summary: "Rebar tie-off Zone B complete. Formwork prep." },
  { id: "DL-0514", date: "May 14", author: "K. Singh", weather: "Rain 68°F", headcount: 96, hoursWorked: 720, summary: "Weather delay 2h. Concrete cure test in progress." },
];

export interface TimelinePhase {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  critical: boolean;
}

export const timelinePhases: TimelinePhase[] = [
  { id: "P1", name: "Sitework & Excavation", start: "Jan '25", end: "Mar '25", progress: 100, critical: false },
  { id: "P2", name: "Foundations", start: "Feb '25", end: "May '25", progress: 100, critical: true },
  { id: "P3", name: "Superstructure", start: "May '25", end: "Nov '25", progress: 72, critical: true },
  { id: "P4", name: "Envelope", start: "Sep '25", end: "Feb '26", progress: 40, critical: false },
  { id: "P5", name: "MEP Rough-In", start: "Nov '25", end: "May '26", progress: 25, critical: true },
  { id: "P6", name: "Finishes", start: "Mar '26", end: "Jul '26", progress: 5, critical: false },
  { id: "P7", name: "Commissioning", start: "Jun '26", end: "Aug '26", progress: 0, critical: true },
];

// ============ HR ============

export interface LeaveRequest {
  id: string;
  employee: string;
  type: "Vacation" | "Sick" | "Personal" | "Bereavement" | "Parental";
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
}

export const leaveRequests: LeaveRequest[] = [
  { id: "LV-401", employee: "R. Chen", type: "Vacation", from: "Jun 10", to: "Jun 14", days: 5, status: "Pending" },
  { id: "LV-402", employee: "M. Alvarez", type: "Sick", from: "May 18", to: "May 19", days: 2, status: "Approved" },
  { id: "LV-403", employee: "J. Costa", type: "Parental", from: "Jul 01", to: "Aug 30", days: 42, status: "Pending" },
  { id: "LV-404", employee: "S. Aquino", type: "Personal", from: "May 24", to: "May 24", days: 1, status: "Approved" },
  { id: "LV-405", employee: "T. Okafor", type: "Bereavement", from: "May 12", to: "May 15", days: 4, status: "Approved" },
];

export interface Shift {
  id: string;
  employee: string;
  role: string;
  date: string;
  start: string;
  end: string;
  site: string;
}

export const shifts: Shift[] = [
  { id: "SH-1", employee: "R. Chen", role: "Foreman", date: "May 20", start: "06:00", end: "16:00", site: "Westgate" },
  { id: "SH-2", employee: "M. Alvarez", role: "Steel Lead", date: "May 20", start: "06:00", end: "18:00", site: "Westgate" },
  { id: "SH-3", employee: "K. Singh", role: "MEP", date: "May 20", start: "07:00", end: "17:00", site: "Harbor" },
  { id: "SH-4", employee: "J. Costa", role: "Safety", date: "May 21", start: "05:00", end: "15:00", site: "Ridge" },
  { id: "SH-5", employee: "S. Aquino", role: "Reviewer", date: "May 21", start: "08:00", end: "17:00", site: "Office" },
];

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  status: "Open" | "Interviewing" | "Offer" | "Closed";
  applicants: number;
  posted: string;
}

export const jobPostings: JobPosting[] = [
  { id: "JP-11", title: "Senior Structural Engineer", department: "Engineering", location: "Phoenix, AZ", status: "Interviewing", applicants: 34, posted: "Apr 22" },
  { id: "JP-12", title: "Site Safety Officer", department: "Safety", location: "Long Beach, CA", status: "Open", applicants: 12, posted: "May 05" },
  { id: "JP-13", title: "Project Accountant", department: "Finance", location: "Remote", status: "Offer", applicants: 41, posted: "Mar 18" },
  { id: "JP-14", title: "Crane Operator (NCCCO)", department: "Field Ops", location: "Denver, CO", status: "Open", applicants: 9, posted: "May 12" },
];

export interface Application {
  id: string;
  candidate: string;
  posting: string;
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
  rating: number;
  submitted: string;
}

export const applications: Application[] = [
  { id: "AP-501", candidate: "Nadia Ford", posting: "Senior Structural Engineer", stage: "Interview", rating: 4.6, submitted: "May 02" },
  { id: "AP-502", candidate: "Elias Marquez", posting: "Site Safety Officer", stage: "Screening", rating: 4.1, submitted: "May 08" },
  { id: "AP-503", candidate: "Priya Sharma", posting: "Project Accountant", stage: "Offer", rating: 4.8, submitted: "Apr 20" },
  { id: "AP-504", candidate: "Devon Wright", posting: "Crane Operator (NCCCO)", stage: "Applied", rating: 3.9, submitted: "May 13" },
];

export interface Interview {
  id: string;
  candidate: string;
  posting: string;
  when: string;
  panel: string;
  format: "Onsite" | "Video" | "Phone";
}

export const interviews: Interview[] = [
  { id: "IV-9", candidate: "Nadia Ford", posting: "Senior Structural Engineer", when: "May 22 · 10:00", panel: "K. Singh, S. Aquino", format: "Video" },
  { id: "IV-10", candidate: "Priya Sharma", posting: "Project Accountant", when: "May 20 · 14:30", panel: "L. Park", format: "Onsite" },
  { id: "IV-11", candidate: "Elias Marquez", posting: "Site Safety Officer", when: "May 24 · 09:00", panel: "J. Costa", format: "Phone" },
];

export interface Review {
  id: string;
  employee: string;
  period: string;
  rating: number;
  status: "Draft" | "Submitted" | "Calibrated" | "Delivered";
  reviewer: string;
}

export const reviews: Review[] = [
  { id: "PR-01", employee: "R. Chen", period: "H1 2026", rating: 4.5, status: "Delivered", reviewer: "M. Rivera" },
  { id: "PR-02", employee: "M. Alvarez", period: "H1 2026", rating: 4.2, status: "Calibrated", reviewer: "M. Rivera" },
  { id: "PR-03", employee: "K. Singh", period: "H1 2026", rating: 4.7, status: "Submitted", reviewer: "T. Okafor" },
  { id: "PR-04", employee: "J. Costa", period: "H1 2026", rating: 3.8, status: "Draft", reviewer: "M. Rivera" },
];

export interface Training {
  id: string;
  program: string;
  category: string;
  enrolled: number;
  completed: number;
  next: string;
  required: boolean;
}

export const trainings: Training[] = [
  { id: "TR-1", program: "OSHA 30", category: "Safety", enrolled: 42, completed: 31, next: "May 28", required: true },
  { id: "TR-2", program: "Confined Space Entry", category: "Safety", enrolled: 18, completed: 12, next: "Jun 03", required: true },
  { id: "TR-3", program: "PMP Prep", category: "Leadership", enrolled: 8, completed: 3, next: "Jun 10", required: false },
  { id: "TR-4", program: "BIM 360 Basics", category: "Tech", enrolled: 24, completed: 22, next: "May 30", required: false },
];

export interface Benefit {
  id: string;
  employee: string;
  plan: string;
  tier: string;
  monthly: number;
  status: "Active" | "Pending" | "Waived";
}

export const benefits: Benefit[] = [
  { id: "BN-1", employee: "R. Chen", plan: "Medical PPO", tier: "Family", monthly: 640, status: "Active" },
  { id: "BN-2", employee: "M. Alvarez", plan: "Medical HMO", tier: "Employee", monthly: 220, status: "Active" },
  { id: "BN-3", employee: "K. Singh", plan: "Dental+Vision", tier: "Employee+1", monthly: 88, status: "Active" },
  { id: "BN-4", employee: "J. Costa", plan: "401(k) Match", tier: "6%", monthly: 0, status: "Active" },
  { id: "BN-5", employee: "S. Aquino", plan: "Medical PPO", tier: "Family", monthly: 640, status: "Pending" },
];

export interface Deduction {
  id: string;
  employee: string;
  type: string;
  amount: number;
  frequency: "Weekly" | "Bi-weekly" | "Monthly";
  active: boolean;
}

export const deductions: Deduction[] = [
  { id: "DD-1", employee: "R. Chen", type: "401(k) 6%", amount: 285, frequency: "Bi-weekly", active: true },
  { id: "DD-2", employee: "M. Alvarez", type: "Health premium", amount: 95, frequency: "Weekly", active: true },
  { id: "DD-3", employee: "K. Singh", type: "Union dues", amount: 42, frequency: "Weekly", active: true },
  { id: "DD-4", employee: "J. Costa", type: "Garnishment", amount: 150, frequency: "Bi-weekly", active: true },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: "Task" | "Approval" | "Alert" | "System";
  when: string;
  read: boolean;
}

export const notifications: Notification[] = [
  { id: "N-1", title: "Approval requested: Change Order CO-118", body: "T. Okafor submitted a change order for Harbor Logistics Hub.", category: "Approval", when: "12m ago", read: false },
  { id: "N-2", title: "Risk escalated: Crane operator shortage", body: "AI Intelligence flagged an increase in likelihood.", category: "Alert", when: "48m ago", read: false },
  { id: "N-3", title: "Daily log posted — DL-0517", body: "M. Rivera published the Westgate daily log.", category: "Task", when: "3h ago", read: true },
  { id: "N-4", title: "System: nightly backup complete", body: "All workspaces synced.", category: "System", when: "9h ago", read: true },
];
