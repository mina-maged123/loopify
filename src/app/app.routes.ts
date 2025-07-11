import { SettingComponent } from './components/setting/setting.component';
import { GiftComponent } from './components/gift/gift.component';
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
import { AuthGuard } from './guards/auth.guard';

import { EmployeeDashboardComponent } from './components/Employee/employee-dashboard/employee-dashboard.component';
import { EmployeeLayoutComponent } from './Layouts/employee-layout/employee-layout.component';
import { CustomerLayoutComponent } from './Layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './Layouts/admin-layout/admin-layout.component';

import { RequestComponent } from './request/request.component';
import { SubmitPickupRequestSuccessComponent } from './components/submit-pickup-request-success/submit-pickup-request-success.component';
import { PickUpRequestComponent } from './components/Employee/pick-up-request/pick-up-request.component';
import { ViewMapComponent } from './components/Employee/view-map/view-map.component';

import { ReportIssueComponent } from './components/Employee/report-issue/report-issue.component';
import { ProfileComponent } from './components/Employee/profile/profile.component';
import { PickupDetailsComponent } from './components/Employee/pickup-details/pickup-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'verification-code',
    component: VerificationCodeComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'reset-success',
    component: ResetSuccessComponent
  },
  {
    path: 'registration-failed',
    component: RegistrationFailedComponent
  },
  {
    path: 'registration-success',
    component: RegistrationSuccessComponent
  },

  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'gift', component: GiftComponent },
      { path: 'request', component: RequestComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'dashboard', component: DashboardComponent }
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [],
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: EmployeeDashboardComponent },
      { path: 'pickup', component: PickUpRequestComponent },
      { path: 'map-view', component: ViewMapComponent },
      { path: 'report-issue', component: ReportIssueComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'details/:id', component: PickupDetailsComponent }
    ],
  },

  {
    path: 'request',
    component: RequestComponent
  },
  {
    path: 'submit-pickup-request-success',
    component: SubmitPickupRequestSuccessComponent
  },

  {
    path: '**',
    redirectTo: ''
  }


];
