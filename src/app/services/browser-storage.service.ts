import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  /**
   * Safely get item from localStorage
   * @param key The key to retrieve
   * @returns The value or null if not found or not in browser
   */
  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Safely set item in localStorage
   * @param key The key to set
   * @param value The value to set
   */
  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Safely remove item from localStorage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  /**
   * Check if we're in browser environment
   * @returns true if in browser, false otherwise
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
