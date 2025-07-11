import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '@/app/services/user-profile.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userProfileService: UserProfileService) { }

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
        alert('Please fill all required fields correctly');
        return;
    }
    
    if (this.resetPassword.value.newPassword !== this.resetPassword.value.confirmPassword) {
        alert('New password and confirmation must match');
        return;
    }

    const passwords = {
        oldPassword: this.resetPassword.value.oldPassword || '',
        newPassword: this.resetPassword.value.newPassword || '',
        confirmPassword: this.resetPassword.value.confirmPassword || ''
    };

    this.userProfileService.changePassword(passwords).subscribe({
        next: () => {
            this.router.navigate(['/reset-success']);
        },
        error: (err) => {
            const errorMessage = err.error?.message || 'Failed to change password';
            alert(errorMessage);
        }
    });
  }


  goBackToLogin() {
    this.router.navigate(['/setting']);
  }
}

