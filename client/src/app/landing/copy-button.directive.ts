import { Directive, effect, ElementRef, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { exhaustMap, fromEvent, map, startWith, timer } from 'rxjs';

@Directive({
  selector: '[appCopyButton]',
})
export class CopyButtonDirective {
  readonly copied = output<boolean>();

  constructor() {
    effect(() => this.copied.emit(this.copiedState()));
  }

  private readonly copiedState = toSignal(
    fromEvent(inject(ElementRef).nativeElement, 'click').pipe(
      exhaustMap(() =>
        timer(2000).pipe(
          map(() => false),
          startWith(true),
        ),
      ),
    ),
    { initialValue: false },
  );
}
