import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskStats } from '../../../../shared/models/taskStats.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
 @Input() taskCardData!: Observable<TaskStats>;
}
