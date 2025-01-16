import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout-page/layout-page.component').then(m => m.LayoutComponent),
    children: [
      { path: 'new-book', loadComponent: () => import('./pages/new-page/new-page.component').then(m => m.NewPageComponent) },
      { path: 'edit/:id', loadComponent: () => import('./pages/new-page/new-page.component').then(m => m.NewPageComponent) },
      { path: 'list', loadComponent: () => import('./pages/list-page/list-page.component').then(m => m.ListPageComponent) },
      { path: ':id', loadComponent: () => import('./pages/book-page/book-page.component').then(m => m.BookPageComponent) },
      { path: '**', redirectTo: 'list' }
    ]
  },

];
