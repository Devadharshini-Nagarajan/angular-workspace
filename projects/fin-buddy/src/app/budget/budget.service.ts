import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import {
  LocalStorageService,
  toYearMonth,
} from '../../../../shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private budgetWithCategories: WritableSignal<any> = signal({}); // object od budget, budgetCategories
  public _budgetWithCategories = this.budgetWithCategories.asReadonly();

  resetState() {
    this.budgetWithCategories.set({});
  }

  getBudgetWithCategories(monthKey: string): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get(`http://localhost:3000/api/budgets/categoryLimits/${monthKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.budgetWithCategories.set(data);
        })
      );
  }

  updateBudget(body: any): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch(`http://localhost:3000/api/budgets`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          this.budgetWithCategories.update((value) => {
            return {
              ...value,
              budget: data,
            };
          });
        })
      );
  }

  updateBudgetCategoryLimit(body: any) {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch(`http://localhost:3000/api/budget-category`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: any) => {
          const budgetCategories =
            this.budgetWithCategories().budgetCategories.map((el: any) => {
              const foundItem = data.find((cat: any) => cat.id === el.id);
              if (foundItem) {
                return { ...el, limit: foundItem.limit };
              }
              return el;
            });
          this.budgetWithCategories.update((value) => {
            return {
              ...value,
              budgetCategories,
            };
          });
        })
      );
  }

  createBudgetCategory(body: any) {
    const token = this.localStorageService.getItem('token');
    return this.http
      .post(`http://localhost:3000/api/budget-category`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(switchMap(() => this.getBudgetWithCategories(toYearMonth())));
  }
}
