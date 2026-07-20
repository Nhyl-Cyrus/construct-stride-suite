// Architect workspace domain model — types, mock fixtures, reference lists.
// No React, no I/O. Consumed by repositories, services, controllers, views.

export type Discipline =
  | "Architectural"
  | "Structural"
  | "MEP"
  | "Interior"
  | "Landscape"
  | "Civil";

export type DesignStatus =
  | "Draft"
  | "In Review"
  | "Revision Needed"
  | "Approved"
  | "Archived";

export type ReviewStatus = "Pending" | "In Progress" | "Approved" | "Rejected" | "Changes Requested";
export type ApprovalStatus = "Not Submitted" | "Awaiting" | "Approved" | "Rejected";

export type DesignCategory =
  | "New Construction"
  | "Renovation"
  | "Fit-out"
  | "Extension"
  | "Restoration";

export type ConstructionPhase =
  | "Concept"
  | "Schematic"
  | "Design Development"
  | "Construction Documents"
  | "Construction Admin"
  | "As-Built";

export interface Design {
  id: string;
  code: string;
  name: string;
  project: string;
  projectId: string;
  discipline: Discipline;
  category: DesignCategory;
  phase: ConstructionPhase;
  building?: string;
  floor?: string;
  zone?: string;
  client?: string;
  status: DesignStatus;
  reviewStatus: ReviewStatus;
  approvalStatus: ApprovalStatus;
  version: string;
  revision: number;
  leadArchitect: string;
  collaborators: string[];
  updatedAt: string;
  createdAt: string;
  description: string;
  aiConfidence: number; // 0-100
  aiCompleteness: number; // 0-100
  fileCount: number;
  commentCount: number;
  thumbnail?: string;
}

export interface Blueprint {
  id: string;
  drawingNumber: string;
  title: string;
  designId?: string;
  discipline: Discipline;
  scale: string;
  revision: string;
  author: string;
  status: "Current" | "Superseded" | "Draft";
  approval: ApprovalStatus;
  issueDate: string;
  latestRevisionDate: string;
  fileType: "DWG" | "DXF" | "PDF" | "RVT" | "IFC" | "IMG";
  sizeKb: number;
  folder: string;
  tags: string[];
  pinned?: boolean;
  favorite?: boolean;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: string;
  createdAt: string;
  body: string;
  resolved: boolean;
  mentions?: string[];
}

export interface Review {
  id: string;
  code: string;
  designId: string;
  designName: string;
  discipline: Discipline;
  status: ReviewStatus;
  priority: "Low" | "Medium" | "High" | "Critical";
  requestedBy: string;
  reviewers: string[];
  dueDate: string;
  submittedAt: string;
  completedAt?: string;
  checklist: { id: string; label: string; passed: boolean }[];
  comments: ReviewComment[];
  overdue: boolean;
}

export interface Revision {
  id: string;
  code: string;
  designId: string;
  designName: string;
  parentVersion: string;
  version: string;
  revisionNumber: number;
  reason: string;
  changeSummary: string;
  affectedSheets: string[];
  status: "Draft" | "Submitted" | "Approved" | "Rejected" | "Merged" | "Archived";
  createdBy: string;
  createdAt: string;
  approvedAt?: string;
  reviewerNotes?: string;
}

export type DocumentCategory =
  | "Specifications"
  | "Material Schedule"
  | "Technical"
  | "Compliance"
  | "Building Codes"
  | "Permits"
  | "Inspection"
  | "Site Instructions"
  | "As-Built"
  | "Meeting Minutes"
  | "RFI"
  | "Submittal";

export interface DesignDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  version: string;
  status: "Draft" | "Approved" | "Archived" | "Superseded";
  owner: string;
  updatedAt: string;
  fileType: string;
  sizeKb: number;
  linkedDesign?: string;
}

export type AiPanelKey =
  | "validation"
  | "conflicts"
  | "compliance"
  | "materials"
  | "accessibility"
  | "space"
  | "cost"
  | "sustainability"
  | "risk";

