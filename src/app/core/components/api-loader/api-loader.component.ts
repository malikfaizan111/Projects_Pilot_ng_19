import { Component } from "@angular/core";
import { ApiLoaderService } from "../../services/api-loader.service";
import { AsyncPipe, CommonModule } from "@angular/common";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: 'app-api-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, AsyncPipe],
  template: `
    <div *ngIf="loader.isLoading$ | async" 
        class="fixed inset-0 flex justify-center bg-[#8080803b] items-center z-50">
        <div class="flex flex-col items-center justify-center p-4 bg-white bg-opacity-70 rounded-3xl shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_-8px_20px_rgba(0,0,0,0.1)] transition-all transform scale-100">
            <p-progress-spinner strokeWidth="4" [style]="{ 'width': '60px', 'height': '60px' }"></p-progress-spinner>
            <p class="text-lg font-medium text-gray-800 mt-2">Please wait...</p>
            <p class="text-sm text-gray-600 mt-1">Loading your content...</p>
        </div>
    </div>
  `
})
export class ApiLoaderComponent {
  constructor(public loader: ApiLoaderService) {}
}
