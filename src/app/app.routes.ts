import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./books/books.routes').then((m) => m.BOOKS_ROUTES),
      title: 'Books',
      data: { preload: true },
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
      title: 'Auth',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
