import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  role: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    role: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private router: Router) {
    // Initialize auth state from localStorage on service creation
    if (this.isLocalStorageAvailable()) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        this.initializeAuthState();
      }, 0);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    } catch (error) {
      return false;
    }
  }

  private initializeAuthState(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      const role = localStorage.getItem('role');

      if (token && userId && role) {
        this.authStateSubject.next({
          isAuthenticated: true,
          token,
          userId,
          role
        });
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }

  isAuthenticated(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      const role = localStorage.getItem('role');

      return !!(token && userId && role);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  }

  getRole(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    try {
      return localStorage.getItem('role');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  getUserId(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    try {
      return localStorage.getItem('id');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  getToken(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  login(token: string, userId: string, role: string): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('id', userId);
      localStorage.setItem('role', role);

      // Update auth state
      this.authStateSubject.next({
        isAuthenticated: true,
        token,
        userId,
        role
      });

      // Navigate based on role
      this.navigateBasedOnRole(role);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  logout(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');

      // Update auth state
      this.authStateSubject.next({
        isAuthenticated: false,
        token: null,
        userId: null,
        role: null
      });

      // Navigate to login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  navigateBasedOnRole(role?: string): void {
    const userRole = role || this.getRole();
    
    if (userRole === 'Customer') {
      this.router.navigate(['/customer/dashboard']);
    } else if (userRole === 'Employee') {
      this.router.navigate(['/employee']);
    } else if (userRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Check if user should be auto-logged in and redirect accordingly
  checkAutoLogin(): void {
    if (this.isAuthenticated()) {
      const role = this.getRole();
      console.log('🔐 User already authenticated, redirecting to:', role);
      this.navigateBasedOnRole(role!);
    } else {
      console.log('🚪 User not authenticated, staying on current page or redirecting to login');
    }
  }
}