export interface AiRecommendation {
  id: string;
  panel: AiPanelKey;
  title: string;
  summary: string;
  explanation: string;
  confidence: number;
  impact: "Low" | "Medium" | "High" | "Critical";
  metrics: { label: string; value: string }[];
  actions: string[];
}

// ---------- Reference lists ----------

export const DISCIPLINES: Discipline[] = [
  "Architectural",
  "Structural",
  "MEP",
  "Interior",
  "Landscape",
  "Civil",
];

export const DESIGN_CATEGORIES: DesignCategory[] = [
  "New Construction",
  "Renovation",
  "Fit-out",
  "Extension",
  "Restoration",
];

export const PHASES: ConstructionPhase[] = [
  "Concept",
  "Schematic",
  "Design Development",
  "Construction Documents",
  "Construction Admin",
  "As-Built",
];

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "Specifications",
  "Material Schedule",
  "Technical",
  "Compliance",
  "Building Codes",
  "Permits",
  "Inspection",
  "Site Instructions",
  "As-Built",
  "Meeting Minutes",
  "RFI",
  "Submittal",
];

export const ARCHITECT_PROJECTS = [
  { id: "prj-01", name: "Westgate Tower" },
  { id: "prj-02", name: "Harborline Hub" },
  { id: "prj-03", name: "Northgate Plaza" },
  { id: "prj-04", name: "Phoenix HQ" },
  { id: "prj-05", name: "Skyline Residences" },
];

export const ARCHITECT_PEOPLE = [
  { id: "u-01", name: "Amelia Cruz", role: "Lead Architect" },
  { id: "u-02", name: "Marco Delgado", role: "Structural Engineer" },
  { id: "u-03", name: "Sasha Lin", role: "MEP Engineer" },
  { id: "u-04", name: "Ravi Patel", role: "Project Manager" },
  { id: "u-05", name: "Elena Reyes", role: "Consultant" },
  { id: "u-06", name: "Diego Santos", role: "Interior Architect" },
  { id: "u-07", name: "Naomi Tan", role: "Client Liaison" },
];

export const ACCEPTED_FILE_EXTENSIONS = [
  ".dwg",
  ".dxf",
  ".pdf",
  ".rvt",
  ".ifc",
  ".png",
  ".jpg",
  ".jpeg",
  ".zip",
  ".docx",
];

// ---------- Mock fixtures ----------

