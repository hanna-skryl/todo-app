import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/landing/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ModeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly authenticated = computed(() => this.authService.authenticated());

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
