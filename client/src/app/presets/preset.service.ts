import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preset } from '../models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private readonly url = 'https://todo-app-1-wdod.onrender.com';
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
      .subscribe(preset => {
        this.preset.set(preset);
        return this.preset();
      });
  }

  createPreset(preset: Preset): Observable<string> {
    return this.httpClient.post(`${this.url}/presets`, preset, {
      responseType: 'text',
    });
  }

  updatePreset(id: string, preset: Preset): Observable<string> {
    return this.httpClient.put(`${this.url}/presets/${id}`, preset, {
      responseType: 'text',
    });
  }

  deletePreset(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/presets/${id}`, {
      responseType: 'text',
    });
  }
}
