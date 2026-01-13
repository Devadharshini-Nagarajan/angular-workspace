import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import _moment, { Moment } from 'moment';
import { LoadingService } from '../../../../../shared/src/public-api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { ItemsService } from '../items.service';
import { finalize } from 'rxjs/operators';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CategoriesService } from '../../categories/categories.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class ItemComponent {
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  private itemsService = inject(ItemsService);
  readonly dialog = inject(MatDialog);
  public categoriesService = inject(CategoriesService);

  categoryMap = computed(() => {
    const categories = this.categoriesService._categoriesList() ?? [];
    return new Map<string, any>(categories.map((c: any) => [c.id, c]));
  });

  itemsTableVM = computed(() => {
    const items = this.itemsService._items() ?? [];
    const catMap = this.categoryMap();

    return items.map((item: any) => {
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
  readonly minDate = new Date(
    this.now.getFullYear() - 1,
    this.now.getMonth(),
    this.now.getDate()
  );

  readonly maxDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth() + 6,
    this.now.getDate()
  );

  ngOnInit() {
    this.setMonthAndYear();
  }

  setMonthAndYear(
    normalizedMonthAndYear?: Moment,
    datepicker?: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value ?? moment();
    if (normalizedMonthAndYear) {
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
    }
    this.date.setValue(ctrlValue);
    if (datepicker) {
      datepicker.close();
    }
    this.onGetItems();
  }

  openDialog(element?: any) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      data: {
        element: element || null,
        isEdit: element ? true : false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  onGetItems() {
    if (!this.date.value) {
      return;
    }
    let yearMonth = moment(this.date.value).format('YYYY-MM');
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.itemsService
      .getItems(yearMonth)
      .pipe(
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        })
      )
      .subscribe();
  }
}