export const MOCK_DESIGNS: Design[] = [
  {
    id: "des-001",
    code: "WGT-A-014",
    name: "Westgate Tower · Floor 14 Plan",
    project: "Westgate Tower",
    projectId: "prj-01",
    discipline: "Architectural",
    category: "New Construction",
    phase: "Construction Documents",
    building: "Tower A",
    floor: "14",
    zone: "North",
    client: "Westgate Holdings",
    status: "In Review",
    reviewStatus: "In Progress",
    approvalStatus: "Awaiting",
    version: "v3.2",
    revision: 4,
    leadArchitect: "Amelia Cruz",
    collaborators: ["Marco Delgado", "Sasha Lin"],
    updatedAt: "2025-11-18T09:12:00Z",
    createdAt: "2025-08-01T09:00:00Z",
    description:
      "Typical floor plan for levels 12–16 including HVAC coordination and structural updates.",
    aiConfidence: 82,
    aiCompleteness: 91,
    fileCount: 18,
    commentCount: 12,
  },
  {
    id: "des-002",
    code: "HRB-A-002",
    name: "Harborline Hub · Atrium Elevation",
    project: "Harborline Hub",
    projectId: "prj-02",
    discipline: "Architectural",
    category: "New Construction",
    phase: "Design Development",
    building: "Central Atrium",
    client: "Harborline Group",
    status: "Approved",
    reviewStatus: "Approved",
    approvalStatus: "Approved",
    version: "v2.1",
    revision: 3,
    leadArchitect: "Diego Santos",
    collaborators: ["Elena Reyes"],
    updatedAt: "2025-11-14T14:22:00Z",
    createdAt: "2025-07-12T09:00:00Z",
    description: "Glazed atrium elevation with revised sunshade fins.",
    aiConfidence: 94,
    aiCompleteness: 98,
    fileCount: 11,
    commentCount: 3,
  },
  {
    id: "des-003",
    code: "NGP-A-007",
    name: "Northgate Plaza · Facade Panels",
    project: "Northgate Plaza",
    projectId: "prj-03",
    discipline: "Architectural",
    category: "Renovation",
    phase: "Schematic",
    client: "Northgate Retail",
    status: "Draft",
    reviewStatus: "Pending",
    approvalStatus: "Not Submitted",
    version: "v0.4",
    revision: 1,
    leadArchitect: "Amelia Cruz",
    collaborators: [],
    updatedAt: "2025-11-19T11:00:00Z",
    createdAt: "2025-10-02T10:00:00Z",
    description: "Perforated aluminium facade study with three material options.",
    aiConfidence: 67,
    aiCompleteness: 54,
    fileCount: 6,
    commentCount: 0,
  },
  {
    id: "des-004",
    code: "PHX-A-010",
    name: "Phoenix HQ · Lobby Redesign",
    project: "Phoenix HQ",
    projectId: "prj-04",
    discipline: "Interior",
    category: "Fit-out",
    phase: "Construction Documents",
    building: "HQ",
    floor: "G",
    client: "Phoenix Ventures",
    status: "Revision Needed",
    reviewStatus: "Changes Requested",
    approvalStatus: "Awaiting",
    version: "v4.0",
    revision: 5,
    leadArchitect: "Diego Santos",
    collaborators: ["Naomi Tan", "Elena Reyes"],
    updatedAt: "2025-11-20T08:41:00Z",
    createdAt: "2025-06-18T09:00:00Z",
    description: "Lobby wayfinding and reception desk revised per client feedback.",
    aiConfidence: 71,
    aiCompleteness: 78,
    fileCount: 14,
    commentCount: 21,
  },
  {
    id: "des-005",
    code: "SKY-S-001",
    name: "Skyline Residences · Structural Grid",
    project: "Skyline Residences",
    projectId: "prj-05",
    discipline: "Structural",
    category: "New Construction",
    phase: "Design Development",
    client: "Skyline Realty",
    status: "In Review",
    reviewStatus: "Pending",
    approvalStatus: "Awaiting",
    version: "v1.3",
    revision: 2,
    leadArchitect: "Marco Delgado",
    collaborators: ["Amelia Cruz"],
    updatedAt: "2025-11-17T13:10:00Z",
    createdAt: "2025-09-11T09:00:00Z",
    description: "Column grid rationalisation for tower typical floors.",
    aiConfidence: 88,
    aiCompleteness: 85,
    fileCount: 9,
    commentCount: 4,
  },
];

