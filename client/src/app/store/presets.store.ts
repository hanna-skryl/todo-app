import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { Preset } from '../models';
import { PresetService } from '../dashboard/presets/preset.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../shared/toast/toast.service';

export type PresetsState = {
  presets: Preset[];
  activePreset: Preset | null;
  loading: boolean;
};

const initialState: PresetsState = {
  presets: [],
  activePreset: null,
  loading: false,
};

export const PresetsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      presetsService = inject(PresetService),
      toastService = inject(ToastService),
    ) => ({
      fetchPresets: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            presetsService.fetchPresets$().pipe(
              tapResponse({
                next: presets => patchState(store, { presets }),
                error: error => {
                  toastService.showError('Failed to fetch presets');
                  console.error(error);
                },
                finalize: () => patchState(store, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      fetchPreset: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(id =>
            presetsService.fetchPreset$(id).pipe(
              tapResponse({
                next: preset => patchState(store, { activePreset: preset }),
                error: error => {
                  toastService.showError('Failed to fetch preset');
                  console.error(error);
                },
                finalize: () => patchState(store, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      createPreset: rxMethod<Pick<Preset, 'tasks' | 'title'>>(
        switchMap(preset =>
          presetsService.createPreset$(preset).pipe(
            tapResponse({
              next: newPreset =>
                patchState(store, { presets: [...store.presets(), newPreset] }),
              error: error => {
                toastService.showError('Failed to create preset');
                console.error(error);
              },
            }),
          ),
        ),
      ),
      deletePreset: rxMethod<string>(
        switchMap(id =>
          presetsService.deletePreset$(id).pipe(
            tapResponse({
              next: () =>
                patchState(store, {
                  presets: store.presets().filter(item => item._id !== id),
                  activePreset:
                    store.activePreset()?._id === id
                      ? null
                      : store.activePreset(),
                }),
              error: error => {
                toastService.showError('Failed to delete preset');
                console.error(error);
              },
            }),
          ),
        ),
      ),
      updatePreset: rxMethod<Pick<Preset, 'title' | 'tasks'>>(
        switchMap(preset =>
          presetsService
            .updatePreset$({ _id: store.activePreset()?._id, ...preset })
            .pipe(
              tapResponse({
                next: updatedPreset =>
                  patchState(store, {
                    activePreset: updatedPreset,
                    presets: store
                      .presets()
                      .map(p =>
                        p._id === updatedPreset._id ? updatedPreset : p,
                      ),
                  }),
                error: error => {
                  toastService.showError('Failed to update preset');
                  console.error(error);
                },
              }),
            ),
        ),
      ),
      resetActivePreset(): void {
        patchState(store, { activePreset: null });
      },
    }),
  ),
);
