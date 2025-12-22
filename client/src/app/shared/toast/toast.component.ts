import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap, timer } from 'rxjs';
import { ToastService } from './toast.service';

const TOAST_TIMEOUT = 3000;

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  readonly message = toSignal(
    this.toastService.message$.pipe(
      switchMap(message =>
        timer(TOAST_TIMEOUT).pipe(
          map(() => null),
          startWith(message),
        ),
      ),
    ),
  );
}
