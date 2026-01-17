import { Component, inject, OnInit } from '@angular/core';
import { ItemsService } from '../items.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../categories/category-dialog/category-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { catchError, finalize } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService } from '../../categories/categories.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-item-dialog',
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
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class ItemDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private itemService = inject(ItemsService);
  public categoriesService = inject(CategoriesService);

  form!: FormGroup;
  apiError = '';
  loading = false;

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data?.element?.name || '', Validators.required],
      note: [this.data?.element?.note || '', Validators.required],
      amount: [this.data?.element?.amount || '', Validators.required],
      merchant: [this.data?.element?.merchant || ''],
      categoryId: [this.data?.element?.categoryId || '', Validators.required],
      occurredAt: [this.data?.element?.occurredAt || '', Validators.required],
    });
  }

  onSave(): void {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    const req = this.data.isEdit
      ? this.itemService.updateItem({
          ...this.form.value,
          id: this.data?.element?.id,
        })
      : this.itemService.createItem({
          ...this.form.value,
          occurredAt: this.form.value.occurredAt.toISOString(),
        });

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
      .subscribe((response) => {
        this.dialogRef.close(response);
      });
  }
}
