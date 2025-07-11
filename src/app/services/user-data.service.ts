import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfileService } from './user-profile.service';

export interface UserData {
  id: string | null;
  userName: string;
  userEmail: string;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<UserData>({
    id: null,
    userName: '',
    userEmail: '',
    isLoggedIn: false
  });

  public userData$ = this.userDataSubject.asObservable();

  constructor(
    private userProfileService: UserProfileService
  ) {
    this.initializeUserData();
  }

  private initializeUserData() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const cachedUserName = localStorage.getItem('userName');
    const cachedUserEmail = localStorage.getItem('userEmail');

    if (id && token) {
      // User is logged in, load cached data first
      this.userDataSubject.next({
        id,
        userName: cachedUserName || '',
        userEmail: cachedUserEmail || '',
        isLoggedIn: true
      });

      // Then fetch fresh data if we have an ID
      if (id) {
        this.fetchUserData(id);
      }
    }
  }

  private fetchUserData(userId: string) {
    this.userProfileService.GetUser(parseInt(userId)).subscribe({
      next: (response) => {
        const userData = {
          id: userId,
          userName: response.data.fullName,
          userEmail: response.data.email,
          isLoggedIn: true
        };

        // Update the subject
        this.userDataSubject.next(userData);

        // Cache the data
        localStorage.setItem('userName', response.data.fullName);
        localStorage.setItem('userEmail', response.data.email);
      },
      error: (error) => {
        console.log('Error fetching user data:', error);
      }
    });
  }

  // Method to refresh user data
  refreshUserData() {
    const id = localStorage.getItem('id');
    if (id) {
      this.fetchUserData(id);
    }
  }

  // Method to clear user data on logout
  clearUserData() {
    this.userDataSubject.next({
      id: null,
      userName: '',
      userEmail: '',
      isLoggedIn: false
    });
  }

  // Method to set user data after login
  setUserLoggedIn(id: string) {
    localStorage.setItem('id', id);
    this.initializeUserData();
  }
}
