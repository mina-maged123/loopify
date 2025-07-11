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

  constructor(private router: Router, private userProfileService: UserProfileService) {}

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get getEmail() {
    return this.forgotForm.get('email');
  }

  checkEmail() {
    if (this.forgotForm.valid) {
    this.userProfileService.checkEmail(this.forgotForm.value.email).subscribe({
      next: (res) => {
        if (res.isExist) {
          this.router.navigate(['/reset-password']);
        } else {
          alert('Email not registered!');
          this.router.navigate(['/forgot-password']);
        }
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}

