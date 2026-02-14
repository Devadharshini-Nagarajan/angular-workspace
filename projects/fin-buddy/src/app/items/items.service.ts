import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);

  private items: WritableSignal<Item[]> = signal([]);
  public _items = this.items.asReadonly();

  getItems(monthKey: string): Observable<Item[]> {
    return this.http.get<Item[]>(`http://localhost:3000/api/items/${monthKey}`).pipe(
      tap((data: Item[]) => {
        this.items.set(data);
      }),
    );
  }

  createItemEffect(body: Item): Observable<Item> {
    return this.http.post<Item>(`http://localhost:3000/api/items`, body);
  }

  updateItemEffect(body: Item): Observable<Item> {
    return this.http.patch<Item>(`http://localhost:3000/api/items`, body);
  }

  deleteItemEffect(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/items/${id}`);
  }

  getItemsEffect(monthKey: string): Observable<Item[]> {
    return this.http.get<Item[]>(`http://localhost:3000/api/items/${monthKey}`);
  }

  createItem(body: Item): Observable<Item> {
    return this.http.post<Item>(`http://localhost:3000/api/items`, body).pipe(
      tap((data: Item) => {
        console.log('Created Item:', data);
        this.items.update((value) => [...value, data]);
      }),
    );
  }

  updateItem(body: Item): Observable<Item> {
    return this.http.patch<Item>(`http://localhost:3000/api/items`, body).pipe(
      tap((data: Item) => {
        const current = this.items();
        const idx = current.findIndex((x: Item) => x.id === data.id);

        if (idx === -1) return;

        const updatedItems = current.map((x: Item, i: number) =>
          i === idx ? { ...x, ...data } : x,
        );

        this.items.set(updatedItems);
      }),
    );
  }

  deleteItem(id: string): Observable<Item> {
    return this.http.delete<Item>(`http://localhost:3000/api/items/${id}`).pipe(
      tap(() => {
        const updatedItems = this.items().filter((el: Item) => el.id !== id);
        this.items.set(updatedItems);
      }),
    );
  }

  itemsWithCategories(monthKey: string) {
    return this.http.get(`http://localhost:3000/api/items/dashboard/${monthKey}`).pipe();
  }
}
