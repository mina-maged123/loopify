import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  email = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    if (form.invalid) {
      this.errorMessage = 'Please fix the errors above.';
      return;
    }
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/']);
  }
}

