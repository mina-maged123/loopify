import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { IRegisterUser } from '../../models/iregister-user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private accountService: AccountService, private router: Router) { }

  userData = new FormGroup({
    FirstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    LastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    EmailAddress: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    Address: new FormControl(''),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: this.passwordMatchValidator() });


  // Getters for form controls
  get getFName() { return this.userData.get('FirstName'); }
  get getLName() { return this.userData.get('LastName'); }
  get getEmail() { return this.userData.get('EmailAddress'); }
  get getPhoneNumber() { return this.userData.get('PhoneNumber'); }
  get getAddress() { return this.userData.get('Address'); }
  get getPassword() { return this.userData.get('Password'); }
  get getConfirmPassword() { return this.userData.get('ConfirmPassword'); }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }
      const password = control.get('Password')?.value;
      const confirmPassword = control.get('ConfirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  registerOperation() {
    if (this.userData.valid) {
      const formValues = this.userData.value;

      // Map to match API expected field names
      const dataToSend: IRegisterUser = {
        FirstName: formValues.FirstName ?? '',
        LastName: formValues.LastName ?? '',
        EmailAddress: formValues.EmailAddress ?? '',
        PhoneNumber: formValues.PhoneNumber ?? '',
        Address: formValues.Address ? (formValues.Address.trim() === '' ? null : formValues.Address) : null,
        Password: formValues.Password ?? '',
        ConfirmPassword: formValues.ConfirmPassword ?? ''
      };

      console.log('Payload to send:', JSON.stringify(dataToSend, null, 2)); // Debugging

      this.accountService.register(dataToSend).subscribe({
        next: (response) => {
          console.log(response);
          if (response.isSuccess) {
            this.router.navigate(['/registration-success']);
          }
          else {
            this.router.navigate(['/registration-failed']);
          }
          if (response.message) {
            alert(response.message);
          }
        }
      })
    }
    else {
      this.router.navigate(['/registration-failed']);
    }
  }

}