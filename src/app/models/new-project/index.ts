// Mock reference data & types for the New Project wizard.
// Prepared for future PERN integration: POST /api/projects

export type Priority = "Low" | "Medium" | "High" | "Critical";
export type ProjectStatus = "Draft" | "Planning" | "Approved" | "Active";

export interface NewProjectDraft {
  // Step 1
  name: string;
  code: string;
  client: string;
  projectType: string;
  category: string;
  description: string;
  priority: Priority;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  // Step 2
  address: string;
  province: string;
  city: string;
  barangay: string;
  zipCode: string;
  latitude?: string;
  longitude?: string;
  siteNotes: string;
  // Step 3
  budget: number;
  currency: string;
  costCenter: string;
  paymentSchedule: string;
  fundingSource: string;
  initialAllocation: number;
  contingency: number;
  taxCategory: string;
  // Step 4
  projectManager: string;
  architect: string;
  leadEngineer: string;
  hrRepresentative: string;
  financeOfficer: string;
  siteSupervisor: string;
  workforceSize: number;
  requiredSkills: string[];
  estimatedLaborCost: number;
  // Step 5
  documents: UploadedDoc[];
}

export interface UploadedDoc {
  id: string;
  name: string;
  category:
    | "Contract"
    | "Proposal"
    | "Blueprint"
    | "Scope of Work"
    | "Permit"
    | "Supporting";
  size: number; // bytes
  progress: number; // 0..100
}

export const PROJECT_TYPES = [
  "Commercial Building",
  "Residential Complex",
  "Healthcare Facility",
  "Infrastructure",
  "Industrial Plant",
  "Renewable Energy",
  "Public Works",
];

export const CATEGORIES = [
  "New Construction",
  "Renovation",
  "Expansion",
  "Restoration",
  "Fit-out",
  "Demolition",
];

export const CURRENCIES = [
  { code: "PHP", label: "Philippine Peso (PHP)" },
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
];

export const PAYMENT_SCHEDULES = [
  "Milestone-based",
  "Monthly progress billing",
  "Weekly draw",
  "Lump sum on completion",
];

export const FUNDING_SOURCES = [
  "Client Direct",
  "Bank Loan",
  "Public Grant",
  "Joint Venture",
  "Internal Capital",
];

export const TAX_CATEGORIES = ["VAT 12%", "Zero-rated", "Exempt", "Withholding"];

export const CONTRACT_TYPES = [
  "Lump Sum",
  "GMP (Guaranteed Max Price)",
  "Cost Plus",
  "Unit Price",
  "Design-Build",
];

export const SKILL_OPTIONS = [
  "Structural",
  "MEP",
  "Concrete",
  "Steelwork",
  "Finishing",
  "Roofing",
  "Excavation",
  "Surveying",
  "Safety",
];

export const TEAM_MEMBERS = [
  { id: "mrivera", name: "Maya Rivera", role: "Project Manager" },
  { id: "tokafor", name: "Tomi Okafor", role: "Project Manager" },
  { id: "saquino", name: "Sara Aquino", role: "Project Manager" },
  { id: "ksingh", name: "Karan Singh", role: "Lead Engineer" },
  { id: "lpark", name: "Lena Park", role: "Architect" },
  { id: "jcosta", name: "Julio Costa", role: "Site Supervisor" },
  { id: "achen", name: "Anna Chen", role: "Finance Officer" },
  { id: "rmartin", name: "Ricardo Martin", role: "HR Representative" },
  { id: "eosei", name: "Efe Osei", role: "Architect" },
  { id: "bnguyen", name: "Bao Nguyen", role: "Site Supervisor" },
];

export const PROVINCES = [
  "Metro Manila",
  "Cebu",
  "Davao del Sur",
  "Pampanga",
  "Bulacan",
  "Cavite",
  "Laguna",
  "Iloilo",
];

export const emptyDraft: NewProjectDraft = {
  name: "",
  code: "",
  client: "",
  projectType: "",
  category: "",
  description: "",
  priority: "Medium",
  status: "Draft",
  startDate: "",
  endDate: "",
  address: "",
  province: "",
  city: "",
  barangay: "",
  zipCode: "",
  siteNotes: "",
  budget: 0,
  currency: "PHP",
  costCenter: "",
  paymentSchedule: "",
  fundingSource: "",
  initialAllocation: 0,
  contingency: 0,
  taxCategory: "VAT 12%",
  projectManager: "",
  architect: "",
  leadEngineer: "",
  hrRepresentative: "",
  financeOfficer: "",
  siteSupervisor: "",
  workforceSize: 0,
  requiredSkills: [],
  estimatedLaborCost: 0,
  documents: [],
};

export function autoGenerateProjectCode(name: string): string {
  const slug = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const year = new Date().getFullYear();
  const seq = Math.floor(100 + Math.random() * 900);
  return `${slug || "PRJ"}-${year}-${seq}`;
}
