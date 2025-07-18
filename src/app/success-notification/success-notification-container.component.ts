import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuccessNotificationService, NotificationConfig } from './success-notification.service';
import { SuccessNotificationComponent } from "./success-notification.component";

@Component({
  selector: 'app-success-notification-container',
  template: `
    <app-success-notification
      [title]="currentNotification?.title || 'Success'"
      [message]="currentNotification?.message || 'Operation completed successfully.'"
      [isVisible]="isVisible"
      [autoDismiss]="currentNotification?.autoDismiss || true"
      [autoDismissDelay]="currentNotification?.autoDismissDelay || 3000"
      [showCloseButton]="currentNotification?.showCloseButton || true"
      [allowClickOutsideToClose]="currentNotification?.allowClickOutsideToClose || true"
      (onClose)="onNotificationClose()"
      (onShow)="onNotificationShow()">
    </app-success-notification>
  `,
  imports: [SuccessNotificationComponent]
})
export class SuccessNotificationContainerComponent implements OnInit, OnDestroy {
  currentNotification: NotificationConfig | null = null;
  isVisible: boolean = false;

  private notificationSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

  constructor(private notificationService: SuccessNotificationService) { }

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
  }
}

