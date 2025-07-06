import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ProjectService } from '../../features/projects/services/project.service';
import { TaskService } from '../../features/tasks/services/task.service';
import { ProjectProgress } from '../../features/projects/models/projectProgress';
import { TaskStats } from '../models/taskStats.model';
import { ProjectStats } from '../models/projectStats.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  activeProjects(): Observable<number> {
    return this.projectService.projects$.pipe(
      map((projects) => projects.filter((p) => p.status === 'Active').length)
    );
  }

  totalTasks(): Observable<number> {
    return combineLatest([
      this.projectService.projects$,
      this.taskService.tasks$,
    ]).pipe(
      map(([projects, tasks]) => {
        const projectIds = new Set(projects.map((p) => +p.id));
        return tasks.filter((task) => projectIds.has(+task.projectId)).length;
      })
    );
  }

  completionRate(): Observable<number> {
    return combineLatest([
      this.projectService.projects$,
      this.taskService.tasks$,
    ]).pipe(
      map(([projects, tasks]) => {
        const projectIds = new Set(projects.map((p) => +p.id));
        const projectTasks = tasks.filter((task) =>
          projectIds.has(+task.projectId)
        );
        const completed = projectTasks.filter(
          (t) => t.status === 'Completed'
        ).length;
        const total = projectTasks.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      })
    );
  }

  overdueTasks(): Observable<number> {
    return this.taskService.tasks$.pipe(
      map((tasks) => {
        const now = new Date();
        return tasks.filter(
          (task) => new Date(task.dueDate) < now && task.status !== 'Completed'
        ).length;
      })
    );
  }

  inProgressTasks(): Observable<number> {
    return combineLatest([
      this.projectService.projects$,
      this.taskService.tasks$,
    ]).pipe(
      map(([projects, tasks]) => {
        const projectIds = new Set(projects.map((p) => +p.id));
        return tasks.filter(
          (task) =>
            projectIds.has(+task.projectId) && task.status === 'In Progress'
        ).length;
      })
    );
  }

  getProjectStats(): Observable<ProjectStats> {
    return combineLatest([
      this.projectService.projects$,
      this.taskService.tasks$,
      this.totalTasks(),
    ]).pipe(
      map(([projects, tasks, totalTasks]) => {
        return {
          totalProjects: projects.length,
          activeProjects: projects.filter((p) => p.status === 'Active').length,
          completedProjects: projects.filter((p) => p.status === 'Completed')
            .length,
          totalTasks,
        };
      })
    );
  }

  toDateOnly(date: string | Date): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  getTaskStatsByProject(projectId: string): Observable<TaskStats> {
    return this.taskService.getTasksByProject(projectId).pipe(
      map((tasks) => {
        const today = this.toDateOnly(new Date());
        const overdueTasks = tasks.filter(
          (task) =>
            this.toDateOnly(task.dueDate) < today && task.status !== 'Completed'
        ).length;

        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const inProgress = tasks.filter(
          (t) => t.status === 'In Progress'
        ).length;
        const pending = tasks.filter((t) => t.status === 'Pending').length;
        return { overdueTasks, completed, inProgress, pending };
      })
    );
  }

  projectsWithProgress$(): Observable<ProjectProgress[]> {
    return combineLatest([
      this.projectService.projects$,
      this.taskService.tasks$,
    ]).pipe(
      map(([projects, tasks]) =>
        projects.map((project) => {
          const taskArray = tasks.filter((t) => t.projectId === project.id);
          const tasksCount = taskArray.length;
          const completed = taskArray.filter(
            (t) => t.status === 'Completed'
          ).length;
          const progress =
            tasksCount > 0 ? Math.round((completed / tasksCount) * 100) : 0;
          return { ...project, tasksCount, progress } as ProjectProgress;
        })
      )
    );
  }
}
