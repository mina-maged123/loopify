import { Component, OnInit } from '@angular/core';
import{CommonModule} from '@angular/common';
import { NgFor, NgClass, DatePipe } from '@angular/common';


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
    totalRequests: 15,
    successfulPickups: 12,
    totalPoints: 1470
};

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

  constructor() { }

  ngOnInit(): void {
    // You could fetch user data from a service here
  }

  requestPickup(): void {
    // Implement request pickup functionality
    console.log('Request pickup clicked');
  }

  viewGifts(): void {
    // Implement view gifts functionality
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