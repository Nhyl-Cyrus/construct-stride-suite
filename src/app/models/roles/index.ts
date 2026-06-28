export type RoleId =
  | "project-manager"
  | "human-resources"
  | "finance"
  | "architect"
  | "engineer"
  | "site-personnel"
  | "consultant";

export interface RoleDefinition {
  id: RoleId;
  label: string;
}

export const ROLES: RoleDefinition[] = [
  { id: "project-manager", label: "Project Manager" },
  { id: "human-resources", label: "Human Resources" },
  { id: "finance", label: "Finance" },
  { id: "architect", label: "Architect" },
  { id: "engineer", label: "Engineer" },
  { id: "site-personnel", label: "Site Personnel" },
  { id: "consultant", label: "Consultant" },
];