export const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: "bp-001",
    drawingNumber: "A-101",
    title: "Ground Floor Plan",
    designId: "des-001",
    discipline: "Architectural",
    scale: "1:100",
    revision: "C",
    author: "Amelia Cruz",
    status: "Current",
    approval: "Approved",
    issueDate: "2025-09-01",
    latestRevisionDate: "2025-11-10",
    fileType: "DWG",
    sizeKb: 3421,
    folder: "Westgate Tower / Architectural",
    tags: ["Plan", "Level 00"],
    pinned: true,
    favorite: true,
  },
  {
    id: "bp-002",
    drawingNumber: "A-201",
    title: "North Elevation",
    designId: "des-002",
    discipline: "Architectural",
    scale: "1:200",
    revision: "B",
    author: "Diego Santos",
    status: "Current",
    approval: "Approved",
    issueDate: "2025-08-15",
    latestRevisionDate: "2025-11-05",
    fileType: "PDF",
    sizeKb: 1810,
    folder: "Harborline Hub / Elevations",
    tags: ["Elevation", "Facade"],
  },
  {
    id: "bp-003",
    drawingNumber: "S-301",
    title: "Column Schedule",
    designId: "des-005",
    discipline: "Structural",
    scale: "1:50",
    revision: "A",
    author: "Marco Delgado",
    status: "Draft",
    approval: "Awaiting",
    issueDate: "2025-11-01",
    latestRevisionDate: "2025-11-18",
    fileType: "DWG",
    sizeKb: 2510,
    folder: "Skyline Residences / Structural",
    tags: ["Structure", "Schedule"],
    favorite: true,
  },
  {
    id: "bp-004",
    drawingNumber: "M-401",
    title: "HVAC Distribution",
    discipline: "MEP",
    scale: "1:100",
    revision: "D",
    author: "Sasha Lin",
    status: "Superseded",
    approval: "Approved",
    issueDate: "2025-06-10",
    latestRevisionDate: "2025-10-30",
    fileType: "PDF",
    sizeKb: 4102,
    folder: "Westgate Tower / MEP",
    tags: ["HVAC", "Level 14"],
  },
  {
    id: "bp-005",
    drawingNumber: "I-501",
    title: "Lobby Reflected Ceiling",
    designId: "des-004",
    discipline: "Interior",
    scale: "1:50",
    revision: "B",
    author: "Diego Santos",
    status: "Current",
    approval: "Awaiting",
    issueDate: "2025-10-08",
    latestRevisionDate: "2025-11-19",
    fileType: "DWG",
    sizeKb: 2210,
    folder: "Phoenix HQ / Interior",
    tags: ["Ceiling", "Lobby"],
    pinned: true,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-001",
    code: "R-2025-118",
    designId: "des-001",
    designName: "Westgate Tower · Floor 14 Plan",
    discipline: "Architectural",
    status: "In Progress",
    priority: "High",
    requestedBy: "Amelia Cruz",
    reviewers: ["Marco Delgado", "Elena Reyes"],
    dueDate: "2025-11-24",
    submittedAt: "2025-11-15T09:12:00Z",
    checklist: [
      { id: "c1", label: "Structural coordination", passed: true },
      { id: "c2", label: "MEP clash review", passed: false },
      { id: "c3", label: "Code compliance", passed: true },
      { id: "c4", label: "Client requirements", passed: false },
    ],
    comments: [
      {
        id: "cm1",
        author: "Marco Delgado",
        role: "Structural",
        createdAt: "2025-11-16T11:22:00Z",
        body: "Column offset on gridline E-7 needs to align with new beam layout.",
        resolved: false,
      },
      {
        id: "cm2",
        author: "Elena Reyes",
        role: "Consultant",
        createdAt: "2025-11-17T09:41:00Z",
        body: "Confirm egress width for the north stair core.",
        resolved: true,
      },
    ],
    overdue: false,
  },
  {
    id: "rev-002",
    code: "R-2025-117",
    designId: "des-004",
    designName: "Phoenix HQ · Lobby Redesign",
    discipline: "Interior",
    status: "Changes Requested",
    priority: "Critical",
    requestedBy: "Diego Santos",
    reviewers: ["Naomi Tan"],
    dueDate: "2025-11-19",
    submittedAt: "2025-11-11T14:00:00Z",
    checklist: [
      { id: "c1", label: "Client sign-off", passed: false },
      { id: "c2", label: "Material palette", passed: true },
    ],
    comments: [],
    overdue: true,
  },
  {
    id: "rev-003",
    code: "R-2025-115",
    designId: "des-002",
    designName: "Harborline Hub · Atrium Elevation",
    discipline: "Architectural",
    status: "Approved",
    priority: "Medium",
    requestedBy: "Diego Santos",
    reviewers: ["Elena Reyes"],
    dueDate: "2025-11-12",
    submittedAt: "2025-11-04T09:00:00Z",
    completedAt: "2025-11-11T15:00:00Z",
    checklist: [
      { id: "c1", label: "Facade coordination", passed: true },
      { id: "c2", label: "Sustainability", passed: true },
    ],
    comments: [],
    overdue: false,
  },
];

