import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { type TaskEvent, TaskComponent } from './task/task.component';
import { TodoStore } from '../../store/todo.store';
import { type FilterOption, FILTERS, type Task } from '../../models';
import { NewTaskComponent } from '../../shared/new-task/new-task.component';

type TaskFormGroup = FormGroup<{
  _id: FormControl<string | undefined>;
  description: FormControl<string>;
  done: FormControl<boolean>;
}>;

@Component({
  selector: 'app-active-list',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    CdkDropList,
    TaskComponent,
    NewTaskComponent,
  ],
  templateUrl: './active-list.component.html',
  styleUrl: './active-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveListComponent {
  private readonly store = inject(TodoStore);

  readonly loading = computed(() => this.store.loading());
  readonly tasksLeft = computed(() => this.store.tasksLeft().length);
  readonly selectedFilter = computed(() => this.store.selectedFilter());

  readonly title = 'TODO';
  readonly filters = FILTERS;

  readonly tasksForm = new FormArray<TaskFormGroup>([]);
  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly filterControl = new FormControl<FilterOption>(
    this.store.selectedFilter(),
    { nonNullable: true },
  );

  constructor() {
    effect(() => this.syncFormWithStore());
  }

  private syncFormWithStore(): void {
    const filteredTasks = this.store.filteredTasks();
    const newControls = filteredTasks.map(task =>
      this.createTaskFormGroup(task),
    );
    this.tasksForm.clear();
    newControls.forEach(control => this.tasksForm.push(control));
  }

  private createTaskFormGroup(task: Task): TaskFormGroup {
    return new FormGroup({
      _id: new FormControl(task._id, { nonNullable: true }),
      description: new FormControl(task.description, { nonNullable: true }),
      done: new FormControl(task.done, { nonNullable: true }),
    });
  }

  addTask(description: string): void {
    if (!description.trim()) {
      return;
    }
    this.tasksForm.push(this.createTaskFormGroup({ description, done: false }));
    this.store.addTask(description);
  }

  handleTaskUpdate({ task, event }: TaskEvent, index: number): void {
    if (task._id) {
      switch (event) {
        case 'delete':
          this.tasksForm.removeAt(index);
          this.store.removeTask(task._id);
          break;

        case 'update':
          this.store.toggleTask(task._id);
          break;
      }
    }
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    moveItemInArray(
      this.tasksForm.controls,
      event.previousIndex,
      event.currentIndex,
    );
    const updatedTasks = this.tasksForm.controls.map(control =>
      control.getRawValue(),
    );
    this.store.reorderTasks(updatedTasks);
  }

  clearCompleted(): void {
    this.store.clearCompleted();
  }

  filterTasks(filter: FilterOption): void {
    this.store.filterTasks(filter);
  }
}
