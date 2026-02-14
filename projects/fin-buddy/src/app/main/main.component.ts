import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/src/public-api';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories/categories.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LandingChartsComponent } from '../landing-charts/landing-charts.component';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    RouterModule,
    LandingChartsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  public authService = inject(AuthService);
  private categoriesService = inject(CategoriesService);
  currentIndex = 0;
  carouselImages = [
    'assets/images/Items.png',
    'assets/images/AI Insights.png',
    'assets/images/Budget.png',
    'assets/images/BudgetCategory.png',
    'assets/images/Categories.png',
  ];

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    }, 3000);
  }
}
