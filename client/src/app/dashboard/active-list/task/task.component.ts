import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { Task } from '../../../models';
import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  readonly task = input.required<Task>();
  readonly taskDeleted = output<Task>();
  readonly taskToggled = output<Task>();

  readonly taskControl = new FormControl<boolean>(false, { nonNullable: true });

  private onChange: ((value: boolean) => void) | undefined;
  private onTouched: (() => void) | undefined;

  constructor() {
    this.taskControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.onChange?.(value);
        this.onTouched?.();
      });
  }

  writeValue(value: boolean | null): void {
    if (value == null) {
      return;
    }
    this.taskControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  deleteTask(): void {
    this.taskDeleted.emit({ ...this.task(), done: this.taskControl.value });
  }

  toggleTask(): void {
    this.taskToggled.emit({ ...this.task(), done: this.taskControl.value });
  }
}
