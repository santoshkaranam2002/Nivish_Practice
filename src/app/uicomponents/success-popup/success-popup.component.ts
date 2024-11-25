import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StudentAddComponent } from '../../Students/student-add/student-add.component';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss'
})
export class SuccessPopupComponent {
  @Input() buttonLabel: string='';
  @Input() buttonClickFunction?: () => void;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<SuccessPopupComponent>,private dialog:MatDialog) {}
  close(){
    this.dialogRef.close()
    // location.reload();
  }
  
}

