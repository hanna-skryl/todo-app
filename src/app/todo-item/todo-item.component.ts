import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TodoStore } from '../store/todo.store';
import { Item } from '../models';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-item',
  imports: [CdkDrag],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  readonly store = inject(TodoStore);

  item = input.required<Item>();
  id = input.required<string>();
}
