import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-overview',
  imports: [AsyncPipe],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent {

  @Input() activeProjects!: Observable<number>;
  @Input() totalTasks!    : Observable<number>;
  @Input() inProgress!    : Observable<number>;
  @Input() completionRate!: Observable<number>;

}
