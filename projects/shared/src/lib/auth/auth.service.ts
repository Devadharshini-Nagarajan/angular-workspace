import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../utils/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);


  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  authUser = signal<any>({});

  loadUserFromLocalStorage(): Observable<any> {
    const token = this.localStorageService.getItem('token');
    if(token) {
      return this.http.get('http://localhost:3000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).pipe(
        tap((data: any) => {
          this.authUser.set({
            email: data.email,
            username: data.username,
          });
          this.isAuthenticated.next(true);
        }),
        catchError((error: any) => {
          if (error.status === 401) {
            this.signOut();
          }
          return of(null);
        })
      )
    }
    return of(null);
  }

  signIn(body: any): Observable<any> {
    console.log('Signing in with', body);
    return this.http.post('http://localhost:3000/api/auth/login', body).pipe(
      tap((data: any) => {
        if (data.token) {
          this.localStorageService.setItem('token', data.token);
          this.authUser.set({
            email: data.email,
            username: data.username,
          });
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  signUp(body: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/signup', body).pipe(
      tap((data: any) => {
        console.log('User signed up:', data);
      })
    );
  }

  signOut(): void {
    this.localStorageService.clearAll();
    this.authUser.set({});
    this.isAuthenticated.next(false);
  }
}
