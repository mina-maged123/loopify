import { SuccessNotificationContainerComponent } from './../../../success-notification/success-notification-container.component';
import { ErrorNotificationContainerComponent } from './../../../error-notification/error-notification-container.component';
import { NavComponent } from '@/app/nav/nav.component';
import { FooterComponent } from './../../../footer/footer.component';
import { UserProfileService } from '@/app/services/user-profile.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SuccessNotificationService } from '@/app/success-notification/success-notification.service';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, ErrorNotificationContainerComponent, SuccessNotificationContainerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  id: any;
  user: any = {};

  constructor(private userProfileService: UserProfileService, private router: Router,
    private successNotifyService: SuccessNotificationService, private errorNotifyService: ErrorNotificationService
  ) { }

  ngOnInit(): void {
    this.id = localStorage.getItem("id");
    this.userProfileService.GetUser(this.id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.empData.patchValue({
          fullName: this.user.fullName,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          employeeId: this.user.id,
          profilePictureUrl: this.user.profilePictureUrl,
        })
      }
    });
  }

  empData = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    employeeId: new FormControl('', [Validators.required]),
    profilePictureUrl: new FormControl(''),
  });

  updatePass = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
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
          this.successNotifyService.showSuccess({
            title: 'Success',
            message: "Profile updated successfully!",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        },
        error: (error) => {
          console.error('Full error object:', error);
          console.error('Error details:', error.error);
          console.error('Validation errors:', error.error?.errors);
          this.errorNotifyService.showError({
            title: 'Error',
            message: error,
            autoDismiss: true,
            autoDismissDelay: 3000
          });

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

            this.errorNotifyService.showError({
              title: 'Error',
              message: errorMessage,
              autoDismiss: true,
              autoDismissDelay: 3000
            });
          } else {
            this.errorNotifyService.showError({
              title: 'Error',
              message: `Failed to update profile.\nError: ${error.error?.title || error.message}`,
              autoDismiss: true,
              autoDismissDelay: 3000
            });
          }
        }
      });
    }
    else {
      this.errorNotifyService.showError({
        title: 'Error',
        message: "Please fix the form errors before saving.",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      console.log('Form errors:', this.empData.errors);
    }
  }

  updatePassword() {
    if (!this.updatePass.valid) {
      this.errorNotifyService.showError({
        title: 'Error',
        message: "Please fill all required fields correctly",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
      return;
    }

    if (this.updatePass.value.newPassword !== this.updatePass.value.confirmPassword) {
      this.errorNotifyService.showError({
        title: 'Error',
        message: "New password and confirmation must match",
        autoDismiss: true,
        autoDismissDelay: 3000
      });
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
          this.errorNotifyService.showError({
            title: 'Error',
            message: "Old password is incorrect!",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
          this.router.navigate(['/employee/profile']);
        }
        else if (response.message === "Password changed successfully.") {
          this.successNotifyService.showSuccess({
            title: 'Success',
            message: "Password changed successfully!",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
          this.router.navigate(['/reset-success']);
        } else {
          this.errorNotifyService.showError({
            title: 'Error',
            message: `Unexpected response: ${response.message}`,
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to change password';
        this.errorNotifyService.showError({
          title: 'Error',
          message: errorMessage,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

}