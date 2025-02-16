import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import type { Preset } from 'src/app/models';
import { ModalComponent } from '../modal/modal.component';
import { RouterLink } from '@angular/router';
import { TodoStore } from 'src/app/store/todo.store';

@Component({
  selector: 'app-preset-card',
  imports: [NgOptimizedImage, RouterLink, ModalComponent],
  templateUrl: './preset-card.component.html',
  styleUrl: './preset-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetCardComponent {
  private readonly store = inject(TodoStore);

  readonly preset = input.required<Preset>();

  readonly tasks = computed(() => {
    const number = this.preset().tasks.length;
    return number > 0
      ? number === 1
        ? '1 task'
        : `${number} tasks`
      : 'No tasks';
  });

  activatePreset(): void {
    const tasks = this.preset().tasks;
    this.store.activatePreset(tasks);
  }
}
