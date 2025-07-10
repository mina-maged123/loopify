import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-verification-code',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './verification-code.component.html',
    styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent implements OnInit, OnDestroy {
  verificationCode = ['', '', '', '', '', ''];
  countdown = 45;
  private countdownInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  onCodeInput(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 5) {
      // Move to next input
      const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      // Move to previous input
      const prevInput = event.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onVerify() {
    const code = this.verificationCode.join('');
    if (code.length === 6) {
      console.log('Verification code:', code);
      this.router.navigate(['/reset-password']);
    }
  }

  onResend() {
    this.countdown = 45;
    this.startCountdown();
    console.log('Resending verification code...');
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

