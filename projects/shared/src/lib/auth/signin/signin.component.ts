import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../utils/loading.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private loadingService = inject(LoadingService);

  form!: FormGroup;
  apiError = '';

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        // Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.authService
      .signIn(this.form.value)
      .pipe(
        tap(() => {
          this._snackBar.open('Sign in successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.apiError = error.error?.response.message || 'An error occurred.';
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        }),
      )
      .subscribe();
  }
}
