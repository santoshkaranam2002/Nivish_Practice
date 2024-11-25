import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alertpopup',
  templateUrl: './alertpopup.component.html',
  styleUrl: './alertpopup.component.scss'
})
export class AlertpopupComponent {
  @Input() buttonLabel: string='';
  @Input() buttonClickFunction?: () => void;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<AlertpopupComponent>,private dialog:MatDialog) {}
  close(){
    this.dialogRef.close()
    // location.reload();
  }
}
