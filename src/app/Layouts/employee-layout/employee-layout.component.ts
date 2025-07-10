import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee-layout',
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.css'],
  imports: [RouterOutlet,RouterLinkActive]
})
export class EmployeeLayoutComponent {

  constructor(private router: Router) {}

logout() {
  localStorage.clear();
  console.log('Logout clicked. Redirecting...');
  this.router.navigate(['/login']).then(success => {
    console.log('Navigation Success?', success);
  });
}
}
