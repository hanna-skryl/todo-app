import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterOption, FILTERS, Item } from '../models';
import { TodoStore } from '../store/todo.store';
import { RouterLink } from '@angular/router';
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
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    RouterLink,
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
    modeControl: new FormControl<boolean>(false, {
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
