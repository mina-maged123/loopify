import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-success-notification',
  imports: [CommonModule],
  templateUrl: './success-notification.component.html',
  styleUrl: './success-notification.component.css'
})
export class SuccessNotificationComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Success';
  @Input() message: string = 'Operation completed successfully.';
  @Input() isVisible: boolean = false;
  @Input() autoDismiss: boolean = true;
  @Input() autoDismissDelay: number = 3000; // 3 seconds
  @Input() showCloseButton: boolean = true;
  @Input() allowClickOutsideToClose: boolean = true;

  @Output() onClose = new EventEmitter<void>();
  @Output() onShow = new EventEmitter<void>();

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
