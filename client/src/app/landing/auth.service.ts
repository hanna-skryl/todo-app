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
  private readonly initialized = signal(false);

  readonly authenticated = computed(
    () => this.loggedIn() && this.initialized(),
  );

  private readonly platformId = inject(PLATFORM_ID);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.set(localStorage.getItem('isLoggedIn') === 'true');
      this.initialized.set(true);

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
          map(async response => {
            const success = response.message === 'Login successful';
            if (success) {
              await this.router.navigate(['/dashboard/active-list']);
              this.loggedIn.set(true);
            } else {
              this.loggedIn.set(false);
            }
            return { success };
          }),
          catchError(error => {
            console.error('Login failed:', error);
            this.loggedIn.set(false);
            return of({ success: false, error: 'Login request failed' });
          }),
        ),
    );
  }

  logout(): void {
    this.loggedIn.set(false);
  }
}
