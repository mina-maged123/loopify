import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '@/app/services/user-profile.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userProfileService: UserProfileService) { }

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
      alert('Please fill all required fields correctly');
      return;
    }

    if (this.forgotForm.value.newPassword !== this.forgotForm.value.confirmPassword) {
      alert('New password and confirmation must match');
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
          alert('Email not found!');
          this.router.navigate(['/forget-password']);
        } else if (message === "Password changed successfully") {
          console.log('Password changed successfully!');
          this.router.navigate(['/reset-success']);
        } else {
          alert('Unexpected response: ' + message);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        alert('Error: ' + (err.error || err.message));
      }
    });
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}

