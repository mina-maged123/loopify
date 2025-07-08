import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  phoneNumber = '';
  email = '';
  password = '';
  confirmPassword = '';
  address = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    if (form.invalid || this.password !== this.confirmPassword) {
      this.errorMessage = 'Please fix the errors above.';
      return;
    }

    // Simulate registration process
    try {
      console.log({
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        address: this.address
      });

      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.5;
      if (success) {
        this.router.navigate(['/registration-success']);
      } else {
        this.router.navigate(['/registration-failed']);
      }
    } catch (error) {
      this.router.navigate(['/registration-failed']);
    }
  }
}

