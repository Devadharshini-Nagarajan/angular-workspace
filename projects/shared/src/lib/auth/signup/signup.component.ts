import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'lib-signup',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  form!: FormGroup;
  toggle = output<void>();

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  switchToSignIn() {
    this.toggle.emit();
  }

  onSubmit() {
    this.authService
      .signIn(this.form.value)
      .pipe(
        tap((response: any) => {
          this._snackBar.open('You can successfully login now!', 'Close', {
            duration: 3000,
          });
          this.toggle.emit();
        })
      )
      .subscribe();
  }
}
