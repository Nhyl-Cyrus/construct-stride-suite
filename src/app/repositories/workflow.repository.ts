import type { Workflow } from "@/app/models/workflow";
import { ok } from "./base.repository";

const workflows: Workflow[] = [];

export const workflowRepository = {
  list: (): Promise<Workflow[]> => ok(workflows),
  getById: (id: string) => ok(workflows.find((w) => w.id === id)),
};
