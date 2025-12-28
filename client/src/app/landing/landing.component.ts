import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService } from './auth.service';
import { NgOptimizedImage } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CopyButtonDirective } from './copy-button.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const LOADING_DEBOUNCE = 500;

@Component({
  selector: 'app-landing',
  imports: [
    NgOptimizedImage,
    ClipboardModule,
    CopyButtonDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showSpinner = toSignal(
    toObservable(this.loading).pipe(debounceTime(LOADING_DEBOUNCE)),
    { initialValue: false },
  );

  readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  private readonly usernameInput =
    viewChild<ElementRef<HTMLInputElement>>('usernameInput');
  private readonly passwordInput =
    viewChild<ElementRef<HTMLInputElement>>('passwordInput');

  handleCopied(copied: boolean, input: 'username' | 'password'): void {
    if (copied) {
      const inputRef =
        input === 'username' ? this.usernameInput() : this.passwordInput();

      if (inputRef) {
        inputRef.nativeElement.focus();
      }
    }
  }

  async handleLogin(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.getRawValue();
    const result = await this.authService.login(username, password);

    if (result.success) {
      await this.router.navigate(['/dashboard/active-list']);
    } else {
      this.errorMessage.set(result.error ?? 'Invalid username or password');
    }

    this.loading.set(false);
  }
}