export const MOCK_REVISIONS: Revision[] = [
  {
    id: "rvn-001",
    code: "REV-WGT-014-04",
    designId: "des-001",
    designName: "Westgate Tower · Floor 14 Plan",
    parentVersion: "v3.1",
    version: "v3.2",
    revisionNumber: 4,
    reason: "MEP coordination update",
    changeSummary: "Adjusted HVAC routing on grid E-7; updated ceiling reflected plan.",
    affectedSheets: ["A-101", "A-102", "M-401"],
    status: "Submitted",
    createdBy: "Amelia Cruz",
    createdAt: "2025-11-18T09:12:00Z",
  },
  {
    id: "rvn-002",
    code: "REV-PHX-010-05",
    designId: "des-004",
    designName: "Phoenix HQ · Lobby Redesign",
    parentVersion: "v3.9",
    version: "v4.0",
    revisionNumber: 5,
    reason: "Client feedback",
    changeSummary: "Reception desk relocated; new signage strategy.",
    affectedSheets: ["I-501", "I-502"],
    status: "Draft",
    createdBy: "Diego Santos",
    createdAt: "2025-11-20T08:00:00Z",
  },
  {
    id: "rvn-003",
    code: "REV-HRB-002-03",
    designId: "des-002",
    designName: "Harborline Hub · Atrium Elevation",
    parentVersion: "v2.0",
    version: "v2.1",
    revisionNumber: 3,
    reason: "Approved for construction",
    changeSummary: "Final facade fin spacing per shop drawings.",
    affectedSheets: ["A-201"],
    status: "Approved",
    createdBy: "Diego Santos",
    createdAt: "2025-11-11T15:00:00Z",
    approvedAt: "2025-11-11T16:00:00Z",
  },
];

export const MOCK_DOCUMENTS: DesignDocument[] = [
  {
    id: "doc-001",
    title: "Architectural Specifications v2",
    category: "Specifications",
    version: "v2.0",
    status: "Approved",
    owner: "Amelia Cruz",
    updatedAt: "2025-11-10",
    fileType: "PDF",
    sizeKb: 5410,
    linkedDesign: "des-001",
  },
  {
    id: "doc-002",
    title: "Material Schedule — Tower A",
    category: "Material Schedule",
    version: "v1.3",
    status: "Approved",
    owner: "Diego Santos",
    updatedAt: "2025-11-08",
    fileType: "XLSX",
    sizeKb: 220,
    linkedDesign: "des-001",
  },
  {
    id: "doc-003",
    title: "Occupancy Permit Application",
    category: "Permits",
    version: "v1.0",
    status: "Draft",
    owner: "Ravi Patel",
    updatedAt: "2025-11-17",
    fileType: "PDF",
    sizeKb: 1200,
  },
  {
    id: "doc-004",
    title: "RFI-0042 · Grid Line E-7",
    category: "RFI",
    version: "v1.0",
    status: "Draft",
    owner: "Marco Delgado",
    updatedAt: "2025-11-18",
    fileType: "PDF",
    sizeKb: 380,
    linkedDesign: "des-001",
  },
  {
    id: "doc-005",
    title: "Site Instruction · Formwork Sequence",
    category: "Site Instructions",
    version: "v1.1",
    status: "Approved",
    owner: "Amelia Cruz",
    updatedAt: "2025-11-05",
    fileType: "PDF",
    sizeKb: 640,
  },
];

