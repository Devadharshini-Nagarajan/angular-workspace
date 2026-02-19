import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Insight, InsightsRequest } from './insights.model';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  private http = inject(HttpClient);

  getInsights(body: InsightsRequest): Observable<Insight> {
    return this.http.post<Insight>('http://localhost:3000/api/insights', body).pipe(
      tap((data: Insight) => {
        console.log('Fetched Insight:', data);
      }),
    );
  }
}
