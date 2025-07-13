import { Component, OnInit, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { AuthService } from '../services/auth.service';
import { NotificationsComponent } from '../components/notifications/notifications.component';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [NgIf, RouterModule, NotificationsComponent],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  Id : any;
  userName : string = '';
  userEmail : string = '';
  isDropdownOpen = false;
  isNotificationsOpen = false;

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }


  loadUserData() {
    this.Id = localStorage.getItem('id');
    if (this.Id && this.isLoggedIn()) {
      this.userProfileService.GetUser(this.Id).subscribe({
        next: (response) => {
          this.userName = response.data.fullName;
          this.userEmail = response.data.email;
        },
        error: (error) => {
          console.log('Error loading user data:', error);
          // Handle unauthorized error - maybe force logout
          if (error.status === 401) {
            this.logout();
          }
        }
      });
    }
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('id');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isDropdownOpen = false; // Close user dropdown if open
    }
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }



  logout(): void {
    // Use AuthService for logout
    this.authService.logout();

    // Clear local component state
    this.userName = '';
    this.userEmail = '';
    this.closeDropdown();
  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userSection = target.closest('.user-section');

    if (!userSection) {
      if (this.isDropdownOpen) {
        this.closeDropdown();
      }
      if (this.isNotificationsOpen) {
        this.closeNotifications();
      }
    }
  }
}
