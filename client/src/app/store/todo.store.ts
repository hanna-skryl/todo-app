import { computed, inject } from '@angular/core';
import { FilterOption, Task, Mode } from '../models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { MODE_PREFERENCE_STORAGE_KEY } from '../constants';
import { switchMap } from 'rxjs';
import { ActiveListService } from '../dashboard/active-list/active-list.service';

export type TodoState = {
  tasks: Task[];
  selectedFilter: FilterOption;
  mode: Mode;
};

export const initialState: TodoState = {
  tasks: [],
  selectedFilter: 'All',
  mode: 'dark',
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
  withMethods((store, activeListService = inject(ActiveListService)) => ({
    loadData: rxMethod<void>(
      switchMap(() => {
        return activeListService.fetchActiveList().pipe(
          tapResponse({
            next: list => patchState(store, { tasks: list.tasks }),
            error: console.error,
          }),
        );
      }),
    ),
    addTask: rxMethod(
      switchMap((description: string) =>
        activeListService.addTask(description).pipe(
          tapResponse({
            next: list => patchState(store, { tasks: list.tasks }),
            error: console.error,
          }),
        ),
      ),
    ),
    removeTask: rxMethod(
      switchMap((id: string) =>
        activeListService.removeTask(id).pipe(
          tapResponse({
            next: list => patchState(store, { tasks: list.tasks }),
            error: console.error,
          }),
        ),
      ),
    ),
    toggleTask: rxMethod(
      switchMap((id: string) =>
        activeListService
          .updateActiveList(
            store
              .tasks()
              .map(task =>
                task._id === id ? { ...task, done: !task.done } : task,
              ),
          )
          .pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: console.error,
            }),
          ),
      ),
    ),
    reorderTasks: rxMethod(
      switchMap((updatedTasks: Task[]) =>
        activeListService.updateActiveList(updatedTasks).pipe(
          tapResponse({
            next: list => patchState(store, { tasks: list.tasks }),
            error: console.error,
          }),
        ),
      ),
    ),
    activatePreset: rxMethod(
      switchMap((tasks: string[]) =>
        activeListService
          .updateActiveList(
            tasks.map(description => ({ _id: '', description, done: false })),
          )
          .pipe(
            tapResponse({
              next: list => patchState(store, { tasks: list.tasks }),
              error: console.error,
            }),
          ),
      ),
    ),
    clearCompleted: rxMethod<void>(
      switchMap(() =>
        activeListService.updateActiveList(store.tasksLeft()).pipe(
          tapResponse({
            next: list => patchState(store, { tasks: list.tasks }),
            error: console.error,
          }),
        ),
      ),
    ),
    filterTasks(option: FilterOption): void {
      patchState(store, { selectedFilter: option });
    },
    toggleMode(): void {
      patchState(store, ({ mode }) => ({
        mode: mode === 'light' ? 'dark' : ('light' as Mode),
      }));
    },
    updateMode(mode: Mode): void {
      patchState(store, () => ({ mode }));
    },
    // User agents can block localStorage.
    // Then it is treated as if no preference has previously been stored.
    getModePreference(): Mode | null {
      try {
        return localStorage.getItem(MODE_PREFERENCE_STORAGE_KEY) as Mode | null;
      } catch {
        return null;
      }
    },
    // User agents can block localStorage. Then nothing is persisted.
    updateModePreference(): void {
      try {
        localStorage.setItem(MODE_PREFERENCE_STORAGE_KEY, String(store.mode()));
      } catch {
        /* empty */
      }
    },
  })),
);
