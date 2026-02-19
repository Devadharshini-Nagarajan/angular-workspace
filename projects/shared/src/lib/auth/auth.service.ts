import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../utils/local-storage.service';
import { Router } from '@angular/router';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  private isAuthenticated = new BehaviorSubject<boolean>(
    !!this.localStorageService.getItem('token'),
  );
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  authUser = signal<Partial<User> | null>(null);

  loadUserFromLocalStorage(): Observable<User | null> {
    const token = this.localStorageService.getItem('token');
    if (token) {
      return this.http
        .get<User>('http://localhost:3000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          tap((data: User) => {
            this.authUser.set({
              email: data.email,
              username: data.username,
            });
            this.isAuthenticated.next(true);
          }),
          catchError((error) => {
            if (error.status === 401) {
              this.signOut();
            }
            return of(null);
          }),
        );
    }
    return of(null);
  }

  signIn(body: Partial<User>): Observable<Partial<User>> {
    return this.http.post<Partial<User>>('http://localhost:3000/api/auth/login', body).pipe(
      tap((data: Partial<User>) => {
        if (data.token) {
          this.localStorageService.setItem('token', data.token);
          this.authUser.set({
            email: data.email,
            username: data.username,
          });
          this.isAuthenticated.next(true);
        }
      }),
    );
  }

  signUp(body: Partial<User>): Observable<Partial<User>> {
    return this.http.post('http://localhost:3000/api/auth/signup', body).pipe(
      tap((data: Partial<User>) => {
        console.log('User signed up:', data);
      }),
    );
  }

  signOut(): void {
    this.localStorageService.clearAll();
    this.authUser.set({});
    this.isAuthenticated.next(false);
    this.router.navigate(['/']);
  }
}
