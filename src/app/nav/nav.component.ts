import { Component, OnInit, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    imports: [NgIf, RouterModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  Id : any;
  isDropdownOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.Id = localStorage.getItem('id');
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
