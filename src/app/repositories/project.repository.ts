import { projects, type Project } from "@/app/models/projects";
import { ok, type Repository } from "./base.repository";

export const projectRepository: Repository<Project> = {
  list: () => ok(projects),
  getById: (code) => ok(projects.find((p) => p.code === code)),
};
