import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  untracked,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly httpClient = inject(HttpClient);

  private readonly loggedIn = signal(false);
  private readonly initialized = signal(false);

  readonly authenticated = computed(
    () => this.loggedIn() && this.initialized(),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.set(localStorage.getItem('isLoggedIn') === 'true');
      this.initialized.set(true);

      effect(() => {
        const isLoggedIn = this.loggedIn();
        untracked(() => {
          if (isLoggedIn) {
            localStorage.setItem('isLoggedIn', 'true');
          } else {
            localStorage.removeItem('isLoggedIn');
          }
        });
      });
    }
  }

  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const response = await firstValueFrom(
        this.httpClient.post<{ message: string }>(`${this.url}/users/login`, {
          username,
          password,
        }),
      );

      const success = response.message === 'Login successful';
      this.loggedIn.set(success);
      return { success };
    } catch (error) {
      console.error('Login failed:', error);
      this.loggedIn.set(false);
      return { success: false, error: 'Login request failed' };
    }
  }

  logout(): void {
    this.loggedIn.set(false);
  }
}
