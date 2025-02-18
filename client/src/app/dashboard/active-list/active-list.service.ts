import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import type { Task } from 'src/app/models';
import type { TodoState } from 'src/app/store/todo.store';

@Injectable({
  providedIn: 'root',
})
export class ActiveListService {
  private readonly url = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  fetchActiveList(): Observable<TodoState> {
    return this.httpClient.get<TodoState>(`${this.url}/active-list`);
  }

  addTask(description: string): Observable<TodoState> {
    return this.httpClient.post<TodoState>(`${this.url}/active-list`, {
      description,
    });
  }

  removeTask(id: string): Observable<TodoState> {
    return this.httpClient.delete<TodoState>(`${this.url}/active-list/${id}`);
  }

  updateActiveList(tasks: Task[]): Observable<TodoState> {
    return this.httpClient.put<TodoState>(`${this.url}/active-list`, { tasks });
  }
}
