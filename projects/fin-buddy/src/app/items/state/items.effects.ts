import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemsService } from '../items.service';
import { ItemsActions } from './items.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errMsg(e: any, fallback: string) {
  return e?.error?.response?.message ?? e?.message ?? fallback;
}

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(({ monthKey }) =>
        this.itemsService.getItemsEffect(monthKey).pipe(
          map((items) => ItemsActions.loadItemsSuccess({ items })),
          catchError((e) => of(ItemsActions.loadItemsFailure({ error: errMsg(e, 'Load failed') }))),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.createItem),
      mergeMap(({ item }) =>
        this.itemsService.createItemEffect(item).pipe(
          map((created) => ItemsActions.createItemSuccess({ item: created })),
          catchError((e) =>
            of(ItemsActions.createItemFailure({ error: errMsg(e, 'Create failed') })),
          ),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.updateItem),
      mergeMap(({ item }) =>
        this.itemsService.updateItemEffect(item).pipe(
          map((updated) => ItemsActions.updateItemSuccess({ item: updated })),
          catchError((e) =>
            of(ItemsActions.updateItemFailure({ error: errMsg(e, 'Update failed') })),
          ),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.deleteItem),
      mergeMap(({ id }) =>
        this.itemsService.deleteItemEffect(id).pipe(
          map(() => ItemsActions.deleteItemSuccess({ id })),
          catchError((e) =>
            of(ItemsActions.deleteItemFailure({ error: errMsg(e, 'Delete failed') })),
          ),
        ),
      ),
    ),
  );
}
