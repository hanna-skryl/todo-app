import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'active-list',
        loadComponent: () =>
          import('./todo-list/todo-list.component').then(
            c => c.TodoListComponent,
          ),
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
    ],
  },
];

export default DASHBOARD_ROUTES;
