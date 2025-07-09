import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-download-confirm-dialog',
  templateUrl: './download-confirm-dialog.component.html',
  styleUrls: ['./download-confirm-dialog.component.css']
})
export class DownloadConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<DownloadConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Pass true if confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // Pass false if canceled
  }
}




// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-download-confirm-dialog',
//   templateUrl: './download-confirm-dialog.component.html',
//   styleUrls: ['./download-confirm-dialog.component.css']
// })
// export class DownloadConfirmDialogComponent {

// }
