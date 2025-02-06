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
  readonly activePreset = signal<Preset | null>(null);

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
          console.error('Failed to fetch a preset:', error);
          return of(null);
        }),
      )
      .subscribe(preset => {
        if (preset) {
          this.activePreset.set(preset);
        }
        return this.activePreset();
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
      .put(`${this.url}/presets/${id}`, preset, {
        responseType: 'text',
      })
      .pipe(
        catchError(error => {
          console.error(`Failed to update a preset with ID ${id}:`, error);
          return of(null);
        }),
      )
      .subscribe(isUpdated => {
        if (preset && isUpdated) {
          this.activePreset.set(preset);
          this.presets.update(items =>
            items.map(item =>
              item._id === id ? { ...item, ...preset } : item,
            ),
          );
        }
      });
  }

  deletePreset(id: string): void {
    this.httpClient
      .delete(`${this.url}/presets/${id}`, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error(`Failed to delete a preset with ID ${id}:`, error);
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
