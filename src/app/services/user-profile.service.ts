import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ENDPOINTS } from '../shared/endpoints';
import { IUserInfo } from '../models/iuser-info';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userCache = new Map<number, Observable<IUserInfo>>();
  private cacheExpiry = new Map<number, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient, private router: Router) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private isCacheValid(userId: number): boolean {
    const expiry = this.cacheExpiry.get(userId);
    return expiry ? Date.now() < expiry : false;
  }

  private clearUserCache(userId: number): void {
    this.userCache.delete(userId);
    this.cacheExpiry.delete(userId);
  }

  GetUser(userId: number, forceRefresh: boolean = false): Observable<IUserInfo> {
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh && this.isCacheValid(userId) && this.userCache.has(userId)) {
      return this.userCache.get(userId)!;
    }

    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Create the HTTP request observable
    const request$ = this.http.get<IUserInfo>(ENDPOINTS.GET_USER(userId), { headers }).pipe(
      tap(() => {
        // Set cache expiry
        this.cacheExpiry.set(userId, Date.now() + this.CACHE_DURATION);
      }),
      shareReplay(1), // Share the result among multiple subscribers
      catchError(error => {
        console.error('Error fetching user:', error);
        // Clear cache on error
        this.clearUserCache(userId);
        return throwError(() => error);
      })
    );

    // Cache the observable
    this.userCache.set(userId, request$);

    return request$;
  }

  checkEmail(data: { email: string, oldPassword: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.post<any>(
      ENDPOINTS.CHECK_EMAIL,
      data,
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
      tap(() => {
        // Clear cache for current user after successful update
        const userId = localStorage.getItem('id');
        if (userId) {
          this.clearUserCache(parseInt(userId));
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Public method to clear cache (useful for logout, etc.)
  clearAllCache(): void {
    this.userCache.clear();
    this.cacheExpiry.clear();
  }
}