import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '@/app/services/user-profile.service';
import { ErrorNotificationContainerComponent } from '@/app/error-notification/error-notification-container.component';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ErrorNotificationContainerComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userProfileService: UserProfileService,
    private errorNotifyService: ErrorNotificationService
  ) { }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get getEmail() {
    return this.forgotForm.get('email');
  }

  get getNewPassword() {
    return this.forgotForm.get('newPassword');
  }

  get getConfirmPassword() {
    return this.forgotForm.get('confirmPassword');
  }

  checkEmail() {
    if (!this.forgotForm.valid) {
      this.errorNotifyService.showError({
        title: "Error",
        message: "Please fill all required fields correctly",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      return;
    }

    if (this.forgotForm.value.newPassword !== this.forgotForm.value.confirmPassword) {
      this.errorNotifyService.showError({
        title: "Error",
        message: "New password and confirmation must match",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      return;
    }

    // Send all data as your backend expects
    const data = {
      email: this.forgotForm.value.email || '',
      newPassword: this.forgotForm.value.newPassword || '',
      confirmPassword: this.forgotForm.value.confirmPassword || ''
    };

    console.log('Sending data to API:', data);

    this.userProfileService.checkEmail(data).subscribe({
      next: (response) => {
        console.log('Full response:', response);

        // Handle both string response and object response
        const message = typeof response === 'string' ? response : response.message || response;

        if (message === "Email not found.") {
          this.errorNotifyService.showError({
            title: "Error",
            message: "Email not found!",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
          this.router.navigate(['/forget-password']);
        } else if (message === "Password changed successfully") {
          console.log('Password changed successfully!');
          this.router.navigate(['/reset-success']);
        } else {
          this.errorNotifyService.showError({
            title: "Error",
            message: 'Unexpected response: ' + message,
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorNotifyService.showError({
          title: "Error",
          message: err.message,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}

