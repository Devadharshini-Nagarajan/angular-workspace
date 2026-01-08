import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
   public authService = inject(AuthService);

}
