import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoriesService } from '../categories.service';
import { catchError, finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-category-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);

  form!: FormGroup;
  apiError = '';
  loading = false;

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data?.element?.name || '', Validators.required],
      description: [this.data?.element?.description || '', Validators.required],
      isActive: [this.data?.element?.isActive || false, Validators.required],
    });
  }

  onSave(): void {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    const req = this.data.isEdit
      ? this.categoriesService.updateCategory({
          ...this.form.value,
          id: this.data?.element?.id,
        })
      : this.categoriesService.createCategory(this.form.value);
    req
      .pipe(
        catchError((error) => {
          this.apiError = error.error?.response.message || 'An error occurred.';
          return [];
        }),
        finalize(() => {
          this.loading = false;
          this.dialogRef.close();
        }),
      )
      .subscribe();
  }
}
