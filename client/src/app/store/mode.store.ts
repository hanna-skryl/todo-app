import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Mode } from '../models';
import { MODE_PREFERENCE_STORAGE_KEY } from '../constants';

export type ModeState = {
  mode: Mode;
};

const initialState: ModeState = {
  mode: 'dark',
};

export const ModeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    toggleMode(): void {
      patchState(store, ({ mode }) => ({
        mode: mode === 'light' ? 'dark' : ('light' as Mode),
      }));
    },
    updateMode(mode: Mode): void {
      patchState(store, () => ({ mode }));
    },
    // User agents can block localStorage.
    // Then it is treated as if no preference has previously been stored.
    getModePreference(): Mode | null {
      try {
        return localStorage.getItem(MODE_PREFERENCE_STORAGE_KEY) as Mode | null;
      } catch {
        return null;
      }
    },
    // User agents can block localStorage. Then nothing is persisted.
    updateModePreference(): void {
      try {
        localStorage.setItem(MODE_PREFERENCE_STORAGE_KEY, String(store.mode()));
      } catch {
        /* empty */
      }
    },
  })),
);
