import { createReducer, on } from '@ngrx/store';
import { ItemsActions } from './items.actions';
import { initialItemsState } from './item.state';

export const itemsFeatureKey = 'items';

export const itemsReducer = createReducer(
  initialItemsState,

  on(ItemsActions.setMonthKey, (state, { monthKey }) => ({
    ...state,
    monthKey,
  })),

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null,
  })),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ItemsActions.createItem, (state) => ({ ...state, loading: true, error: null })),
  on(ItemsActions.createItemSuccess, (state, { item }) => ({
    ...state,
    loading: false,
    items: [...state.items, item],
  })),
  on(ItemsActions.createItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ItemsActions.updateItem, (state) => ({ ...state, loading: true, error: null })),
  on(ItemsActions.updateItemSuccess, (state, { item }) => ({
    ...state,
    loading: false,
    items: state.items.map((x) => (x.id === item.id ? { ...x, ...item } : x)),
  })),
  on(ItemsActions.updateItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ItemsActions.deleteItem, (state) => ({ ...state, loading: true, error: null })),
  on(ItemsActions.deleteItemSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    items: state.items.filter((x) => x.id !== id),
  })),
  on(ItemsActions.deleteItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
