import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.apiUrl;

  private readonly loggedIn = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.loggedIn.set(isLoggedIn);
    } else {
      this.loggedIn.set(false);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpClient.post<{ message: string }>(`${this.url}/users/login`, {
          username,
          password,
        }),
      );
      if (response && response.message === 'Login successful') {
        this.loggedIn.set(true);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('isLoggedIn', 'true');
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  logout(): void {
    this.loggedIn.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return (
      this.loggedIn() ||
      (isPlatformBrowser(this.platformId) &&
        localStorage.getItem('isLoggedIn') === 'true')
    );
  }
}
