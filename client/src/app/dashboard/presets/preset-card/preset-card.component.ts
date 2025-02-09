import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import type { Preset } from 'src/app/models';
import { ModalComponent } from '../modal/modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-preset-card',
  imports: [NgOptimizedImage, RouterLink, ModalComponent],
  templateUrl: './preset-card.component.html',
  styleUrl: './preset-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetCardComponent {
  readonly preset = input.required<Preset>();

  readonly tasks = computed(() => {
    const number = this.preset().tasks.length;
    return number > 0
      ? number === 1
        ? '1 task'
        : `${number} tasks`
      : 'No tasks';
  });
}
