// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule, Router } from '@angular/router';

// @Component({
//     selector: 'app-login',
//     imports: [CommonModule, FormsModule, RouterModule],
//     templateUrl: './login.component.html',
//     styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   showPassword = false;
//   email = '';
//   password = '';
//   rememberMe = false;
//   errorMessage = '';

//   constructor(private router: Router) {}

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   onSubmit(form: any) {
//     this.errorMessage = '';
//     if (form.invalid) {
//       this.errorMessage = 'Please fix the errors above.';
//       return;
//     }
//     localStorage.setItem('isLoggedIn', 'true');
//     this.router.navigate(['/']);
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ILoginUser } from '@/app/models/i-login-user.model';
import { AccountService } from '@/app/services/account.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginSuccess = false;
  errorMessage = '';
   showPassword = false;

  constructor(
    private fb: FormBuilder,
    private loginService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.loginSuccess = false;

      const formData: ILoginUser = this.loginForm.value;

      this.loginService.login(formData).subscribe({
        next: (response) => {
          console.log('Login response:', response);
  const token = response.data.token;

if (response && response.data && response.data.token) {
            localStorage.setItem('token', token); // optional: sessionStorage if rememberMe is false

 const decodedToken: any = jwtDecode(token);
  const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      this.router.navigate(['/']);
            

            this.loginSuccess = true;
          } 
          else {
            this.errorMessage = 'Login succeeded but token is missing.';
          }
        },
        error: (error) => {
          console.error('Login error:', error);

          if (error.error && error.error[""] && Array.isArray(error.error[""])) {
            this.errorMessage = error.error[""][0];
          } else if (typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid account. Please check your credentials.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }

          this.loginSuccess = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
