import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preset } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private readonly url = 'http://localhost:5200';
  readonly presets = signal<Preset[]>([]);
  readonly preset = signal<Preset>({ title: '', items: [] });

  constructor(private readonly httpClient: HttpClient) {}

  private refreshPresets(): void {
    this.httpClient.get<Preset[]>(`${this.url}/presets`).subscribe(presets => {
      this.presets.set(presets);
    });
  }

  getPresets(): Preset[] {
    this.refreshPresets();
    return this.presets();
  }

  getPreset(id: string): void {
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
