import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorNotificationConfig {
  title?: string;
  message?: string;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  showCloseButton?: boolean;
  allowClickOutsideToClose?: boolean;
  enableShakeAnimation?: boolean;
  errorCode?: string;
  errorType?: 'network' | 'validation' | 'server' | 'client' | 'unknown';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  private notificationSubject = new BehaviorSubject<ErrorNotificationConfig | null>(null);
  private isVisibleSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * Get notification configuration observable
   */
  getNotification(): Observable<ErrorNotificationConfig | null> {
    return this.notificationSubject.asObservable();
  }

  /**
   * Get visibility state observable
   */
  getVisibility(): Observable<boolean> {
    return this.isVisibleSubject.asObservable();
  }

  /**
   * Show error notification
   */
  showError(config: ErrorNotificationConfig = {}): void {
    const defaultConfig: ErrorNotificationConfig = {
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      autoDismiss: true,
      autoDismissDelay: 5000, // Longer delay for errors
      showCloseButton: true,
      allowClickOutsideToClose: true,
      enableShakeAnimation: true,
      errorType: 'unknown'
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
   * Quick error notification with custom message
   */
  error(message: string, title: string = 'Error'): void {
    this.showError({ title, message });
  }

  /**
   * Show generic error notification (matching the screenshot)
   */
  showGenericError(): void {
    this.showError({
      title: 'Error',
      message: 'Something went wrong. Please try again.'
    });
  }

  /**
   * Show network error
   */
  showNetworkError(): void {
    this.showError({
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      errorType: 'network',
      autoDismiss: false // Don't auto-dismiss network errors
    });
  }

  /**
   * Show validation error
   */
  showValidationError(message: string = 'Please check your input and try again.'): void {
    this.showError({
      title: 'Validation Error',
      message: message,
      errorType: 'validation',
      autoDismissDelay: 4000
    });
  }

  /**
   * Show server error
   */
  showServerError(errorCode?: string): void {
    const message = errorCode 
      ? `Server error occurred (${errorCode}). Please try again later.`
      : 'Server error occurred. Please try again later.';
    
    this.showError({
      title: 'Server Error',
      message: message,
      errorType: 'server',
      errorCode: errorCode,
      autoDismiss: false
    });
  }

  /**
   * Show timeout error
   */
  showTimeoutError(): void {
    this.showError({
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      errorType: 'network',
      autoDismissDelay: 6000
    });
  }

  /**
   * Show permission error
   */
  showPermissionError(): void {
    this.showError({
      title: 'Access Denied',
      message: 'You do not have permission to perform this action.',
      errorType: 'client',
      autoDismiss: false
    });
  }

  /**
   * Show custom HTTP error based on status code
   */
  showHttpError(statusCode: number, customMessage?: string): void {
    let title = 'Error';
    let message = customMessage || 'Something went wrong. Please try again.';
    let errorType: ErrorNotificationConfig['errorType'] = 'unknown';

    switch (statusCode) {
      case 400:
        title = 'Bad Request';
        message = customMessage || 'Invalid request. Please check your input.';
        errorType = 'validation';
        break;
      case 401:
        title = 'Unauthorized';
        message = customMessage || 'Please log in to continue.';
        errorType = 'client';
        break;
      case 403:
        title = 'Access Denied';
        message = customMessage || 'You do not have permission to perform this action.';
        errorType = 'client';
        break;
      case 404:
        title = 'Not Found';
        message = customMessage || 'The requested resource was not found.';
        errorType = 'client';
        break;
      case 408:
        title = 'Request Timeout';
        message = customMessage || 'The request took too long to complete.';
        errorType = 'network';
        break;
      case 500:
        title = 'Server Error';
        message = customMessage || 'Internal server error. Please try again later.';
        errorType = 'server';
        break;
      case 502:
        title = 'Bad Gateway';
        message = customMessage || 'Server is temporarily unavailable.';
        errorType = 'server';
        break;
      case 503:
        title = 'Service Unavailable';
        message = customMessage || 'Service is temporarily unavailable.';
        errorType = 'server';
        break;
      default:
        if (statusCode >= 500) {
          title = 'Server Error';
          errorType = 'server';
        } else if (statusCode >= 400) {
          title = 'Client Error';
          errorType = 'client';
        }
    }

    this.showError({
      title,
      message,
      errorType,
      errorCode: statusCode.toString(),
      autoDismiss: errorType === 'validation'
    });
  }
}

