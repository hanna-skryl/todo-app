import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { TodoStore } from '../store/todo.store';
import { Item } from '../models';
import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

export type TodoItemEvent = {
  item: Item;
  event: 'delete' | 'update';
};

@Component({
  selector: 'app-todo-item',
  imports: [CdkDrag, NgOptimizedImage, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TodoItemComponent),
      multi: true,
    },
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements ControlValueAccessor {
  readonly store = inject(TodoStore);

  readonly todoUpdate = output<TodoItemEvent>();

  readonly item = input.required<Item>();
  readonly id = input.required<string>();

  readonly todoControl = new FormControl<boolean>(false, { nonNullable: true });

  private onChange: ((value: boolean) => void) | undefined;
  private onTouched: (() => void) | undefined;

  get isInteractive(): boolean {
    return this.onChange !== undefined;
  }

  writeValue(value: boolean | null): void {
    if (value !== null) {
      this.todoControl.setValue(value, { emitEvent: false });
    }
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  deleteTodo(): void {
    this.todoUpdate.emit({
      item: { ...this.item(), done: this.todoControl.value },
      event: 'delete',
    });
  }

  toggleDone(): void {
    this.todoUpdate.emit({
      item: { ...this.item(), done: this.todoControl.value },
      event: 'update',
    });
  }
}
