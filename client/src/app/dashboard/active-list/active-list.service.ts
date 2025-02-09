import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ActiveList, Task } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class ActiveListService {
  private readonly url = environment.apiUrl;

  constructor(private readonly httpClient: HttpClient) {}

  fetchActiveList(): Observable<ActiveList | null> {
    return this.httpClient
      .get<ActiveList>(`${this.url}/active-list`)
      .pipe(catchError(() => of(null)));
  }

  saveActiveList(tasks: Task[]): void {
    this.httpClient
      .put(`${this.url}/active-list`, { tasks }, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error(`Failed to update an active list:`, error);
          return of(null);
        }),
      )
      .subscribe();
  }
}
