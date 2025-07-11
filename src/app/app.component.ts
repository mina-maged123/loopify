import { Component, OnInit } from '@angular/core';
import { EmployeeLayoutComponent } from "./Layouts/employee-layout/employee-layout.component";
import { AdminLayoutComponent } from "./Layouts/admin-layout/admin-layout.component";
import { CustomerLayoutComponent } from "./Layouts/customer-layout/customer-layout.component";
import { NavComponent } from "./nav/nav.component";
import { RouterOutlet } from "../../node_modules/@angular/router/router_module.d-Bx9ArA6K";
import { FooterComponent } from "./footer/footer.component";
@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'project';
  role : any = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }
}
