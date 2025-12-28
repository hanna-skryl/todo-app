import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { type CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { TodoStore } from '../../store/todo.store';
import { type FilterOption, FILTERS, type Task } from '../../models';
import { NewTaskComponent } from '../../shared/new-task/new-task.component';

export type TasksFormGroup = FormGroup<{
  [K in keyof Task]: FormControl<NonNullable<Task[K]>>;
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
  readonly selectedFilter = computed(() => this.store.selectedFilter());
  readonly tasksLeft = computed(() => this.store.tasksLeft().length);

  readonly filters = FILTERS;

  readonly filterControl = new FormControl<FilterOption>(
    this.selectedFilter(),
    { nonNullable: true },
  );

  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly tasksForm = new FormArray<TasksFormGroup>([]);

  constructor() {
    effect(() => {
      this.selectedFilter();

      if (!this.loading()) {
        const tasks = untracked(() => this.store.filteredTasks());
        this.initForm(tasks);
      }
    });
  }

  addTask(description: string): void {
    this.tasksForm.push(
      this.createTasksFormGroup({ description, done: false }),
    );
    this.store.addTask(description);
  }

  deleteTask(task: Task, index: number): void {
    if (!task._id) {
      return;
    }
    this.tasksForm.removeAt(index);
    this.store.removeTask(task._id);
  }

  toggleTask(task: Task): void {
    if (!task._id) {
      return;
    }
    this.store.toggleTask(task._id);
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    const { previousIndex, currentIndex } = event;
    const control = this.tasksForm.at(previousIndex);
    this.tasksForm.removeAt(previousIndex);
    this.tasksForm.insert(currentIndex, control);
    this.store.reorderTasks(this.tasksForm.getRawValue());
  }

  clearCompleted(): void {
    this.store.clearCompleted();
  }

  filterTasks(filter: FilterOption): void {
    this.store.filterTasks(filter);
  }

  private initForm(tasks: Task[]): void {
    this.tasksForm.clear();

    tasks.forEach(task => {
      this.tasksForm.push(this.createTasksFormGroup(task));
    });
  }

  private createTasksFormGroup(task: Task): TasksFormGroup {
    const { _id: id, description, done } = task;

    return new FormGroup({
      ...(id && { _id: new FormControl(id, { nonNullable: true }) }),
      description: new FormControl(description, { nonNullable: true }),
      done: new FormControl(done, { nonNullable: true }),
    });
  }
}
