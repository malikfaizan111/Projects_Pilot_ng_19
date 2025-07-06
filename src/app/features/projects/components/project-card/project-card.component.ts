import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectStats } from '../../../../shared/models/projectStats.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
  @Input() projectCardData!: Observable<ProjectStats>;

}
