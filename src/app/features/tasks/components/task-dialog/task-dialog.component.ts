import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { SelectItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-task-dialog',
  imports: [
    SelectModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    DatePickerModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css',
})
export class TaskDialogComponent implements OnChanges {
  @ViewChild('taskForm') taskForm!: NgForm;
  @Input() task: Task | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() save = new EventEmitter<Task>();
  editableTask!: Task;
  selectedPriority: string = 'All';
  selectedStatus: string = 'All';
  statusOptions: SelectItem[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];
  priorityOptions: SelectItem[] = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  constructor() {
    this.editableTask = {
      id: "0",
      projectId: "0",
      title: '',
      assignee: '',
      dueDate: new Date().toISOString().substring(0, 10),
      status: 'Pending',
      priority: 'Medium',
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      const t = this.task;
      if (t) {
        this.editableTask = { ...t };
      } else {
        this.editableTask = {
          id: "0",
          projectId: this.editableTask.projectId,
          title: '',
          assignee: '',
          dueDate: new Date().toISOString().substring(0, 10),
          status: 'Pending',
          priority: 'Medium',
        };
      }
    }
  }

  onSave() {
    if (this.taskForm.valid) {
      this.save.emit(this.editableTask);
    } else {
      this.taskForm.form.markAllAsTouched();
    }
  }
}
