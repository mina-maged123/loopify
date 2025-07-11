import { UserProfileService } from '@/app/services/user-profile.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Bell, Calendar, Lock, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  readonly Bell = Bell;
  readonly Calendar = Calendar;
  readonly Lock = Lock;
  readonly LogOut = LogOut;
  id : any;
  user : any = {};

  constructor(private router: Router, private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.id = localStorage.getItem("id");
    this.userProfileService.GetUser(this.id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.userData.patchValue({
          fullName : this.user.fullName,
          email : this.user.email,
          phoneNumber : this.user.phoneNumber,
          profilePictureUrl : this.user.profilePictureUrl,
          address : this.user.address,
          createdAt : this.user.createdAt
        })
      }
    });
  }

  userData = new FormGroup({
    fullName: new FormControl('', Validators.minLength(3)),
    email: new FormControl('', Validators.email),
    phoneNumber: new FormControl('', Validators.maxLength(11)),
    profilePictureUrl: new FormControl(''),
    address: new FormControl('', Validators.required),
    createdAt: new FormControl('')
  });


  saveEdit() {
    console.log('Form status:', this.userData.status);
    console.log('Form value:', this.userData.value);
    console.log('Form errors:', this.userData.errors);

    if (this.userData.status == "VALID") {
      // Prepare data wrapped in UserInfoDto as expected by API
      const updateData = {
        UserInfoDto: {
          fullName: this.userData.value.fullName || '',
          email: this.userData.value.email || '',
          phoneNumber: this.userData.value.phoneNumber || '',
          address: this.userData.value.address || '',
          profilePictureUrl: this.userData.value.profilePictureUrl || ''
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
      console.log('Form errors:', this.userData.errors);
    }
  }




  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}