import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-reset-success',
    imports: [CommonModule, RouterModule],
    templateUrl: './reset-success.component.html',
    styleUrls: ['./reset-success.component.css']
})
export class ResetSuccessComponent {

  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/login']);
  }
}

