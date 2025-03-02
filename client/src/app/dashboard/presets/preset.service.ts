import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preset } from '../../models';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private readonly url = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  fetchPresets(): Observable<Preset[]> {
    return this.httpClient.get<Preset[]>(`${this.url}/presets`);
  }

  fetchPreset(id: string): Observable<Preset | null> {
    return this.httpClient.get<Preset>(`${this.url}/presets/${id}`);
  }

  createPreset(preset: Pick<Preset, 'tasks' | 'title'>): Observable<Preset> {
    return this.httpClient.post<Preset>(`${this.url}/presets`, preset);
  }

  updatePreset(preset: Preset): Observable<Preset> {
    return this.httpClient.put<Preset>(
      `${this.url}/presets/${preset._id}`,
      preset,
    );
  }

  deletePreset(id: string): Observable<boolean> {
    return this.httpClient
      .delete(`${this.url}/presets/${id}`, { responseType: 'text' })
      .pipe(
        catchError(() => of(false)),
        map(() => true),
      );
  }
}
