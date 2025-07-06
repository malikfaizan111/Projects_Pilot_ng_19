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
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-dialog',
  imports: [
    SelectModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.css',
})
export class ProjectDialogComponent implements OnChanges{
  @ViewChild('projectForm') projectForm!: NgForm;
  @Input() project: Project | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() save = new EventEmitter<Project>();
  editableProject!: Project;
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  constructor() {
    this.editableProject = {
      id: "0",
      name: '',
      owner: '',
      status: 'Active',
      description: '',
      tasks: [],
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      this.editableProject = {
        ...this.project,
        tasks: [...this.project.tasks],
      };
    }
  }

  onSave() {
    if (this.projectForm.valid) {
      this.save.emit(this.editableProject);
    } else {
      this.projectForm.control.markAllAsTouched();
    }
  }
}
