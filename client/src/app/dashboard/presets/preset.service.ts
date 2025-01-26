import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preset } from '../../models';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import type { CreatePresetResponse } from '../../../../src/app/models';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private readonly url = environment.apiUrl;
  readonly presets = signal<Preset[]>([]);
  readonly preset = signal<Preset>({ title: '', items: [] });

  constructor(private readonly httpClient: HttpClient) {}

  fetchPresets(): void {
    this.httpClient
      .get<Preset[]>(`${this.url}/presets`)
      .pipe(
        catchError(error => {
          console.error('Failed to fetch presets:', error);
          return of([]);
        }),
      )
      .subscribe(presets => this.presets.set(presets));
  }

  fetchPreset(id: string): void {
    this.httpClient
      .get<Preset>(`${this.url}/presets/${id}`)
      .pipe(
        catchError(error => {
          console.error('Failed to create todo:', error);
          return of(null);
        }),
      )
      .subscribe(preset => {
        if (preset) {
          this.preset.set(preset);
        }
        return this.preset();
      });
  }

  createPreset(preset: Omit<Preset, '_id'>): void {
    this.httpClient
      .post<CreatePresetResponse>(`${this.url}/presets`, preset)
      .pipe(
        catchError(error => {
          console.error('Failed to create a preset:', error);
          return of(null);
        }),
      )
      .subscribe(res => {
        if (res) {
          const newPreset: Preset = { ...preset, _id: res.insertedId };
          this.presets.update(items => [...items, newPreset]);
        }
      });
  }

  updatePreset(id: string, preset: Preset): void {
    this.httpClient
      .put<Preset>(`${this.url}/presets/${id}`, preset)
      .pipe(
        catchError(error => {
          console.error(`Failed to update preset with id ${id}:`, error);
          return of(null);
        }),
      )
      .subscribe(preset => {
        if (preset) {
          this.presets.update(items => ({ ...items, preset }));
        }
      });
  }

  deletePreset(id: string): void {
    this.httpClient
      .delete<void>(`${this.url}/presets/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to delete preset with id ${id}:`, error);
          return of(false);
        }),
        map(() => true),
      )
      .subscribe(isDeleted => {
        if (isDeleted) {
          this.presets.update(items => items.filter(item => item._id !== id));
        }
      });
  }
}
