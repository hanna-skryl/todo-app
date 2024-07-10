import { computed } from '@angular/core';
import { FilterOption, Item } from '../models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type TodoState = {
  todoItems: Item[];
  selectedFilter: FilterOption;
  isDarkMode: boolean;
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
  isDarkMode: false,
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todoItems, selectedFilter }) => ({
    undoneItems: computed(() => todoItems().filter(item => !item.done).length),
    filteredItems: computed(() => {
      return todoItems().filter(item =>
        selectedFilter() === 'Active'
          ? !item.done
          : selectedFilter() === 'Completed'
            ? item.done
            : item,
      );
    }),
  })),
  withMethods(state => {
    return {
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
      toggleMode(): void {
        patchState(state, ({ isDarkMode }) => {
          return { isDarkMode: !isDarkMode };
        });
      },
      clearCompleted(): void {
        patchState(state, ({ todoItems }) => ({
          todoItems: todoItems.filter(item => !item.done),
        }));
      },
      filterItems(option: FilterOption): void {
        patchState(state, () => ({ selectedFilter: option }));
      },
    };
  }),
);
