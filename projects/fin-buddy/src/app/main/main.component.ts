import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/src/public-api';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories/categories.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  public authService = inject(AuthService);
  private categoriesService = inject(CategoriesService);

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();
  }
}
