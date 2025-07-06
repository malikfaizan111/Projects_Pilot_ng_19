import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule,ConfirmDialogModule],
  template: `<p-confirmdialog>
        <ng-template #message let-message>
            <div class="flex flex-col items-center w-full gap-4 border-surface-200 dark:border-surface-700">
                <i [ngClass]="message.icon" class="!text-6xl text-primary-500"></i>
                <p>{{ message.message }}</p>
            </div>
        </ng-template>
    </p-confirmdialog>`,
})
export class AlertDialogComponent {
}