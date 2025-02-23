import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { Preset } from '../models';
import { PresetService } from '../dashboard/presets/preset.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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
  withMethods((store, presetsService = inject(PresetService)) => ({
    fetchPresets: rxMethod<void>(
      switchMap(() =>
        presetsService.fetchPresets().pipe(
          tapResponse({
            next: presets => patchState(store, { presets, loading: false }),
            error: error => {
              patchState(store, { presets: [], loading: false });
              console.error('Failed to fetch presets', error);
            },
          }),
        ),
      ),
    ),
    loadPreset: rxMethod(
      switchMap((id: string) =>
        presetsService.fetchPreset(id).pipe(
          tapResponse({
            next: preset =>
              patchState(store, { activePreset: preset, loading: false }),
            error: error => {
              patchState(store, { activePreset: null, loading: false });
              console.error('Failed to fetch a preset:', error);
            },
          }),
        ),
      ),
    ),
    createPreset: rxMethod(
      switchMap((preset: Pick<Preset, 'tasks' | 'title'>) =>
        presetsService.createPreset(preset).pipe(
          tapResponse({
            next: res => {
              if (res) {
                const newPreset: Preset = { ...preset, _id: res.insertedId };
                patchState(store, {
                  presets: [...store.presets(), newPreset],
                });
              }
            },
            error: error => console.error('Failed to create a preset', error),
          }),
        ),
      ),
    ),
    deletePreset: rxMethod(
      switchMap((id: string) =>
        presetsService.deletePreset(id).pipe(
          tapResponse({
            next: () =>
              patchState(store, {
                presets: store.presets().filter(item => item._id !== id),
                activePreset:
                  store.activePreset()?._id === id
                    ? null
                    : store.activePreset(),
              }),
            error: error =>
              console.error(`Failed to delete a preset with ID ${id}:`, error),
          }),
        ),
      ),
    ),
    updatePreset: rxMethod(
      switchMap((preset: Pick<Preset, 'title' | 'tasks'>) =>
        presetsService
          .updatePreset({ _id: store.activePreset()?._id, ...preset })
          .pipe(
            tapResponse({
              next: updatedPreset =>
                patchState(store, { activePreset: updatedPreset }),
              error: error => {
                patchState(store, { activePreset: store.activePreset() });
                console.error(
                  `Failed to update a preset with ID ${store.activePreset()?._id}:`,
                  error,
                );
              },
            }),
          ),
      ),
    ),
    resetActivePreset(): void {
      patchState(store, { activePreset: null });
    },
    setLoading(isLoading: boolean): void {
      patchState(store, { loading: isLoading });
    },
  })),
);
