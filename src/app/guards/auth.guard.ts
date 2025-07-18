import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      const role = localStorage.getItem('role');

      if (token && id && role) {
        return true;
      }
    }

    // Redirect if not authenticated or not in browser
    this.router.navigate(['/login']);
    return false;
  }
}