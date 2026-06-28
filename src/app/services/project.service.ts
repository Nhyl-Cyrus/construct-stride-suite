import { projectRepository } from "@/app/repositories/project.repository";

export const projectService = {
  list: () => projectRepository.list(),
  getByCode: (code: string) => projectRepository.getById(code),
  async byRisk(risk: "Low" | "Medium" | "High") {
    return (await projectRepository.list()).filter((p) => p.risk === risk);
  },
};
