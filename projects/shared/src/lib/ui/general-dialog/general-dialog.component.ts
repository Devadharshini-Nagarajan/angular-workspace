import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'lib-general-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './general-dialog.component.html',
  styleUrl: './general-dialog.component.scss',
})
export class GeneralDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GeneralDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close(true);
  }
}
