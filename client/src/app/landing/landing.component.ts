import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from './auth.service';
import { NgOptimizedImage } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CopyButtonDirective } from './copy-button.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [NgOptimizedImage, ClipboardModule, CopyButtonDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly loading = signal(false);
  readonly passwordCopied = signal(false);
  readonly usernameCopied = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showSpinner = toSignal(
    toObservable(this.loading).pipe(debounceTime(500)),
    { initialValue: false },
  );

  private readonly authService = inject(AuthService);

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
      this.loading.set(false);
    } else {
      this.errorMessage.set(result.error || 'Invalid username or password');
      this.loading.set(false);
    }
  }

  handleCopiedUsername(copied: boolean, input: HTMLInputElement): void {
    this.usernameCopied.set(copied);
    if (copied) {
      input.focus();
    }
  }

  handleCopiedPassword(copied: boolean, input: HTMLInputElement): void {
    this.passwordCopied.set(copied);
    if (copied) {
      input.focus();
    }
  }
}
