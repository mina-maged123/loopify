import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private accountService: AccountService, private router: Router) { }

  userData = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get getFName() {
    return this.userData.controls['firstName'];
  }

  get getLName() {
    return this.userData.controls['lastName'];
  }

  get getEmail() {
    return this.userData.controls['email'];
  }

  get getAddress() {
    return this.userData.controls['address'];
  }

  get getPhoneNumber() {
    return this.userData.controls['phoneNumber'];
  }

  get getPassword() {
    return this.userData.controls['password'];
  }

  get getConfirmPassword() {
    return this.userData.controls['confirmPassword'];
  }

  registerOperation() {
    if (this.userData.status == "VALID") {
      console.log(this.userData.value);
      this.accountService.register(this.userData.value).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/registration-success']);
        }
      })
    }
    else {
      this.router.navigate(['/registration-failed']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

