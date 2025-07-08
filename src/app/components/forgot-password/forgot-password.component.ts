import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  emailOrPhone = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.emailOrPhone.trim()) {
      // Simulate sending verification code
      console.log('Sending verification code to:', this.emailOrPhone);
      this.router.navigate(['/verification-code']);
    }
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}

