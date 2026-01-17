import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../../../../shared/src/public-api';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private categoriesList: WritableSignal<Category[]> = signal([]);
  public _categoriesList = this.categoriesList.asReadonly();

  getCategories(): Observable<Category[]> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get<Category[]>('http://localhost:3000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Category[]) => {
          this.categoriesList.set(data);
        }),
      );
  }

  createCategory(body: Partial<Category>): Observable<Category> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .post<Category>('http://localhost:3000/api/categories', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Category) => {
          this.categoriesList.update((categories) => [...categories, data]);
        }),
      );
  }

  updateCategory(body: Partial<Category>): Observable<Category> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch<Category>(`http://localhost:3000/api/categories`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Category) => {
          this.categoriesList.update((categories) => {
            const index = categories.findIndex((cat: Category) => cat.id === data.id);
            if (index === -1) {
              return categories;
            } else {
              const updatedCategories = [...categories];
              updatedCategories[index] = data;
              return updatedCategories;
            }
          });
        }),
      );
  }
}
