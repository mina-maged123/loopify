import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorNotificationService, ErrorNotificationConfig } from './error-notification.service';
import { ErrorNotificationComponent } from "./error-notification.component";

@Component({
  selector: 'app-error-notification-container',
  template: `
    <app-error-notification
      [title]="currentNotification?.title || 'Error'"
      [message]="currentNotification?.message || 'Something went wrong. Please try again.'"
      [isVisible]="isVisible"
      [autoDismiss]="currentNotification?.autoDismiss || true"
      [autoDismissDelay]="currentNotification?.autoDismissDelay || 5000"
      [showCloseButton]="currentNotification?.showCloseButton || true"
      [allowClickOutsideToClose]="currentNotification?.allowClickOutsideToClose || true"
      [enableShakeAnimation]="currentNotification?.enableShakeAnimation || true"
      (onClose)="onNotificationClose()"
      (onShow)="onNotificationShow()"
      (onRetry)="onNotificationRetry()">
    </app-error-notification>
  `,
  imports: [ErrorNotificationComponent]
})
export class ErrorNotificationContainerComponent implements OnInit, OnDestroy {
  currentNotification: ErrorNotificationConfig | null = null;
  isVisible: boolean = false;

  private notificationSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

  constructor(private notificationService: ErrorNotificationService) { }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.getNotification()
      .subscribe(notification => {
        this.currentNotification = notification;
      });

    this.visibilitySubscription = this.notificationService.getVisibility()
      .subscribe(isVisible => {
        this.isVisible = isVisible;
      });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }

  onNotificationClose(): void {
    this.notificationService.hide();
  }

  onNotificationShow(): void {
    // Handle show event if needed
    console.log('Error notification shown:', this.currentNotification);
  }

  onNotificationRetry(): void {
    // Handle retry event if needed
    console.log('Error notification retry requested:', this.currentNotification);
  }
}

