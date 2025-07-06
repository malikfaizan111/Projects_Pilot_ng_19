import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, mapTo } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { environment } from '../../../../environments/environment';
import { Task } from '../../tasks/models/task.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly projectsUrl = `${environment.apiUrl}/projects`;
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  public readonly projects$ = this.projectsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  fetchProjects() {
    this.http
      .get<Project[]>(this.projectsUrl)
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch projects', err);
          return throwError(() => err);
        })
      )
      .subscribe((projects) => this.projectsSubject.next(projects));
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.projectsUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(`Failed to fetch project ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  addProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http
      .post<Project>(this.projectsUrl, project)
      .pipe(catchError((err) => this.handleError(err, 'add project')));
  }

  updateProject(id: string, project: Project): Observable<Project> {
    return this.http
      .patch<Project>(`${this.projectsUrl}/${id}`, project)
      .pipe(catchError((err) => this.handleError(err, `update project ${id}`)));
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http
      .get<Task[]>(`${this.tasksUrl}?projectId=${projectId}`)
      .pipe(
        concatMap((tasks) => {
          if (!tasks.length) {
            return of(void 0);
          }
          const deletes = tasks.map((t) =>
            this.http.delete<void>(`${this.tasksUrl}/${t.id}`).pipe(
              catchError((err: HttpErrorResponse) => {
                console.error(`Failed to delete task ${t.id}`, err);
                return of(void 0);
              })
            )
          );
          return forkJoin(deletes).pipe(mapTo(void 0));
        }),
        concatMap(() =>
          this.http.delete<void>(`${this.projectsUrl}/${projectId}`)
        ),
        catchError((err: HttpErrorResponse) => {
          console.error(`Failed to delete project ${projectId}`, err);
          return throwError(() => err);
        })
      );
  }

  private handleError(err: HttpErrorResponse, context: string) {
    console.error(`Error during ${context}:`, err);
    return throwError(() => new Error(`Failed to ${context}: ${err.message}`));
  }
}
