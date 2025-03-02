import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-preset-task',
  imports: [CdkDrag, NgOptimizedImage],
  templateUrl: './preset-task.component.html',
  styleUrl: './preset-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetTaskComponent {
  readonly task = input.required<string>();
  readonly taskDelete = output<string>();

  deleteTask(): void {
    this.taskDelete.emit(this.task());
  }
}
