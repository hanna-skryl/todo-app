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
import { TodoItemComponent } from 'src/app/todo-item/todo-item.component';
import { TodoStore } from 'src/app/store/todo.store';
import { FilterOption, FILTERS, Item } from 'src/app/models';

@Component({
  selector: 'app-todo-list',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    CdkDropList,
    TodoItemComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  readonly store = inject(TodoStore);
  readonly title = 'TODO';
  readonly filters = FILTERS;

  readonly formGroup = new FormGroup({
    selectControl: new FormArray([
      new FormControl(true),
      new FormControl(false),
    ]),
    filterControl: new FormControl<FilterOption>(this.store.selectedFilter(), {
      nonNullable: true,
    }),
  });

  drop(event: CdkDragDrop<Item[]>): void {
    moveItemInArray(
      this.store.filteredItems(),
      event.previousIndex,
      event.currentIndex,
    );
  }
}
