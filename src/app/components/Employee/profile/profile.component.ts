import { UserProfileService } from '@/app/services/user-profile.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  id : any;
  user : any = {};

  constructor(private userProfileService: UserProfileService, private router: Router) { }

  ngOnInit(): void {
    this.id = localStorage.getItem("id");
    this.userProfileService.GetUser(this.id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.empData.patchValue({
          fullName : this.user.fullName,
          email : this.user.email,
          phoneNumber : this.user.phoneNumber,
          employeeId : this.user.id,
          profilePictureUrl : this.user.profilePictureUrl,
        })
      }
    });
  }
  
  empData = new FormGroup({
    fullName: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    phoneNumber: new FormControl('',[Validators.required]),
    employeeId: new FormControl('',[Validators.required]),
    profilePictureUrl: new FormControl(''),
  });

  updatePass = new FormGroup({
    currentPassword: new FormControl('',[Validators.required]),
    newPassword: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
  });

  get getCurrentPassword() {
    return this.updatePass.get('currentPassword');
  }

  get getNewPassword() {
    return this.updatePass.get('newPassword');
  }

  get getConfirmPassword() {
    return this.updatePass.get('confirmPassword');
  }
  
  saveChanges() {
    if (this.empData.status == "VALID") {
      // Prepare data wrapped in UserInfoDto as expected by API
      const updateData = {
        UserInfoDto: {
          fullName: this.empData.value.fullName || '',
          email: this.empData.value.email || '',
          phoneNumber: this.empData.value.phoneNumber || '',
          employeeId: this.empData.value.employeeId || '',
          profilePictureUrl: this.empData.value.profilePictureUrl || ''
        }
      };

      console.log('Sending data with UserInfoDto wrapper:', updateData);

      this.userProfileService.updateUser(updateData).subscribe({
        next: () => {
          this.user = { ...this.user, ...updateData.UserInfoDto };
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Full error object:', error);
          console.error('Error details:', error.error);
          console.error('Validation errors:', error.error?.errors);

          // Show specific validation errors if available
          if (error.error && error.error.errors) {
            console.log('Processing validation errors...');
            let errorMessage = 'Validation errors:\n\n';

            for (const field in error.error.errors) {
              const fieldErrors = error.error.errors[field];
              console.log(`Field: ${field}, Errors:`, fieldErrors);

              if (Array.isArray(fieldErrors)) {
                errorMessage += `• ${field}: ${fieldErrors.join(', ')}\n`;
              } else {
                errorMessage += `• ${field}: ${fieldErrors}\n`;
              }
            }

            alert(errorMessage);
          } else {
            alert(`Failed to update profile.\nError: ${error.error?.title || error.message}`);
          }
        }
      });
    }
    else {
      alert("Please fix the form errors before saving.");
      console.log('Form errors:', this.empData.errors);
    }
  }
  
  updatePassword() {
    if (!this.updatePass.valid) {
        alert('Please fill all required fields correctly');
        return;
    }
    
    if (this.updatePass.value.newPassword !== this.updatePass.value.confirmPassword) {
        alert('New password and confirmation must match');
        return;
    }

    const passwords = {
        oldPassword: this.updatePass.value.currentPassword || '',
        newPassword: this.updatePass.value.newPassword || '',
        confirmPassword: this.updatePass.value.confirmPassword || ''
    };

    this.userProfileService.changePassword(passwords).subscribe({
        next: (response) => {
            if (response.message === "Old password is incorrect.") {
                alert('Old password is incorrect!');
                this.router.navigate(['/employee/profile']);
            } 
            else if (response.message === "Password changed successfully.") {
                console.log('Password changed successfully!');
                this.router.navigate(['/reset-success']);
            } else {
                alert('Unexpected response: ' + response.message);
            }
        },
        error: (err) => {
            const errorMessage = err.error?.message || 'Failed to change password';
            alert(errorMessage);
        }
    });
  }

}