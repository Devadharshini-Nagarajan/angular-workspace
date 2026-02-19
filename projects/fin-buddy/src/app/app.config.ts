import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from '../../../shared/src/lib/auth/auth-token.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { itemsFeatureKey, itemsReducer } from './items/state/items.reducer';
import { ItemsEffects } from './items/state/items.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    provideStore(),
    provideState({ name: itemsFeatureKey, reducer: itemsReducer }),
    provideEffects([ItemsEffects]),
  ],
};
