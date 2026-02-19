import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './item.state';
import { itemsFeatureKey } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>(itemsFeatureKey);

export const selectItems = createSelector(selectItemsState, (s) => s.items);
export const selectLoading = createSelector(selectItemsState, (s) => s.loading);
export const selectError = createSelector(selectItemsState, (s) => s.error);
export const selectMonthKey = createSelector(selectItemsState, (s) => s.monthKey);
