import { computed } from '@angular/core';
import { FilterOption, Item, Mode } from '../models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MODE_PREFERENCE_STORAGE_KEY } from '../constants';

type TodoState = {
  todoItems: Item[];
  selectedFilter: FilterOption;
  mode: Mode;
};

export const initialState: TodoState = {
  todoItems: [
    { description: 'Complete online JavaScript course', done: true },
    { description: 'Jog around the park 3x', done: false },
    { description: '10 minutes meditation', done: false },
    { description: 'Read for 1 hour', done: false },
    { description: 'Pick up groceries', done: false },
    { description: 'Complete Todo App on Frontend Mentor', done: false },
  ],
  selectedFilter: 'All',
  mode: 'dark',
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todoItems, selectedFilter }) => ({
    undoneItems: computed(() => todoItems().filter(item => !item.done).length),
    filteredItems: computed(() =>
      todoItems().filter(item =>
        selectedFilter() === 'Active'
          ? !item.done
          : selectedFilter() === 'Completed'
            ? item.done
            : item,
      ),
    ),
  })),
  withMethods(state => ({
    addItem(description: string): void {
      patchState(state, ({ todoItems }) => ({
        todoItems: [...todoItems, { description, done: false }],
      }));
    },
    removeItem(description: string): void {
      patchState(state, ({ todoItems }) => ({
        todoItems: todoItems.filter(item => item.description !== description),
      }));
    },
    toggleItem(description: string): void {
      patchState(state, ({ todoItems }) => ({
        todoItems: todoItems.map(item =>
          description === item.description
            ? { description, done: !item.done }
            : item,
        ),
      }));
    },
    clearCompleted(): void {
      patchState(state, ({ todoItems }) => ({
        todoItems: todoItems.filter(item => !item.done),
      }));
    },
    filterItems(option: FilterOption): void {
      patchState(state, () => ({ selectedFilter: option }));
    },
    toggleMode(): void {
      patchState(state, ({ mode }) => ({
        mode: mode === 'light' ? 'dark' : ('light' as Mode),
      }));
    },
    updateMode(mode: Mode): void {
      patchState(state, () => ({ mode }));
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
        localStorage.setItem(MODE_PREFERENCE_STORAGE_KEY, String(state.mode()));
      } catch {
        /* empty */
      }
    },
  })),
);
