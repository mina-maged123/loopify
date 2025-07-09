import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private accountService: AccountService, private router: Router) { }

  userData = new FormGroup({
    FirstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    LastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    EmailAddress: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    Address : new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    ConfirmPassword: new FormControl('', [Validators.required]),
  });


  get getFName() {
    return this.userData.controls['FirstName'];
  }

  get getLName() {
    return this.userData.controls['LastName'];
  }

  get getEmail() {
    return this.userData.controls['EmailAddress'];
  }

  get getAddress() {
    return this.userData.controls['Address'];
  }

  get getPhoneNumber() {
    return this.userData.controls['PhoneNumber'];
  }

  get getPassword() {
    return this.userData.controls['Password'];
  }

  get getConfirmPassword() {
    return this.userData.controls['ConfirmPassword'];
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

