import { Component, computed, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { MatTableModule } from '@angular/material/table';
import { finalize, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { LoadingService } from '../../../../../shared/src/public-api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-list',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  readonly dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);

  displayedColumns: string[] = ['position', 'name', 'description', 'status', 'action'];
  dataSource = computed<any[]>(() => this.categoriesService._categoriesList());

  ngOnInit() {
    this.loadingService.setLoadingStatus({ fullPageLoading: true });
    this.categoriesService
      .getCategories()
      .pipe(
        finalize(() => {
          this.loadingService.setLoadingStatus({ fullPageLoading: false });
        })
      )
      .subscribe();
  }

  openDialog(element?: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        element: element || null,
        isEdit: element ? true : false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
