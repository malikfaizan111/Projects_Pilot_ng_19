import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../../core/components/alert-dialog/alert-dialog.component';
import { ProjectProgress } from '../../models/projectProgress';
@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputGroupModule,
    TableModule,
    ProgressBarModule,
    AsyncPipe,
    FormsModule,
    BadgeModule,
    AlertDialogComponent,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent {
  @ViewChild('dt') dt!: Table;
  @Input() projects!: Observable<ProjectProgress[]>;
  @Output() deleteProject = new EventEmitter<ProjectProgress>();
  @Output() editProject = new EventEmitter<ProjectProgress>();
  selectedStatus: string = 'All';
  expandedRowId: any = null;
  statusOptions: SelectItem[] = [
    { label: 'All Status', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  constructor(
    private readonly router: Router
  ) {}

  onStatusChange(value: string) {
    this.dt.filter(value === 'All' ? null : value, 'status', 'equals');
  }

  toggleRow(row: ProjectProgress) {
    this.expandedRowId = this.expandedRowId === row.id ? null : row.id;
  }

  getBadgeSeverity(
    status: string | null
  ): 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'on hold':
        return 'warn';
      default:
        return null;
    }
  }

  viewTasks(project: ProjectProgress) {
    this.router.navigateByUrl(`/projects/${project.id}/tasks`);
  }

  onEditProject(project: ProjectProgress) {
    this.editProject.emit(project);
  }

  onDelete(project: ProjectProgress) {
    this.deleteProject.emit(project);
  }

}
