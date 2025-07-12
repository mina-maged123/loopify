import { Component, OnInit } from '@angular/core';
import{CommonModule} from '@angular/common';
import { NgFor, NgClass, DatePipe } from '@angular/common';
import { UserProfileService } from '../services/user-profile.service';
import { IUserInfo } from '../models/iuser-info';
import { response } from 'express';
import { Router } from '@angular/router';
import { ICustomerRequest } from '../models/ICustomerRequest';
import { RequestService } from '../services/request.service';


interface UserProfile {
  name: string;
  level: number;
  levelTitle: string;
  totalPoints: number;
  streak: number;
  progressPercentage: number;
  daysToNextLevel: number;
  currentLevel: number;
}

interface Stats {
  totalRequests: number;
  successfulPickups: number;
  totalPoints: number;
}

interface PickupRequest {
  type: string;
  date: Date;
  status: string;
  icon: string;
  iconColor: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,[NgFor, NgClass, DatePipe]],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  userProfile: UserProfile = {
    name: 'User',
    level: 3,
    levelTitle: 'Eco Warrior',
    totalPoints: 2450,
    streak: 5,
    progressPercentage: 75,
    daysToNextLevel: 10,
    currentLevel: 3
  };

  stats: Stats = {
    // totalRequests: 15,
    // successfulPickups: 12,
    // totalPoints: 1470
} as Stats;

recentRequests: PickupRequest[] = [
    {
      type: 'Plastic Bottles',
      date: new Date('2023-06-26'),
      status: 'Completed',
      icon: 'fa-bottle-water',
      iconColor: 'blue'
    },
    {
      type: 'Paper & Cardboard',
      date: new Date('2023-06-24'),
      status: 'In Progress',
      icon: 'fa-box',
      iconColor: 'yellow'
    },
    {
      type: 'Electronics',
      date: new Date('2023-06-22'),
      status: 'Pending',
      icon: 'fa-mobile-alt',
      iconColor: 'purple'
    }
  ];

  myUser : IUserInfo = {} as IUserInfo;
  myUserRequests : ICustomerRequest[] = [];

  constructor(private userProfileService: UserProfileService, private router:Router, private requestService: RequestService) { }

  ngOnInit(): void {
    

    let userId = Number(localStorage.getItem('id'));

    this.userProfileService.GetUser(userId).subscribe({
      next: (response) => {
        this.myUser = response;
        console.log(this.myUser);
      },
      error: (error) => {
        console.log(error);
      }
    });

    
    this.myUserRequests = [];
    this.recentRequests = [];

    this.requestService.getAllCustomerRequests().subscribe({
      next: (response) => {
        // console.log(response.data);
        this.myUserRequests = response.data;
        console.log(this.myUserRequests);

        this.myUserRequests.forEach((r) => {

          let allMaterials = "";
          r.materialWithQuantity.forEach((m => {
            allMaterials += m.name;
            allMaterials += ' | ';
          }));
          allMaterials = allMaterials.slice(0, allMaterials.length - 2);


          this.recentRequests.push({
            type: allMaterials,
            date: new Date(r.requestedDate),
            status: r.status,
            
          } as PickupRequest);
        });
        this.recentRequests = this.recentRequests.reverse();


        this.stats = {
          totalPoints: this.myUser.data.totalPoints ?? 0,
          totalRequests: this.recentRequests.length,
          successfulPickups: this.recentRequests.filter((r => r.status == "Collected")).length,
        } as Stats;
      },
      error: (error) => {
        console.log(error);
      }
    });


  }

  requestPickup(): void {
    // Implement request pickup functionality
    this.router.navigate(['/request']);
    console.log('Request pickup clicked');
  }

  viewGifts(): void {
    // Implement view gifts functionality
    this.router.navigate(['/gift']);
    console.log('View gifts clicked');
  }

  trackRequests(): void {
    // Implement track requests functionality
    console.log('Track requests clicked');
  }

  viewAllRequests(): void {
    // Implement view all requests functionality
    console.log('View all requests clicked');
  }

}