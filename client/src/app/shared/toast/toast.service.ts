import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageSubject$ = new Subject<string>();
  readonly message$ = this.messageSubject$.asObservable();

  private readonly errorSubject$ = new Subject<string>();
  readonly error$ = this.errorSubject$.asObservable();

  showMessage(message: string): void {
    this.messageSubject$.next(message);
  }

  showError(message: string): void {
    this.errorSubject$.next(message);
  }
}
