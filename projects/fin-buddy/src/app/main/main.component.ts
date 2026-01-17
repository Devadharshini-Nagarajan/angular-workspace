import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/src/public-api';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories/categories.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
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
