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
  selector: 'app-new-todo',
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewTodoComponent),
      multi: true,
    },
  ],
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTodoComponent implements ControlValueAccessor {
  readonly store = inject(TodoStore);

  readonly hasCheckbox = input.required<boolean>();
  readonly newTodo = output<string>();

  readonly newTodoControl = new FormControl<string>('', {
    nonNullable: true,
  });

  private onChange: ((value: string) => void) | undefined;
  private onTouched: (() => void) | undefined;

  writeValue(value: string): void {
    this.newTodoControl.setValue(value, { emitEvent: false });
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  emitNewTodo(): void {
    const todo = this.newTodoControl.value.trim();
    if (todo) {
      this.onChange?.(todo);
      this.onTouched?.();
      this.newTodo.emit(todo);
      this.newTodoControl.reset();
    }
  }
}
