import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService } from '../../categories/categories.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as ItemsSelectors from '../state/items.selectors';
import { ItemsActions } from '../state/items.actions';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class ItemDialogComponent implements OnInit {
  private store = inject(Store);
  readonly dialogRef = inject(MatDialogRef<ItemDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  public categoriesService = inject(CategoriesService);

  form!: FormGroup;
  error$ = this.store.select(ItemsSelectors.selectError);
  loading$ = this.store.select(ItemsSelectors.selectLoading);

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
    const payload = this.data.isEdit
      ? {
          ...this.form.value,
          id: this.data?.element?.id,
        }
      : {
          ...this.form.value,
          occurredAt: this.form.value.occurredAt.toISOString(),
        };

    this.store.dispatch(
      this.data.isEdit
        ? ItemsActions.updateItem({ item: payload })
        : ItemsActions.createItem({ item: payload }),
    );
    this.dialogRef.close();
  }
}
