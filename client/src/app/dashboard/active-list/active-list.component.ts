import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { TaskEvent, TaskComponent } from 'src/app/task/task.component';
import { TodoStore } from 'src/app/store/todo.store';
import { FilterOption, FILTERS, Task } from 'src/app/models';
import { NewTaskComponent } from '../../new-task/new-task.component';

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
  readonly store = inject(TodoStore);
  readonly title = 'TODO';
  readonly filters = FILTERS;

  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly taskStatusMap = new Map<string, FormControl<boolean>>();
  readonly filterControl = new FormControl<FilterOption>(
    this.store.selectedFilter(),
    {
      nonNullable: true,
    },
  );

  constructor() {
    this.initializeTaskStatusMap();
  }

  private initializeTaskStatusMap(): void {
    this.taskStatusMap.clear();
    this.store.tasks().forEach(({ description, done }) => {
      this.taskStatusMap.set(
        description,
        new FormControl(done, { nonNullable: true }),
      );
    });
  }

  addNewTask(task: string): void {
    this.store.addTask(task);
    this.taskStatusMap.set(task, new FormControl(false, { nonNullable: true }));
  }

  handleTaskUpdate({ task, event }: TaskEvent): void {
    switch (event) {
      case 'delete':
        this.taskStatusMap.delete(task.description);
        this.store.removeTask(task.description);
        break;

      case 'update':
        const control = this.taskStatusMap.get(task.description);
        if (control) {
          control.setValue(task.done, { emitEvent: false });
        }
        this.store.toggleTask(task.description);
        break;
    }
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    const tasks = [...this.store.tasks()];
    moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    this.store.reorderTasks(tasks);
    this.initializeTaskStatusMap();
  }
}
