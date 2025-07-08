import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerificationCodeComponent } from './components/verification-code/verification-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetSuccessComponent } from './components/reset-success/reset-success.component';
import { RegistrationFailedComponent } from './components/registration-failed/registration-failed.component';
import { RegistrationSuccessComponent } from './components/registration-success/registration-success.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'verification-code', component: VerificationCodeComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-success', component: ResetSuccessComponent },
    { path: 'registration-failed', component: RegistrationFailedComponent },
    { path: 'registration-success', component: RegistrationSuccessComponent },
    { path: '**', redirectTo: '' }
  
];
