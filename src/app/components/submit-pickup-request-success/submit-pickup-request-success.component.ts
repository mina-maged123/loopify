import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-pickup-request-success',
  imports: [],
  templateUrl: './submit-pickup-request-success.component.html',
  styleUrl: './submit-pickup-request-success.component.css'
})
export class SubmitPickupRequestSuccessComponent {
  
  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/']);
  }

  onClose() {
    this.router.navigate(['/']);
  }
  
}
