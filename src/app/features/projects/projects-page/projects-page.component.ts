import { Component, OnInit } from '@angular/core';
import { finalize, Observable, take } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { AnalyticsService } from '../../../shared/services/analytics.service';
import { ProjectCardComponent } from '../components/project-card/project-card.component';
import { ProjectListComponent } from '../components/project-list/project-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProjectDialogComponent } from '../components/project-dialog/project-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ProjectProgress } from '../models/projectProgress';
import { ConfirmationDialogService } from '../../../core/services/alert-dialog.service';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../../tasks/services/task.service';
import { Project } from '../models/project.model';
import { ProjectStats } from '../../../shared/models/projectStats.model';

@Component({
  selector: 'app-projects-page',
  imports: [
    ProjectCardComponent,
    ProjectListComponent,
    ProjectDialogComponent,
    ButtonModule,
    DialogModule,
    CommonModule,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPageComponent implements OnInit {
  projects$!: Observable<ProjectProgress[]>;
  projectCardData$!: Observable<ProjectStats>;
  displayDialog: boolean = false;
  mode: 'add' | 'edit' = 'add';
  selectedProject!: any;
  constructor(
    private readonly analyticService: AnalyticsService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly messageService: MessageService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.fetchProjectsandTask();
  }


  fetchProjectsandTask() {
    this.projectService.fetchProjects();
    this.taskService.fetchTasks();
    this.projects$ = this.analyticService.projectsWithProgress$();
    this.projectCardData$ = this.analyticService.getProjectStats();
  }

  openNew() {
    this.selectedProject = {
      name: '',
      owner: '',
      status: 'Active',
      description: '',
      tasks: [],
    };

    this.mode = 'add';
    this.displayDialog = true;
  }

  openEdit(project: ProjectProgress) {
    this.mode = 'edit';
    this.selectedProject = { ...project, tasks: [...(project.tasks || [])] };
    this.displayDialog = true;
  }

  saveAndUpdateProject(project: Project) {
    if (this.mode === 'add') {
      this.projectService
        .addProject(project)
        .pipe(finalize(() => this.fetchProjectsandTask()))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Created',
              detail: `Project "${project.name}" added`,
            });
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add project',
            }),
        });
    } else {
      this.projectService
        .updateProject(project.id, project)
        .pipe(finalize(() => this.fetchProjectsandTask()))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: `Project "${project.name}" updated`,
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

  deleteProject(project: ProjectProgress) {
    this.confirmationDialogService.showConfirmDialog(
      'Delete Confirmation',
      `Are you sure you want to delete the project: ${project.name}?`,
      this.acceptCase(project),
      this.rejectCase()
    );
  }

  acceptCase(project: ProjectProgress) {
    return () => {
      this.projectService
        .deleteProject(project.id)
        .pipe(finalize(() => this.fetchProjectsandTask()))
        .subscribe({
          next: () =>
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: `Project "${project.name}" deleted`,
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
