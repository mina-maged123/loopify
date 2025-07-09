import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./footer/footer.component";
import { RequestComponent } from "./request/request.component";
import { NavComponent } from "./nav/nav.component";
import { LoginComponent } from "./components/login/login.component";

@Component({
    selector: 'app-root',
    imports: [NavComponent, RequestComponent, HomeComponent, FooterComponent, RouterOutlet, LoginComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
}
