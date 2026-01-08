import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../../../shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private currBudget: WritableSignal<any> = signal({});
  public _currBudget = this.currBudget.asReadonly();

  getBudget(): Observable<any> {
    const token = this.localStorageService.getItem('token');
    return this.http.get('http://localhost:3000/api/budget', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
