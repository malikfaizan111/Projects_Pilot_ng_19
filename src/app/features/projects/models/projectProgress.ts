import { Project } from "./project.model";

export interface ProjectProgress extends Project {
  progress: number;
  tasksCount: number;
}
