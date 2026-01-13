import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '../../../../shared/src/public-api';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private items: WritableSignal<any> = signal([]);
  public _items = this.items.asReadonly();


  getItems(monthKey: string): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get(`http://localhost:3000/api/items/${monthKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.items.set(data);
        })
      );
  }

  createItem(body: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .post(`http://localhost:3000/api/items`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.items.update((value) => {
            return {
              ...value,
              data,
            };
          });
        })
      );
  }

  updateItem(body: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch(`http://localhost:3000/api/items`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          const updatedItems = this.items().map((el: any) => {
            const idx = this.items().findIndex((el: any) => el.id === data.id);
            if (idx === -1) return el;
            else {
              return { ...el, ...data };
            }
          });
          this.items.set(updatedItems);
        })
      );
  }

  deleteItem(id: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .delete(`http://localhost:3000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap(() => {
          const updatedItems = this.items().filter((el: any) => el.id !== id);
          this.items.set(updatedItems);
        })
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
      .pipe(tap((data: any) => {}));
  }
}
