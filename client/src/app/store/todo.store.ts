import { computed } from '@angular/core';
import { FilterOption, Task, Mode } from '../models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MODE_PREFERENCE_STORAGE_KEY } from '../constants';

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
    undoneTasks: computed(() => tasks().filter(task => !task.done).length),
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
  withMethods(store => ({
    addTask(description: string): void {
      patchState(store, ({ tasks }) => ({
        tasks: [...tasks, { description, done: false }],
      }));
    },
    removeTask(description: string): void {
      patchState(store, ({ tasks }) => ({
        tasks: tasks.filter(task => task.description !== description),
      }));
    },
    toggleTask(description: string): void {
      patchState(store, ({ tasks }) => ({
        tasks: tasks.map(task =>
          description === task.description
            ? { description, done: !task.done }
            : task,
        ),
      }));
    },
    reorderTasks(updatedTasks: Task[]): void {
      patchState(store, { tasks: updatedTasks });
    },
    clearCompleted(): void {
      patchState(store, ({ tasks }) => ({
        tasks: tasks.filter(task => !task.done),
      }));
    },
    filterTasks(option: FilterOption): void {
      patchState(store, () => ({ selectedFilter: option }));
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
