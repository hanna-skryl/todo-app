import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Subject } from 'rxjs';
import type { Mode } from '../models';
import {
  DARK_MODE_CLASS_NAME,
  LIGHT_MODE_CLASS_NAME,
  PREFERS_COLOR_SCHEME_DARK,
} from '../constants';
import { ModeStore } from '../store/mode.store';

@Component({
  selector: 'app-mode-toggle',
  imports: [NgOptimizedImage],
  templateUrl: './mode-toggle.component.html',
  styleUrl: './mode-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeToggleComponent {
  private readonly store = inject(ModeStore);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly modeIcon = computed(
    () =>
      `assets/images/icon-${this.store.mode() === 'dark' ? 'sun' : 'moon'}.svg`,
  );

  // TODO: Remove when signal-based components are available.
  // Now the app is zoneless, so the subjects is required to notify that mode has changed.
  private readonly modeChanged$ = new Subject<void>();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.initializeModeFromPreferences();
    this.watchPreferredColorScheme();
  }

  private initializeModeFromPreferences(): void {
    const storedPreference = this.store.getModePreference();
    const modeToUse = storedPreference ?? preferredScheme();

    this.store.updateMode(modeToUse);
    this.setModeClasses(modeToUse);
  }

  updateMode(): void {
    this.store.toggleMode();
    this.store.updateModePreference();
    this.setModeClasses(this.store.mode());
  }

  private setModeClasses(mode: Mode): void {
    const documentClassList = this.document.documentElement.classList;
    if (mode === 'dark') {
      documentClassList.add(DARK_MODE_CLASS_NAME);
      documentClassList.remove(LIGHT_MODE_CLASS_NAME);
    } else {
      documentClassList.add(LIGHT_MODE_CLASS_NAME);
      documentClassList.remove(DARK_MODE_CLASS_NAME);
    }
    this.modeChanged$.next();
  }

  private watchPreferredColorScheme(): void {
    window
      .matchMedia(PREFERS_COLOR_SCHEME_DARK)
      .addEventListener('change', event => {
        this.setModeClasses(event.matches ? 'dark' : 'light');
      });
  }
}

function preferredScheme(): Mode {
  return window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches
    ? 'dark'
    : 'light';
}
