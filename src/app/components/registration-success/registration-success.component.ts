import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.css']
})
export class RegistrationSuccessComponent {

  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/login']);
  }

  onClose() {
    this.router.navigate(['/register']);
  }
}

