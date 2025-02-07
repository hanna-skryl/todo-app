import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
  errorMessage: string | null = null;

  readonly showSuccessMessage = signal<
    Record<'username' | 'password', boolean>
  >({
    username: false,
    password: false,
  });

  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const success = await this.authService.login(username, password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
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
