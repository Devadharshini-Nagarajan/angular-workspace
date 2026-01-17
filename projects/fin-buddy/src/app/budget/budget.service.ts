import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService, toYearMonth } from '../../../../shared/src/public-api';
import { Budget, BudgetCategory, BudgetWithCategory, createBudgetCategory } from './budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private budgetWithCategories: WritableSignal<BudgetWithCategory | null> = signal(null);
  public _budgetWithCategories = this.budgetWithCategories.asReadonly();

  resetState() {
    this.budgetWithCategories.set(null);
  }

  getBudgetWithCategories(monthKey: string): Observable<BudgetWithCategory> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .get<BudgetWithCategory>(`http://localhost:3000/api/budgets/categoryLimits/${monthKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: BudgetWithCategory) => {
          this.budgetWithCategories.set(data);
        }),
      );
  }

  updateBudget(body: Partial<Budget>): Observable<Budget> {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch<Budget>(`http://localhost:3000/api/budgets`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data: Budget) => {
          this.budgetWithCategories.update((value) => {
            if (!value) return value;
            return {
              ...value,
              budget: data,
            };
          });
        }),
      );
  }

  updateBudgetCategoryLimit(body: Partial<BudgetCategory>[]) {
    const token = this.localStorageService.getItem('token');
    return this.http
      .patch<Partial<BudgetCategory>[]>(`http://localhost:3000/api/budget-category`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((data) => {
          // const budgetCategories = this.budgetWithCategories()?.budgetCategories.map((el: any) => {
          //   const foundItem = data.find((cat: any) => cat.id === el.id);
          //   if (foundItem) {
          //     return { ...el, limit: foundItem.limit };
          //   }
          //   return el;
          // });
          // this.budgetWithCategories.update((value) => {
          //   if (!value) return value;
          //   return {
          //     ...value,
          //     budgetCategories,
          //   };
          // });
          this.budgetWithCategories.update((value) => {
            if (!value) return value;

            const updatedBudgetCategories = value.budgetCategories.map((el) => {
              const found = data.find((x) => x.id === el.id);
              return found?.limit != null ? { ...el, limit: found.limit } : el;
            });

            return {
              ...value,
              budgetCategories: updatedBudgetCategories,
            };
          });
        }),
      );
  }

  createBudgetCategory(body: createBudgetCategory) {
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
