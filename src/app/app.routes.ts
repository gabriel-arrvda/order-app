import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'cart',
    loadComponent: () => import('./tab1/cart/cart.page').then( m => m.CartPage)
  },
];
