import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-notification',
  imports: [CommonModule],
  templateUrl: './error-notification.component.html',
  styleUrl: './error-notification.component.css'
})
export class ErrorNotificationComponent {
  @Input() title: string = 'Error';
  @Input() message: string = 'Something went wrong. Please try again.';
  @Input() isVisible: boolean = false;
  @Input() autoDismiss: boolean = true;
  @Input() autoDismissDelay: number = 5000; // 5 seconds for errors (longer than success)
  @Input() showCloseButton: boolean = true;
  @Input() allowClickOutsideToClose: boolean = true;
  @Input() enableShakeAnimation: boolean = true;

  @Output() onClose = new EventEmitter<void>();
  @Output() onShow = new EventEmitter<void>();
  @Output() onRetry = new EventEmitter<void>();

  private autoDismissTimer: any;

  constructor() { }

  ngOnInit(): void {
    if (this.isVisible) {
      this.show();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoDismissTimer();
  }

  /**
   * Show the notification
   */
  show(): void {
    this.isVisible = true;
    this.onShow.emit();

    if (this.autoDismiss) {
      this.startAutoDismissTimer();
    }

    // Add shake animation for emphasis
    if (this.enableShakeAnimation) {
      setTimeout(() => {
        const notification = document.querySelector('.error-notification');
        if (notification) {
          notification.classList.add('shake');
          setTimeout(() => {
            notification.classList.remove('shake');
          }, 500);
        }
      }, 100);
    }
  }

  /**
   * Hide the notification
   */
  hide(): void {
    this.isVisible = false;
    this.clearAutoDismissTimer();
    this.onClose.emit();
  }

  /**
   * Close notification (same as hide but with different semantic meaning)
   */
  closeNotification(): void {
    if (this.allowClickOutsideToClose) {
      this.hide();
    }
  }

  /**
   * Retry action - emits retry event and closes notification
   */
  retry(): void {
    this.onRetry.emit();
    this.hide();
  }

  /**
   * Start auto-dismiss timer
   */
  private startAutoDismissTimer(): void {
    this.clearAutoDismissTimer();
    this.autoDismissTimer = setTimeout(() => {
      this.hide();
    }, this.autoDismissDelay);
  }

  /**
   * Clear auto-dismiss timer
   */
  private clearAutoDismissTimer(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }
  }

  /**
   * Handle escape key press to close notification
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isVisible) {
      this.hide();
    }
  }

  /**
   * Pause auto-dismiss on mouse enter
   */
  onMouseEnter(): void {
    if (this.autoDismiss) {
      this.clearAutoDismissTimer();
    }
  }

  /**
   * Resume auto-dismiss on mouse leave
   */
  onMouseLeave(): void {
    if (this.autoDismiss && this.isVisible) {
      this.startAutoDismissTimer();
    }
  }
}
