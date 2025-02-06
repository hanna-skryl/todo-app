import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import {
  TodoItemComponent,
  TodoItemEvent,
} from 'src/app/todo-item/todo-item.component';
import { TodoStore } from 'src/app/store/todo.store';
import { FilterOption, FILTERS, Item } from 'src/app/models';
import { NewTodoComponent } from '../../new-todo/new-todo.component';

@Component({
  selector: 'app-todo-list',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    CdkDropList,
    TodoItemComponent,
    NewTodoComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  readonly store = inject(TodoStore);
  readonly title = 'TODO';
  readonly filters = FILTERS;

  readonly newTodoControl = new FormControl<string>('', { nonNullable: true });
  readonly todoStatusMap = new Map<string, FormControl<boolean>>();
  readonly filterControl = new FormControl<FilterOption>(
    this.store.selectedFilter(),
    {
      nonNullable: true,
    },
  );

  constructor() {
    this.initializeTodoStatusMap();
  }

  private initializeTodoStatusMap(): void {
    this.todoStatusMap.clear();
    this.store.todoItems().forEach(({ description, done }) => {
      this.todoStatusMap.set(
        description,
        new FormControl(done, { nonNullable: true }),
      );
    });
  }

  addNewTodo(task: string): void {
    this.store.addItem(task);
    this.todoStatusMap.set(task, new FormControl(false, { nonNullable: true }));
  }

  handleTodoUpdate({ item, event }: TodoItemEvent): void {
    switch (event) {
      case 'delete':
        this.todoStatusMap.delete(item.description);
        this.store.removeItem(item.description);
        break;

      case 'update':
        const control = this.todoStatusMap.get(item.description);
        if (control) {
          control.setValue(item.done, { emitEvent: false });
        }
        this.store.toggleItem(item.description);
        break;
    }
  }

  reorderTodos(event: CdkDragDrop<Item[]>): void {
    const items = [...this.store.todoItems()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.store.reorderItems(items);
    this.initializeTodoStatusMap();
  }
}
