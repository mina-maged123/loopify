import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pickup-details',
  imports: [CommonModule],
  templateUrl: './pickup-details.component.html',
  styleUrl: './pickup-details.component.css'
})
export class AppComponent {
  title = 'Loopify';
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
