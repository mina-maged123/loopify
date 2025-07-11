import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IUserInfo } from '../models/iuser-info';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient, private router: Router) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  GetUser(userId: number): Observable<IUserInfo> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IUserInfo>(ENDPOINTS.GET_USER(userId), { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      })
    );
  }

  checkEmail(email: any): Observable<{ isExist: boolean }> {
    return this.http.post<{ isExist: boolean }>(
      ENDPOINTS.CHECK_EMAIL,
      { email },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  changePassword(passwords: { oldPassword: string, newPassword: string, confirmPassword: string }): Observable<{ message: string }> {
    const token = this.getToken(); 
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.post<{ message: string }>(
      ENDPOINTS.CHANGE_PASSWORD,
      passwords, 
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  updateUser(user: any): Observable<{message: string}> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }
  
    return this.http.put<{message: string}>(
      ENDPOINTS.UPDATE_USER,
      user,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}