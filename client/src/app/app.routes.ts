import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./todo-list/todo-list.component').then(c => c.TodoListComponent),
  },
  {
    path: 'presets',
    loadComponent: () =>
      import('./presets/presets.component').then(c => c.PresetsComponent),
  },
  {
    path: 'presets/:id',
    loadComponent: () =>
      import('./preset/preset.component').then(c => c.PresetComponent),
  },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];
