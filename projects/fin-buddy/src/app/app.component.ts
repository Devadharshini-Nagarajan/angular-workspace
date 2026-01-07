import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, LayoutComponent } from '../../../shared/src/public-api';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../shared/src/lib/utils/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, CommonModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public authService = inject(AuthService);
  public loadingService = inject(LoadingService);
  title = 'finBuddy';
  items = [
    { name: 'Categories', route: '/categories' },
    { name: 'Budget', route: '/budget' },
    { name: 'Items', route: '/items' },
  ]

  ngOnInit() {
    this.authService.loadUserFromLocalStorage().subscribe();
  }
}
