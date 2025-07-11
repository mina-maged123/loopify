import { UserProfileService } from '@/app/services/user-profile.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Bell, Calendar, Lock, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  readonly Bell = Bell;
  readonly Calendar = Calendar;
  readonly Lock = Lock;
  readonly LogOut = LogOut;
  id : any;
  user : any = {};

  constructor(private router: Router, private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.id = localStorage.getItem("id");
    this.userProfileService.GetUser(this.id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.userData.patchValue({
          fullName : this.user.fullName,
          email : this.user.email,
          phoneNumber : this.user.phoneNumber,
          profilePictureUrl : this.user.profilePictureUrl,
          address : this.user.address,
          createdAt : this.user.createdAt
        })
      }
    });
  }

  userData = new FormGroup({
    fullName: new FormControl('', Validators.minLength(3)),
    email: new FormControl('', Validators.email),
    phoneNumber: new FormControl('', Validators.maxLength(11)),
    profilePictureUrl: new FormControl(''),
    address: new FormControl('', Validators.required),
    createdAt: new FormControl('')
  });










  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}