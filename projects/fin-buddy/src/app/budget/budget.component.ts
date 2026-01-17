import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import _moment, { Moment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../../shared/src/public-api';
import { BudgetService } from './budget.service';
import { finalize } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { BudgetCategoryComponent } from './budget-category/budget-category.component';
import { BudgetCategory } from './budget.model';
import { MatIconModule } from '@angular/material/icon';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-budget',
  imports: [
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    BudgetCategoryComponent,
    MatIconModule,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class BudgetComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  public budgetService = inject(BudgetService);

  currbudget = computed(() => this.budgetService._budgetWithCategories()?.budget ?? null);
  date = new FormControl();
  private readonly now = new Date();
  budgetForm!: FormGroup;

  readonly minDate = new Date(this.now.getFullYear() - 1, this.now.getMonth(), this.now.getDate());

  readonly maxDate = new Date(this.now.getFullYear(), this.now.getMonth() + 6, this.now.getDate());
  showBudgetHint = computed(() => {
    const state = this.budgetService._budgetWithCategories();
    if (!state?.budget) return false;

    const income = Number(state.budget.income || 0);
    const savings = Number(state.budget.targetSavings || 0);

    const totalCategoryLimit = (state.budgetCategories || []).reduce(
      (sum: number, bc: BudgetCategory) => sum + Number(bc.limit || 0),
      0,
    );
    return savings + totalCategoryLimit > income;
  });

  constructor() {
    effect(() => {
      const bc = this.budgetService._budgetWithCategories();
      if (!bc) return;

      if (bc.budget) {
        this.budgetForm.patchValue(
          {
            income: bc.budget.income ?? '',
            targetSavings: bc.budget.targetSavings ?? '',
            note: bc.budget.note ?? '',
          },
          { emitEvent: false },
        );
      }
    });
  }

  ngOnInit() {
    this.budgetForm = this.fb.group({
      income: ['', Validators.required],
      targetSavings: ['', Validators.required],
      note: ['', Validators.required],
    });
    this.setMonthAndYear();
  }

  ngOnDestroy() {
    this.budgetService.resetState();
    this.budgetForm.reset();
  }

  setMonthAndYear(normalizedMonthAndYear?: Moment, datepicker?: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    if (normalizedMonthAndYear) {
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
    }
    this.date.setValue(ctrlValue);
    if (datepicker) {
      datepicker.close();
    }
    this.budgetService.resetState();
    this.budgetForm.reset();
  }

  onGenerateBudget() {
    if (!this.date.value) {
      return;
    }
    const yearMonth = moment(this.date.value).format('YYYY-MM');
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.budgetService
      .getBudgetWithCategories(yearMonth)
      .pipe(
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        }),
      )
      .subscribe();
  }

  onSaveBudget() {
    if (!this.budgetForm.valid) {
      return;
    }
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.budgetService
      .updateBudget({
        ...this.currbudget(),
        ...this.budgetForm.value,
      })
      .pipe(
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        }),
      )
      .subscribe();
  }
}
