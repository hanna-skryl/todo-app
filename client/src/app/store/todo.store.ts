import { computed, inject } from '@angular/core';
import type { FilterOption, Task } from '../models';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ActiveListService } from '../dashboard/active-list/active-list.service';
import { ToastService } from '../shared/toast/toast.service';

export type TodoState = {
  tasks: Task[];
  selectedFilter: FilterOption;
  loading: boolean;
};

const initialState: TodoState = {
  tasks: [],
  selectedFilter: 'All',
  loading: false,
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tasks, selectedFilter }) => ({
    tasksLeft: computed(() => tasks().filter(task => !task.done)),
    filteredTasks: computed(() =>
      tasks().filter(task =>
        selectedFilter() === 'Active'
          ? !task.done
          : selectedFilter() === 'Completed'
            ? task.done
            : task,
      ),
    ),
  })),
  withMethods(
    (
      store,
      activeListService = inject(ActiveListService),
      toastService = inject(ToastService),
    ) => ({
      loadData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            activeListService.fetchActiveList$().pipe(
              tapResponse({
                next: list => patchState(store, { tasks: list.tasks }),
                error: error =>
                  console.error('Failed to fetch active list', error),
                finalize: () => patchState(store, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      addTask: rxMethod<string>(
        switchMap(description =>
          activeListService.addTask$(description).pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: error => console.error('Failed to add task', error),
            }),
          ),
        ),
      ),
      removeTask: rxMethod<string>(
        switchMap(id =>
          activeListService.removeTask$(id).pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: error => console.error('Failed to remove task', error),
            }),
          ),
        ),
      ),
      toggleTask: rxMethod<string>(
        switchMap(id =>
          activeListService
            .updateActiveList$(
              store
                .tasks()
                .map(task =>
                  task._id === id ? { ...task, done: !task.done } : task,
                ),
            )
            .pipe(
              tapResponse({
                next: list => patchState(store, { tasks: list.tasks }),
                error: error => console.error('Failed to toggle task', error),
              }),
            ),
        ),
      ),
      reorderTasks: rxMethod<Task[]>(
        switchMap(updatedTasks =>
          activeListService.updateActiveList$(updatedTasks).pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: error => console.error('Failed to reorder tasks', error),
            }),
          ),
        ),
      ),
      activatePreset: rxMethod<string[]>(
        switchMap(tasks =>
          activeListService
            .updateActiveList$(
              tasks.map(description => ({ description, done: false })),
            )
            .pipe(
              tapResponse({
                next: list => {
                  patchState(store, { tasks: list.tasks });
                  toastService.showMessage('Preset activated successfully!');
                },
                error: error =>
                  console.error('Failed to activate preset', error),
              }),
            ),
        ),
      ),
      clearCompleted: rxMethod<void>(
        switchMap(() =>
          activeListService.updateActiveList$(store.tasksLeft()).pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: error => console.error('Failed to clear completed', error),
            }),
          ),
        ),
      ),
      filterTasks(option: FilterOption): void {
        patchState(store, { selectedFilter: option });
      },
    }),
  ),
  withHooks({
    onInit: store => store.loadData(),
  }),
);
