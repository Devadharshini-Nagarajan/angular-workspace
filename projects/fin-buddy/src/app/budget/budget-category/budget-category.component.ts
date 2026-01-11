import { Component, computed, effect, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { finalize, tap } from 'rxjs';
import { GeneralDialogComponent } from '../../../../../shared/src/lib/ui/general-dialog/general-dialog.component';
import { LoadingService } from '../../../../../shared/src/public-api';
import { CategoriesService } from '../../categories/categories.service';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-budget-category',
  imports: [
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './budget-category.component.html',
  styleUrl: './budget-category.component.scss',
})
export class BudgetCategoryComponent {
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  public budgetService = inject(BudgetService);
  private categoriesService = inject(CategoriesService);
  private dialog = inject(MatDialog);

  currbudget = computed(
    () => this.budgetService._budgetWithCategories().budget
  );
  categoryForm!: any;
  addActiveCategories: any = [];

  constructor() {
    effect(() => {
      const bc = this.budgetService._budgetWithCategories();
      if (!bc) return;

      if (bc.budget) {
        this.rebuildRows(bc.budgetCategories ?? []);
        this.findActiveCategories();
      }
    });
  }
  ngOnInit() {
    this.categoryForm = this.fb.group({
      rows: this.fb.array<FormGroup>([]),
    });
  }

  ngOnDestroy() {
    this.categoryForm.reset();
  }

  get rowsFA() {
    return this.categoryForm.controls.rows;
  }

  private rebuildRows(bcList: any) {
    this.rowsFA.clear({ emitEvent: false });

    bcList.forEach((bc: any) => {
      this.rowsFA.push(this.createRow(bc), { emitEvent: false });
    });

    this.categoryForm.markAsPristine();
    this.categoryForm.markAsUntouched();
  }

  private createRow(bc: any) {
    return this.fb.group({
      id: this.fb.nonNullable.control(bc.id),
      categoryId: this.fb.nonNullable.control(bc.categoryId),
      limit: this.fb.nonNullable.control(bc.limit ?? 0, [
        Validators.required,
        Validators.min(0),
      ]),
      name: bc.category.name,
      description: bc.category.description,
      isActive: bc.category.isActive,
    });
  }

  findActiveCategories() {
    const budgetCategorySet = new Set(
      this.budgetService
        ._budgetWithCategories()
        .budgetCategories.map((cat: any) => cat.categoryId)
    );
    this.addActiveCategories = this.categoriesService
      ._categoriesList()
      .filter((cat: any) => cat.isActive && !budgetCategorySet.has(cat.id));
  }

  onUpdateCategoryLimit() {
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    if (!this.categoryForm.valid) {
      return;
    }
    const body = this.rowsFA.controls.map((ctrl: any) => {
      return {
        id: ctrl.get('id').value,
        limit: ctrl.get('limit').value,
      };
    });
    this.budgetService
      .updateBudgetCategoryLimit(body)
      .pipe(
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        })
      )
      .subscribe();
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(GeneralDialogComponent, {
      data: {
        title: 'Add Category Limit',
        message: `You have ${this.addActiveCategories.length} more active categories without limits. Are you sure to add?`,
        action: {
          name: 'Save',
        },
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.setLoadingStatus({ fullPageLoading: true });
        const body = {
          budgetId: this.currbudget().id,
          categoryIds: this.addActiveCategories.map((el: any) => el.id),
        };
        this.budgetService
          .createBudgetCategory(body)
          .pipe(
            tap(() => {
              this.findActiveCategories();
            }),
            finalize(() => {
              this.loadingService.setLoadingStatus({ fullPageLoading: false });
            })
          )
          .subscribe();
      }
    });
  }
}
