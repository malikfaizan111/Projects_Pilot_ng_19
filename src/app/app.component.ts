import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastComponent } from './core/components/toast/toast.component';
import { ApiLoaderComponent } from './core/components/api-loader/api-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    ToastComponent,
    ApiLoaderComponent,
    ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
