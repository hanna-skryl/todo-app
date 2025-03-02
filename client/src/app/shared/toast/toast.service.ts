import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);

  showMessage(message: string): void {
    this.message.set(message);
    setTimeout(() => this.clear(), 3000);
  }

  private clear(): void {
    this.message.set(null);
  }
}
