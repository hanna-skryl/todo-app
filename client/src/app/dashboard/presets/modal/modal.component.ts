import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { PresetService } from '../preset.service';
import { NgOptimizedImage } from '@angular/common';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  selector: 'app-modal',
  imports: [NgOptimizedImage, ClickOutsideDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private readonly presetsService = inject(PresetService);

  readonly itemId = input.required<string>();
  readonly dialog = viewChild<ElementRef>('dialog');

  closeModal(): void {
    this.dialog()?.nativeElement.close();
  }

  deletePreset(): void {
    this.presetsService.deletePreset(this.itemId());
  }

  openModal(): void {
    this.dialog()?.nativeElement.showModal();
  }
}
