import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '../../../../shared/src/public-api';
import { Observable, tap } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private items: WritableSignal<Item[]> = signal([]);
  public _items = this.items.asReadonly();

  getItems(monthKey: string): Observable<Item[]> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get<Item[]>(`http://localhost:3000/api/items/${monthKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Item[]) => {
          this.items.set(data);
        }),
      );
  }

  createItem(body: Item): Observable<Item> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .post<Item>(`http://localhost:3000/api/items`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Item) => {
          this.items.update((value) => {
            return {
              ...value,
              data,
            };
          });
        }),
      );
  }

  updateItem(body: Item): Observable<Item> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch<Item>(`http://localhost:3000/api/items`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Item) => {
          const updatedItems = this.items().map((el: Item) => {
            const idx = this.items().findIndex((el: Item) => el.id === data.id);
            if (idx === -1) return el;
            else {
              return { ...el, ...data };
            }
          });
          this.items.set(updatedItems);
        }),
      );
  }

  deleteItem(id: string): Observable<Item> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .delete<Item>(`http://localhost:3000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap(() => {
          const updatedItems = this.items().filter((el: Item) => el.id !== id);
          this.items.set(updatedItems);
        }),
      );
  }

  itemsWithCategories(monthKey: string) {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get(`http://localhost:3000/api/items/dashboard/${monthKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe();
  }
}
