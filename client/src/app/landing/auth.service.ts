import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { environment } from '../environments/environment';

type LoginResult = {
  success: boolean;
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.apiUrl;

  private readonly loggedIn = signal(false);
  readonly isInitialized = signal(false);

  readonly isLoggedIn = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      return this.loggedIn() || localStorage.getItem('isLoggedIn') === 'true';
    }
    return this.loggedIn();
  });

  private readonly platformId = inject(PLATFORM_ID);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.set(localStorage.getItem('isLoggedIn') === 'true');
      this.isInitialized.set(true);

      effect(() => {
        if (this.loggedIn()) {
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          localStorage.removeItem('isLoggedIn');
          this.router.navigate(['/login']);
        }
      });
    }
  }

  async login(username: string, password: string): Promise<LoginResult> {
    return firstValueFrom(
      this.httpClient
        .post<{ message: string }>(`${this.url}/users/login`, {
          username,
          password,
        })
        .pipe(
          map(response => {
            const success = response.message === 'Login successful';
            this.loggedIn.set(success);
            return { success };
          }),
          catchError(error => {
            console.error('Login failed:', error);
            return of({ success: false, error: 'Login request failed' });
          }),
        ),
    );
  }

  logout(): void {
    this.loggedIn.set(false);
  }
}
