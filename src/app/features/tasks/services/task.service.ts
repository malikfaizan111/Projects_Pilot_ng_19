import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, concatMap, map, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../projects/models/project.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;
  private readonly projectsUrl = `${environment.apiUrl}/projects`;
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  public readonly tasks$ = this.tasksSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  fetchTasks() {
    this.http.get<Task[]>(this.tasksUrl).subscribe({
      next: (tasks) => this.tasksSubject.next(tasks),
    });
  }

  getTasksByProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.tasksUrl}?projectId=${projectId}`);
  }

  generateAlphaNumericId(length = 8): string {
    return Math.random().toString(36).substring(2, length);
  }

  addTaskUnderProject(projectId: string, raw: Partial<Task>): Observable<Task> {
    const generatedId = this.generateAlphaNumericId(8);
    const payload: Task = {
      id: generatedId,
      projectId,
      title: raw.title!,
      assignee: raw.assignee!,
      dueDate: raw.dueDate!,
      status: raw.status!,
      priority: raw.priority!,
    };
    return this.http.post<Task>(this.tasksUrl, payload).pipe(
      concatMap((newTask) =>
        this.http
          .get<Project>(`${this.projectsUrl}/${projectId}`)
          .pipe(
            concatMap((project) => {
              const updated = [...(project.tasks ?? []), String(newTask.id)];
              return this.http
                .patch<Project>(`${this.projectsUrl}/${projectId}`, {
                  tasks: updated,
                })
                .pipe(map(() => newTask));
            })
          )
      )
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.tasksUrl}/${id}`, task);
  }

  deleteTaskAndUnassign(taskId: string): Observable<void> {
    return this.http.get<Task>(`${this.tasksUrl}/${taskId}`).pipe(
      concatMap((task) =>
        this.http.delete<void>(`${this.tasksUrl}/${taskId}`).pipe(
          concatMap(() =>
            this.http.get<Project>(`${this.projectsUrl}/${task.projectId}`)
          ),
          concatMap((project) => {
            const updated = (project.tasks ?? []).filter((id) => id !== taskId);
            return this.http
              .patch<Project>(`${this.projectsUrl}/${project.id}`, {
                tasks: updated,
              })
              .pipe(map(() => void 0));
          })
        )
      )
    );
  }
}
