import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AlertDialogComponent } from '../../../../core/components/alert-dialog/alert-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { TaskService } from '../../services/task.service';

type PSeverity =
  | 'secondary'
  | 'info'
  | 'success'
  | 'warn'
  | 'danger'
  | 'contrast'
  | null;

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputGroupModule,
    TableModule,
    FormsModule,
    BadgeModule,
    AlertDialogComponent,
    DropdownModule,
    DatePickerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @ViewChild('dt') dt!: Table;
  @Input() tasks$!: Observable<Task[]>;
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();
  selectedPriority: string = 'All';
  selectedStatus: string = 'All';
  statusOptions: SelectItem[] = [
    { label: 'All Status', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];
  priorityOptions: SelectItem[] = [
    { label: 'All Priority', value: 'All' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];


    statusTableOptions: SelectItem[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];
  

  constructor(private readonly taskSevice: TaskService){

  }


  onupdateChanged(task: Task) {
  this.taskSevice.updateTask(task.id, task).subscribe({
  });
}
  onGlobalSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  onStatusChange(value: string) {
    this.dt.filter(value === 'All' ? null : value, 'status', 'equals');
  }

  onPriorityChange(value: string) {
    this.dt.filter(value === 'All' ? null : value, 'priority', 'equals');
  }

  getStatusSeverity(status: string | null): PSeverity {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'all status':
        return 'secondary';
      case 'pending':
        return 'warn';
      case 'in progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  }

  getPrioritySeverity(priority: string | null): PSeverity {
    if (!priority) return null;
    switch (priority.toLowerCase()) {
      case 'all priority':
        return 'secondary';
      case 'high':
        return 'danger';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  }
  onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onDeleteTask(task: Task) {
    this.deleteTask.emit(task);
  }
}
