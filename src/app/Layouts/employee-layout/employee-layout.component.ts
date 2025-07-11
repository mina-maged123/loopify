import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-employee-layout',
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive] // 👈 زودي RouterLink هنا
})
export class EmployeeLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
