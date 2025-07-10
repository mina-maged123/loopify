import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-employee-dashboard',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'] 
})
export class EmployeeDashboardComponent {
  adminName = localStorage.getItem('fName');
  adminLocation = 'Admin Panel';

  constructor(private router: Router) {
    if (this.adminName == null) {
      this.adminName = "Admin Name";
    }
  }
}
