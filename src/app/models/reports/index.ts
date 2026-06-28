export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  scope: "hr" | "project" | "finance" | "operations";
}
