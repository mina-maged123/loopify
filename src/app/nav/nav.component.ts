import { Component, OnInit, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
    selector: 'app-nav',
    imports: [NgIf, RouterModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  Id : any;
  userName : string = '';
  userEmail : string = '';
  isDropdownOpen = false;

  constructor(private router: Router, private userProfileService: UserProfileService, private browserStorage: BrowserStorageService ) {}

  ngOnInit() {
    this.Id = this.browserStorage.getItem('id');
    if (this.Id) {
      this.userProfileService.GetUser(this.Id).subscribe({
        next: (response) => {
          this.userName = response.data.fullName;
          this.userEmail = response.data.email;
        },
        error : (error) => {
          console.log(error);
        }
      })
    }
  }

  isLoggedIn(): boolean {
    return !!this.browserStorage.getItem('token') && !!this.browserStorage.getItem('id');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.browserStorage.removeItem('token');
    this.browserStorage.removeItem('id');
    this.browserStorage.removeItem('role');
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
