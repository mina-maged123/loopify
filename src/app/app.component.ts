

import { Component, OnInit } from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { FooterComponent } from "./footer/footer.component";
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    console.log('🚀 App component initialized');

    // Check for auto-login on app initialization
    this.checkAutoLogin();

    // Listen for navigation changes to handle nav/footer visibility
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('🧭 Navigation ended:', event.url);
        this.updateNavFooterVisibility(event.url);
      }
    });
  }

  private checkAutoLogin(): void {
    const currentUrl = this.router.url;
    console.log('🔍 Current URL on init:', currentUrl);

    // Don't auto-login if already on auth pages
    const authPages = ['/login', '/register', '/forgot-password', '/verification-code', '/reset-password'];
    if (authPages.some(page => currentUrl.includes(page))) {
      console.log('⏸️ On auth page, skipping auto-login');
      return;
    }

    // Check if user is authenticated and redirect accordingly
    if (this.authService.isAuthenticated()) {
      console.log('🔐 User is authenticated, redirecting to dashboard');
      this.authService.navigateBasedOnRole();
    } else {
      console.log('🚪 User not authenticated');
      // Only redirect to login if not already on an auth page or home
      if (currentUrl === '/' || currentUrl === '') {
        this.router.navigate(['/login']);
      }
    }
  }

  private updateNavFooterVisibility(url: string): void {
    // Hide nav and footer on auth pages
    const authPages = ['/login', '/register', '/forgot-password', '/verification-code', '/reset-password'];
    this.showNavAndFooter = !authPages.some(page => url.includes(page));
  }




}
