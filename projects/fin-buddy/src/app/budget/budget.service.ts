import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { toYearMonth } from '../../../../shared/src/public-api';
import { Budget, BudgetCategory, BudgetWithCategory, createBudgetCategory } from './budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);

  private budgetWithCategories: WritableSignal<BudgetWithCategory | null> = signal(null);
  public _budgetWithCategories = this.budgetWithCategories.asReadonly();

  resetState() {
    this.budgetWithCategories.set(null);
  }

  getBudgetWithCategories(monthKey: string): Observable<BudgetWithCategory> {
    return this.http
      .get<BudgetWithCategory>(`http://localhost:3000/api/budgets/categoryLimits/${monthKey}`)
      .pipe(
        tap((data: BudgetWithCategory) => {
          this.budgetWithCategories.set(data);
        }),
      );
  }

  updateBudget(body: Partial<Budget>): Observable<Budget> {
    return this.http.patch<Budget>(`http://localhost:3000/api/budgets`, body).pipe(
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
    return this.http
      .patch<Partial<BudgetCategory>[]>(`http://localhost:3000/api/budget-category`, body)
      .pipe(
        tap((data) => {
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
    return this.http
      .post(`http://localhost:3000/api/budget-category`, body)
      .pipe(switchMap(() => this.getBudgetWithCategories(toYearMonth())));
  }
}
