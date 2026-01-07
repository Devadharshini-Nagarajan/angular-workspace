import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('../../../shared/src/lib/auth/auth.routes')
    }
];
