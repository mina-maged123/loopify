import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-registration-failed',
    imports: [CommonModule, RouterModule],
    templateUrl: './registration-failed.component.html',
    styleUrls: ['./registration-failed.component.css']
})
export class RegistrationFailedComponent {

  constructor(private router: Router) {}

  onTryAgain() {
    this.router.navigate(['/register']);
  }

  onClose() {
    this.router.navigate(['/register']);
  }
}