export const MOCK_AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: "ai-001",
    panel: "conflicts",
    title: "Structural conflict on grid E-7",
    summary: "HVAC duct routing intersects beam grid.",
    explanation:
      "Level 14 primary supply duct at grid E-7 clashes with the transfer beam. A 12 cm offset resolves the conflict with minimal ceiling impact.",
    confidence: 92,
    impact: "High",
    metrics: [
      { label: "Clashes", value: "3" },
      { label: "Sheets", value: "A-101, M-401" },
      { label: "Est. rework", value: "0.5 day" },
    ],
    actions: ["Offset duct by 12 cm", "Notify MEP lead", "Update sheet A-101"],
  },
  {
    id: "ai-002",
    panel: "compliance",
    title: "Egress width below code",
    summary: "Phoenix HQ lobby north stair clearance is 5 cm below the 1.2 m minimum.",
    explanation:
      "IBC 1005.3.1 requires 1.2 m clear width for the design occupancy. Current design measures 1.15 m at the narrowest point.",
    confidence: 88,
    impact: "Critical",
    metrics: [
      { label: "Deviation", value: "5 cm" },
      { label: "Occupancy", value: "480" },
    ],
    actions: ["Widen stair by 5 cm", "Add compliance note", "Flag for consultant review"],
  },
  {
    id: "ai-003",
    panel: "materials",
    title: "Facade material substitution",
    summary: "Switching to perforated aluminium cuts embodied carbon ~18%.",
    explanation:
      "Perforated aluminium panels with recycled content reduce embodied CO₂ while maintaining thermal and daylight performance.",
    confidence: 74,
    impact: "Medium",
    metrics: [
      { label: "CO₂ saved", value: "~18%" },
      { label: "Cost delta", value: "-4%" },
    ],
    actions: ["Request supplier quote", "Update spec section 08 44 13"],
  },
  {
    id: "ai-004",
    panel: "cost",
    title: "Lobby scope creep risk",
    summary: "Phoenix HQ lobby is trending 6% over budget.",
    explanation:
      "Recent revisions added premium finishes without matching value engineering. Consider swapping accent wall stone for engineered veneer.",
    confidence: 69,
    impact: "Medium",
    metrics: [
      { label: "Variance", value: "+6.2%" },
      { label: "Trigger", value: "Rev 4.0" },
    ],
    actions: ["Trigger VE review", "Escalate to PM"],
  },
  {
    id: "ai-005",
    panel: "accessibility",
    title: "Reception counter height",
    summary: "Provide accessible section under 900 mm.",
    explanation:
      "ADA guidelines require a 915 mm accessible section on service counters. Add a 1200 mm segment at the west end.",
    confidence: 90,
    impact: "High",
    metrics: [{ label: "Standard", value: "ADA 904.4" }],
    actions: ["Add accessible counter section", "Update elevation I-501"],
  },
  {
    id: "ai-006",
    panel: "sustainability",
    title: "Daylight optimisation",
    summary: "Rotate atrium fins 8° for 12% daylight gain.",
    explanation:
      "Solar analysis indicates an 8° rotation of the vertical fins increases daylight autonomy without heat gain penalty.",
    confidence: 81,
    impact: "Medium",
    metrics: [
      { label: "Daylight", value: "+12%" },
      { label: "Solar gain", value: "-1%" },
    ],
    actions: ["Update fin geometry", "Rerun energy model"],
  },
];

// ---------- Wizard draft ----------

export interface DesignWizardDraft {
  // Step 1
  name: string;
  projectId: string;
  discipline: Discipline | "";
  category: DesignCategory | "";
  description: string;
  // Step 2
  phase: ConstructionPhase | "";
  building: string;
  floor: string;
  zone: string;
  client: string;
  // Step 3
  files: WizardFile[];
  // Step 4
  version: string;
  revisionNumber: number;
  parentVersion: string;
  reason: string;
  changeSummary: string;
  // Step 5
  reviewers: string[];
  engineers: string[];
  consultants: string[];
  projectManager: string;
}

export interface WizardFile {
  id: string;
  name: string;
  sizeKb: number;
  progress: number;
  category?: string;
  discipline?: Discipline;
  status: "uploading" | "ready" | "duplicate" | "error";
}

export const emptyDesignDraft: DesignWizardDraft = {
  name: "",
  projectId: "",
  discipline: "",
  category: "",
  description: "",
  phase: "",
  building: "",
  floor: "",
  zone: "",
  client: "",
  files: [],
  version: "v0.1",
  revisionNumber: 1,
  parentVersion: "",
  reason: "",
  changeSummary: "",
  reviewers: [],
  engineers: [],
  consultants: [],
  projectManager: "",
};

export function generateDesignCode(project?: string, discipline?: Discipline): string {
  const p = (project ?? "NEW").slice(0, 3).toUpperCase();
  const d = discipline ? discipline[0].toUpperCase() : "X";
  const n = Math.floor(100 + Math.random() * 900);
  return `${p}-${d}-${n.toString().padStart(3, "0")}`;
}
