import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TodoStore } from '../store/todo.store';

@Component({
  selector: 'app-new-task',
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewTaskComponent),
      multi: true,
    },
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskComponent implements ControlValueAccessor {
  readonly store = inject(TodoStore);

  readonly hasCheckbox = input.required<boolean>();
  readonly newTask = output<string>();

  readonly newTaskControl = new FormControl<string>('', {
    nonNullable: true,
  });

  private onChange: ((value: string) => void) | undefined;
  private onTouched: (() => void) | undefined;

  writeValue(value: string): void {
    this.newTaskControl.setValue(value, { emitEvent: false });
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  emitNewTask(): void {
    const task = this.newTaskControl.value.trim();
    if (task) {
      this.onChange?.(task);
      this.onTouched?.();
      this.newTask.emit(task);
      this.newTaskControl.reset();
    }
  }
}
