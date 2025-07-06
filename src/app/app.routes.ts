import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainGuard } from './core/guards/main.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/landing/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
      canActivate:[AuthGuard]
  },
  {
    path: 'projects',
    loadComponent: () =>
      import(
        '../app/features/projects/projects-page/projects-page.component'
      ).then((m) => m.ProjectsPageComponent),
      canActivate:[MainGuard]
  },
  {
    path: 'projects/:projectId/tasks',
    loadComponent: () =>
      import('../app/features/tasks/tasks-page/tasks-page.component').then(
        (m) => m.TasksPageComponent
      ),
      canActivate:[MainGuard]
  },
  { path: '**', redirectTo: '/projects', pathMatch: 'full' }
];
