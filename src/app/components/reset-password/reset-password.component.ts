import { response } from 'express';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '@/app/services/user-profile.service';
import { ErrorNotificationContainerComponent } from '@/app/error-notification/error-notification-container.component';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ErrorNotificationContainerComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userProfileService: UserProfileService,
    private errorNotifyService: ErrorNotificationService
  ) { }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get getOldPassword() {
    return this.resetPassword.get('oldPassword');
  }

  get getNewPassword() {
    return this.resetPassword.get('newPassword');
  }

  get getConfirmPassword() {
    return this.resetPassword.get('confirmPassword');
  }


  changePassword() {
    if (!this.resetPassword.valid) {
      this.errorNotifyService.showError({
        title: "Error",
        message: "Please fill all required fields correctly",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      return;
    }

    if (this.resetPassword.value.newPassword !== this.resetPassword.value.confirmPassword) {
      this.errorNotifyService.showError({
        title: "Error",
        message: "New password and confirmation must match",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      return;
    }

    const passwords = {
      oldPassword: this.resetPassword.value.oldPassword || '',
      newPassword: this.resetPassword.value.newPassword || '',
      confirmPassword: this.resetPassword.value.confirmPassword || ''
    };

    this.userProfileService.changePassword(passwords).subscribe({
      next: (response) => {
        if (response.message === "Old password is incorrect.") {
          this.errorNotifyService.showError({
            title: "Error",
            message: "Old password is incorrect!",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
          this.router.navigate(['/reset-password']);
        } else if (response.message === "Password changed successfully") {
          console.log('Password changed successfully!');
          this.router.navigate(['/reset-success']);
        } else {
          this.errorNotifyService.showError({
            title: "Error",
            message: 'Unexpected response: ' + response.message,
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to change password';
        this.errorNotifyService.showError({
          title: "Error",
          message: errorMessage,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }


  goBackToLogin() {
    this.router.navigate(['/setting']);
  }
}

