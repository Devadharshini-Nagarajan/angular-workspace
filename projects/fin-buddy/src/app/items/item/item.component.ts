import { Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import _moment, { Moment } from 'moment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CategoriesService } from '../../categories/categories.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Category } from '../../categories/category.model';
import { Item } from '../item.model';
import { Store } from '@ngrx/store';
import * as ItemsSelectors from '../state/items.selectors';
import { ItemsActions } from '../state/items.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { LandingChartsComponent } from '../../landing-charts/landing-charts.component';
import { MatTabsModule } from '@angular/material/tabs';

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
  selector: 'app-item',
  imports: [
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatTableModule,
    CommonModule,
    MatProgressSpinnerModule,
    LandingChartsComponent,
    MatTabsModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class ItemComponent implements OnInit {
  private store = inject(Store);

  readonly dialog = inject(MatDialog);
  public categoriesService = inject(CategoriesService);
  items$ = this.store.select(ItemsSelectors.selectItems);
  loading$ = this.store.select(ItemsSelectors.selectLoading);
  itemsSignal = toSignal(this.items$, { initialValue: [] });

  categoryMap = computed(() => {
    const categories = this.categoriesService._categoriesList() ?? [];
    return new Map<string, Category>(categories.map((c: Category) => [c.id, c]));
  });

  itemsTableVM = computed(() => {
    console.log('Recomputing itemsTableVM');
    const items = this.itemsSignal() ?? [];
    const catMap = this.categoryMap();

    return items.map((item: Item) => {
      const category = catMap.get(item.categoryId);

      return {
        ...item,
        categoryName: category?.name ?? 'Unknown',
        categoryDescription: category?.description ?? '',
      };
    });
  });

  displayedColumns = ['name', 'category', 'amount', 'occurredAt', 'actions'];
  date = new FormControl();
  readonly now = new Date();
  readonly minDate = new Date(this.now.getFullYear() - 1, this.now.getMonth(), this.now.getDate());

  readonly maxDate = new Date(this.now.getFullYear(), this.now.getMonth() + 6, this.now.getDate());

  ngOnInit() {
    this.setMonthAndYear();
    this.categoriesService.getCategories().subscribe();
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
    const monthKey = moment(this.date.value).format('YYYY-MM');
    this.store.dispatch(ItemsActions.setMonthKey({ monthKey }));
    this.store.dispatch(ItemsActions.loadItems({ monthKey }));
  }

  openDialog(element?: Item) {
    this.dialog.open(ItemDialogComponent, {
      data: {
        element: element || null,
        isEdit: element ? true : false,
      },
    });
  }
}
