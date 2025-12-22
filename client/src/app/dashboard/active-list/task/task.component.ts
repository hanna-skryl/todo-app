import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { TodoStore } from '../../../store/todo.store';
import { Task } from '../../../models';
import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

export type TaskEvent = {
  task: Task;
  event: 'delete' | 'update';
};

@Component({
  selector: 'app-task',
  imports: [CdkDrag, NgOptimizedImage, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaskComponent),
      multi: true,
    },
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements ControlValueAccessor {
  readonly store = inject(TodoStore);

  readonly taskUpdate = output<TaskEvent>();

  readonly task = input.required<Task>();

  readonly taskControl = new FormControl<boolean>(false, { nonNullable: true });

  private onChange: ((value: boolean) => void) | undefined;
  private onTouched: (() => void) | undefined;

  writeValue(value: boolean | null): void {
    if (value != null) {
      this.taskControl.setValue(value, { emitEvent: false });
    }
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  deleteTask(): void {
    this.taskUpdate.emit({
      task: { ...this.task(), done: this.taskControl.value },
      event: 'delete',
    });
  }

  toggleTask(): void {
    this.taskUpdate.emit({
      task: { ...this.task(), done: this.taskControl.value },
      event: 'update',
    });
  }
}
