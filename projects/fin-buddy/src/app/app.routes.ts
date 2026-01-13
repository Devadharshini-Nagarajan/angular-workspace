import { Routes } from '@angular/router';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { MainComponent } from './main/main.component';
import { authGuard } from '../../../shared/src/public-api';
import { BudgetComponent } from './budget/budget.component';
import { ItemComponent } from './items/item/item.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('../../../shared/src/lib/auth/auth.routes'),
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'budget',
    component: BudgetComponent,
    canActivate: [authGuard],
  },
  {
    path: 'items',
    component: ItemComponent,
    canActivate: [authGuard],
  },
];
