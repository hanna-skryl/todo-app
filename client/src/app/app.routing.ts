import { Routes } from '@angular/router';
import { authGuard } from './landing/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./landing/landing.component').then(c => c.LandingComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.routing'),
  },
  { path: '**', redirectTo: '/dashboard' },
];
