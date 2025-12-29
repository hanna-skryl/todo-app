import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All routes are client-only to avoid hydration mismatches (theme changes, platform checks)
  { path: '**', renderMode: RenderMode.Client },
];
