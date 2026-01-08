import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../../../../shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private categoriesList: WritableSignal<any> = signal([]);
  public _categoriesList = this.categoriesList.asReadonly();

  getCategories(): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get('http://localhost:3000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.categoriesList.set(data);
        })
      );
  }

  createCategory(body: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .post('http://localhost:3000/api/categories', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.categoriesList.update((categories) => [...categories, data]);
        })
      );
  }

  updateCategory(body: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch(`http://localhost:3000/api/categories`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.categoriesList.update((categories) => {
            const index = categories.findIndex(
              (cat: any) => cat.id === data.id
            );
            if (index === -1) {
              return categories;
            } else {
              const updatedCategories = [...categories];
              updatedCategories[index] = data;
              return updatedCategories;
            }
          });
        })
      );
  }
}
