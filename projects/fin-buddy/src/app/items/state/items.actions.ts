import { createActionGroup, props } from '@ngrx/store';
import { Item } from '../item.model';

export const ItemsActions = createActionGroup({
  source: 'Items',
  events: {
    'Set Month Key': props<{ monthKey: string }>(),

    'Load Items': props<{ monthKey: string }>(),
    'Load Items Success': props<{ items: Item[] }>(),
    'Load Items Failure': props<{ error: string }>(),

    'Create Item': props<{ item: Item }>(),
    'Create Item Success': props<{ item: Item }>(),
    'Create Item Failure': props<{ error: string }>(),

    'Update Item': props<{ item: Item }>(),
    'Update Item Success': props<{ item: Item }>(),
    'Update Item Failure': props<{ error: string }>(),

    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': props<{ id: string }>(),
    'Delete Item Failure': props<{ error: string }>(),
  },
});
