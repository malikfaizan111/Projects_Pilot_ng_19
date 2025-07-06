import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(
    private readonly confirmationService: ConfirmationService,
  ) {}

  showConfirmDialog(
    header: string,
    message: string,
    acceptCallback?: () => void,
    rejectCallback?: () => void,
    acceptButtonProps?: { label: string; icon: string; size: string },
    rejectButtonProps?: { label: string; icon: string; outlined: boolean; size: string }
  ) {
    this.confirmationService.confirm({
      header: header,
      message: message,
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: acceptButtonProps || {
        label: 'Confirm',
        icon: 'pi pi-check',
        size: 'small',
      },
      rejectButtonProps: rejectButtonProps || {
        label: 'Cancel',
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
      },
      accept: () => {
        if (acceptCallback) {
          acceptCallback();
        }
      },
      reject: () => {
        if (rejectCallback) {
          rejectCallback();
        }
      },
    });
  }
}
