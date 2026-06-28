export interface WorkflowStage {
  id: string;
  name: string;
  owner: string;
  status: "Pending" | "Active" | "Complete" | "Blocked";
}

export interface Workflow {
  id: string;
  name: string;
  stages: WorkflowStage[];
}
