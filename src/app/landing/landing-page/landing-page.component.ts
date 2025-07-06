import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DashboardOverviewComponent } from '../components/dashboard-overview/dashboard-overview.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone:true,
  imports: [ButtonModule, DashboardOverviewComponent],
  providers:[AnalyticsService,AuthService],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit  {

 activeProjects$!: Observable<number>;
  totalTasks$!    : Observable<number>;
  inProgress$!    : Observable<number>;
  completionRate$!: Observable<number>;

  constructor(private readonly router: Router,private readonly authService:AuthService, private readonly analyticService: AnalyticsService){}
  

  ngOnInit(): void {
    this.activeProjects$ = this.analyticService.activeProjects();
    this.totalTasks$     = this.analyticService.totalTasks();
    this.inProgress$     = this.analyticService.inProgressTasks();
    this.completionRate$ = this.analyticService.completionRate();
  }
  
  onNavigateToProjects(){
    this.authService.isLoggedIn = true;
    this.router.navigateByUrl('/projects');
  }
  
}
