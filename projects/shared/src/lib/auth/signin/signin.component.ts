import { M } from '@angular/cdk/keycodes';
import {
  Component,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignupComponent } from '../signup/signup.component';
import { AuthService } from '../auth.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../utils/loading.service';

@Component({
  selector: 'lib-signin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    SignupComponent,
    RouterModule
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
  apiError: string = '';

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
        tap((response: any) => {
          this._snackBar.open('Sign in successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/']);
        }),
        catchError((error: any) => {
          this.apiError = error.error?.response.message || 'An error occurred.';
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        })
      )
      .subscribe();
  }
}
