import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  readonly clickOutside = output();

  private elementRef = inject<ElementRef<HTMLDialogElement>>(ElementRef);

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.handleClickOutside(event);
  }

  @HostListener('document:touchstart', ['$event'])
  public onTouchStart(event: TouchEvent): void {
    this.handleClickOutside(event);
  }

  private handleClickOutside(event: MouseEvent | TouchEvent): void {
    if (!this.isInDialog(event)) {
      this.clickOutside.emit();
    }
  }

  private isTouch(event: MouseEvent | TouchEvent): event is TouchEvent {
    return 'touches' in event;
  }

  private isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
    return 'clientX' in event;
  }

  private isInDialog(event: MouseEvent | TouchEvent): boolean {
    const { top, left, height, width } =
      this.elementRef.nativeElement.getBoundingClientRect();
    return this.isMouseEvent(event)
      ? top <= event.clientY &&
          event.clientY <= top + height &&
          left <= event.clientX &&
          event.clientX <= left + width
      : this.isTouch(event)
        ? top <= event.touches[0].clientY &&
          event.touches[0].clientY <= top + height &&
          left <= event.touches[0].clientX &&
          event.touches[0].clientX <= left + width
        : false;
  }
}
