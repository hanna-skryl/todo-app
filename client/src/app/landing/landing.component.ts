import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgOptimizedImage } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-landing',
  imports: [NgOptimizedImage, ClipboardModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly loading = signal(false);
  readonly showSpinner = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showSuccessMessage = signal<
    Record<'username' | 'password', boolean>
  >({
    username: false,
    password: false,
  });

  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  private spinnerTimeout?: NodeJS.Timeout;

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.spinnerTimeout = setTimeout(() => this.showSpinner.set(true), 500);
      } else {
        clearTimeout(this.spinnerTimeout);
        this.showSpinner.set(false);
      }
    });
  }

  async handleLogin(event: Event): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const result = await this.authService.login(username, password);

    if (result.success) {
      this.router.navigate(['/dashboard/active-list']);
    } else {
      this.errorMessage.set(result.error || 'Invalid username or password');
    }

    this.loading.set(false);
    clearTimeout(this.spinnerTimeout);
    this.showSpinner.set(false);
  }

  copyText(type: 'username' | 'password'): void {
    this.showSuccessMessage.update(items => ({
      ...items,
      [type]: true,
    }));
    setTimeout(() => {
      this.showSuccessMessage.set({
        username: false,
        password: false,
      });
    }, 1000);
  }
}
