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
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '@/app/services/account.service';
import { ILoginUser } from '@/app/models/i-login-user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginSuccess = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rememberMe: new FormControl(false)
    });

  get getEmail() {
    return this.loginForm.get('emailAddress');
  }

  get getPassword() {
    return this.loginForm.get('password');
  }

  get getRememberMe() {
    return this.loginForm.get('emailAddress');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.loginSuccess = false;

      const formData : ILoginUser = this.loginForm.value as ILoginUser;

      this.accountService.login(formData).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          const token = response.data.token;
          const id = response.data.id;
          const role = response.data.role;

          if (response && response.data) {
            localStorage.setItem('token', token);
            localStorage.setItem('id', id);
            localStorage.setItem('role', role);

            this.router.navigate(['/']);
            this.loginSuccess = true;
          } else {
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
