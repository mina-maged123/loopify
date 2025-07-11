import { Component, OnInit, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [NgIf, RouterModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  Id : any;
  userName : string = '';
  userEmail : string = '';
  isDropdownOpen = false;

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
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



  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    this.userName = '';
    this.userEmail = '';
    this.router.navigate(['/login']);
    this.closeDropdown();
  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userSection = target.closest('.user-section');

    if (!userSection && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }
}
