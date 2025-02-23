import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ClickOutsideDirective } from './click-outside.directive';
import { PresetsStore } from 'src/app/store/presets.store';

@Component({
  selector: 'app-modal',
  imports: [NgOptimizedImage, ClickOutsideDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private readonly store = inject(PresetsStore);

  readonly presetId = input.required<string>();
  readonly dialog = viewChild<ElementRef>('dialog');

  closeModal(): void {
    this.dialog()?.nativeElement.close();
  }

  deletePreset(): void {
    this.store.deletePreset(this.presetId());
  }

  openModal(): void {
    this.dialog()?.nativeElement.showModal();
  }
}
