import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationConfig {
  title?: string;
  message?: string;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  showCloseButton?: boolean;
  allowClickOutsideToClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SuccessNotificationService {
  private notificationSubject = new BehaviorSubject<NotificationConfig | null>(null);
  private isVisibleSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * Get notification configuration observable
   */
  getNotification(): Observable<NotificationConfig | null> {
    return this.notificationSubject.asObservable();
  }

  /**
   * Get visibility state observable
   */
  getVisibility(): Observable<boolean> {
    return this.isVisibleSubject.asObservable();
  }

  /**
   * Show success notification
   */
  showSuccess(config: NotificationConfig = {}): void {
    const defaultConfig: NotificationConfig = {
      title: 'Success',
      message: 'Operation completed successfully.',
      autoDismiss: true,
      autoDismissDelay: 3000,
      showCloseButton: true,
      allowClickOutsideToClose: true
    };

    const finalConfig = { ...defaultConfig, ...config };
    this.notificationSubject.next(finalConfig);
    this.isVisibleSubject.next(true);
  }

  /**
   * Hide notification
   */
  hide(): void {
    this.isVisibleSubject.next(false);
    // Clear notification config after a delay to allow for exit animations
    setTimeout(() => {
      this.notificationSubject.next(null);
    }, 300);
  }

  /**
   * Quick success notification with custom message
   */
  success(message: string, title: string = 'Success'): void {
    this.showSuccess({ title, message });
  }

  /**
   * Show redeem success notification (matching the screenshot)
   */
  showRedeemSuccess(): void {
    this.showSuccess({
      title: 'Success',
      message: 'Redeem completed successfully.'
    });
  }
}

