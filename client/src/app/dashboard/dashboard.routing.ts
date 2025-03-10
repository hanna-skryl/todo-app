import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'active-list',
        pathMatch: 'full',
      },
      {
        path: 'active-list',
        loadComponent: () =>
          import('./active-list/active-list.component').then(
            c => c.ActiveListComponent,
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
