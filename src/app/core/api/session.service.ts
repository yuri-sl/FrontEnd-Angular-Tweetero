import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private username = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || '';
    }
  }

  setUsername(name: string): void {
    this.username = name;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('username', name);
    }
  }

  getUsername(): string {
    return this.username;
  }

  clearUsername(): void {
    this.username = '';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('username');
    }
  }

  isLoggedIn(): boolean {
    return this.username.trim().length > 0;
  }
}
