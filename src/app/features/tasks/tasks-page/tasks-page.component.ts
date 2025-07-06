import { Component, OnInit } from '@angular/core';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TaskListComponent } from '../components/task-list/task-list.component';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../core/services/alert-dialog.service';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../projects/services/project.service';
import { TaskService } from '../services/task.service';
import { finalize, Observable, Subscription } from 'rxjs';
import { Project } from '../../projects/models/project.model';
import { TaskStats } from '../../../shared/models/taskStats.model';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-tasks-page',
  imports: [
    TaskCardComponent,
    TaskListComponent,
    TaskDialogComponent,
    DialogModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPageComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  sub: Subscription = new Subscription();
  mode: 'add' | 'edit' = 'add';
  selectedTask!: any;
  displayDialog: boolean = false;
  projectDetail: Project | null = null;
  taskCardData$!: Observable<TaskStats>;
  projectId!: string;

  constructor(
    private readonly analyticService: AnalyticsService,
    private readonly authService: AuthService,
    protected readonly router: Router,
    protected _route: ActivatedRoute,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly messageService: MessageService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.fetchRouteParam();
  }

  fetchRouteParam() {
    const projectId = this._route.snapshot.paramMap.get('projectId');
    if (!projectId) {
      return;
    } else {
      this.projectId = projectId;
      this.getProjectDetail(projectId);
      this.taskCardData$ =
        this.analyticService.getTaskStatsByProject(projectId);
      this.tasks$ = this.taskService.getTasksByProject(projectId);
    }
  }

  getProjectDetail(projectId: string) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => (this.projectDetail = project),
      error: (err) => console.error('Failed to load project', err),
    });
  }

openNew() {
  this.selectedTask = {
    id: 0,
    projectId: this.projectId,
    title:     '',
    assignee:  '',
    dueDate:   new Date().toISOString().substring(0,10),
    status:    'Pending',
    priority:  'Medium'
  };
  this.mode = 'add';
  this.displayDialog = true;
}

openEdit(task: Task) {
  this.selectedTask = { ...task };
  this.mode = 'edit';
  this.displayDialog = true;
}

  saveOrUpdateTask(task: Task) {
    if (this.mode === 'add') {
      this.taskService.addTaskUnderProject(this.projectId,task,)
      .pipe(finalize(() => this.fetchRouteParam()))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Project "${task.title}" added`,
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add task',
          }),
      });
    } else {
      this.taskService.updateTask(task.id, task)
      .pipe(finalize(() => this.fetchRouteParam()))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Task "${task.title}" updated`,
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update project',
          }),
      });
    }
    this.displayDialog = false;
  }

  deleteTask(task: Task) {
    this.confirmationDialogService.showConfirmDialog(
      'Delete Confirmation',
      `Are you sure you want to delete the task: ${task.title}?`,
      this.acceptCase(task),
      this.rejectCase()
    );
  }

  acceptCase(task: Task) {
    return () => {
      this.taskService
        .deleteTaskAndUnassign(task.id)
        .pipe(finalize(() => this.fetchRouteParam()))
        .subscribe({
          next: () =>
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: `Project "${task.title}" deleted`,
            }),
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete project',
            }),
        });
    };
  }

  rejectCase() {
    return () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have rejected',
        life: 3000,
      });
    };
  }

  onLogout() {
    this.authService.isLoggedIn = false;
    this.router.navigateByUrl('/');
  }
}
