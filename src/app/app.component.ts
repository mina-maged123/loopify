

import { Component, OnInit } from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    
    templateUrl: './app.component.html',
     styleUrl: './app.component.css',
  
  standalone: true,
  imports: [NavComponent, RouterOutlet, FooterComponent, CommonModule],
 
})
export class AppComponent implements OnInit {
  title = 'project';
  role : any = '';
  showNavAndFooter = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.url);
    });

    // Check initial route
    this.checkRoute(this.router.url);
  }

  private checkRoute(url: string): void {
    // Hide nav and footer on login and register pages
    const hideNavRoutes = ['/login', '/register', '/forgot-password', '/verification-code', '/reset-password', '/reset-success', '/registration-failed', '/registration-success'];
    this.showNavAndFooter = !hideNavRoutes.includes(url);
  }
}
