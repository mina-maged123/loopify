

import { Component, OnInit } from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { FooterComponent } from "./footer/footer.component";
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
// Layout components now handled by routing
@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  standalone: true,
  imports: [CommonModule, RouterOutlet],

})
export class AppComponent implements OnInit {
  title = 'project';
  role: any = '';
  showNavAndFooter = true;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('🚀 App component initialized');

    // Initial load
    this.role = localStorage.getItem('role') || '';
    console.log('📋 Initial role from localStorage:', this.role);

    // Wait for router to be ready, then redirect
    setTimeout(() => {
      this.redirectBasedOnRole();
    }, 200);

    // Listen for navigation changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('🧭 Navigation ended:', event.url);
        const oldRole = this.role;
        this.role = localStorage.getItem('role') || '';

        // Redirect if:
        // 1. We're on root path, OR
        // 2. Role changed (login/logout happened)
        if (event.url === '/' || oldRole !== this.role) {
          console.log('🔄 Role changed or on root, redirecting...');
          this.redirectBasedOnRole();
        }
      }
    });
  }

  redirectBasedOnRole(): void {
    const currentUrl = this.router.url;
    console.log('🔍 Current URL:', currentUrl, 'Role:', this.role); // Debug log

    // Don't redirect if already on auth pages
    const authPages = ['/login', '/register', '/forgot-password', '/verification-code', '/reset-password'];
    if (authPages.some(page => currentUrl.includes(page))) {
      console.log('⏸️ On auth page, skipping redirect');
      return;
    }

    // Add a small delay to ensure router is ready
    setTimeout(() => {
      if (this.role === 'Customer' && !currentUrl.startsWith('/customer')) {
        console.log('👤 Redirecting to customer');
        this.router.navigate(['/customer']);
      } else if (this.role === 'Employee' && !currentUrl.startsWith('/employee')) {
        console.log('👷 Redirecting to employee');
        this.router.navigate(['/employee']);
      } else if (this.role === 'Admin' && !currentUrl.startsWith('/admin')) {
        console.log('👨‍💼 Redirecting to admin');
        this.router.navigate(['/admin']);
      } else if (!this.role) {
        console.log('🚪 No role, redirecting to login');
        this.router.navigate(['/login']);
      } else {
        console.log('✅ Already on correct route');
      }
    }, 100);
  }


}
