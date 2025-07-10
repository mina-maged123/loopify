import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from './services/browser-storage.service';
import { NavComponent } from "./nav/nav.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'project';
  role : any = '';

  constructor(private browserStorage: BrowserStorageService) {}

  ngOnInit(): void {
    this.role = this.browserStorage.getItem('role');
  }
}
