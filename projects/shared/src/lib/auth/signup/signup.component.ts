import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { LoadingService } from '../../utils/loading.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: '../signin/signin.component.scss',
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  form!: FormGroup;
  apiError = '';

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.authService
      .signUp(this.form.value)
      .pipe(
        tap(() => {
          this._snackBar.open('You can successfully login now!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/auth/signin']);
        }),
        catchError((error) => {
          console.log('Signup error:', error);
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
