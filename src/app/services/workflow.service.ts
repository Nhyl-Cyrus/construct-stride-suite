import { workflowRepository } from "@/app/repositories/workflow.repository";

export const workflowService = {
  list: () => workflowRepository.list(),
  getById: (id: string) => workflowRepository.getById(id),
};
