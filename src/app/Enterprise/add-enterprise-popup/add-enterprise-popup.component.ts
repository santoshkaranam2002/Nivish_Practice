import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SuccessPopupComponent } from '../../uicomponents/success-popup/success-popup.component';
@Component({
  selector: 'app-add-enterprise-popup',
  templateUrl: './add-enterprise-popup.component.html',
  styleUrl: './add-enterprise-popup.component.scss'
})
export class AddEnterprisePopupComponent {
  popupForm!: FormGroup;

  // @Input() buttonLabel: string='';
  @Input() buttonClickFunction?: () => void;
  groupName: any;
  enid: any;
  buttonLabel: string="Save";
  // @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<AddEnterprisePopupComponent>,private dialog:MatDialog,private fb: FormBuilder,private adminService:SuperadminService,private snackbar:MatSnackBar) {
    this.enid = this.data.enid;
  }
  ngOnInit(): void {
    this.buttonLabel = this.enid ? 'Update' : 'Save';
    this.groupName = this.data.Group_Name;
    console.log(this.groupName,"this.groupName")
    this.popupForm = this.fb.group({
      popupInput: [this.data.Group_Name || '',Validators.required],
      noOfSchools:['',],

    })
    this.popupForm.get('popupInput')?.setValue(this.groupName);

  console.log(this.groupName, "this.groupName");
  }
  close(){
    this.dialogRef.close()
  }
  onSubmit() {
    if (this.popupForm.valid) {
      const superAdminId = sessionStorage.getItem('superAdminId');

      if (superAdminId) {
        const formData = {
          SuperAdmin_ID: superAdminId,
          Group_Name: this.popupForm.value.popupInput

        };
      console.log(formData);
      if(!this.enid){
      this.adminService.enterpriseGroupPost(formData).subscribe((data:any)=>{
        if(data['Status']===200){
          console.log(data,'successs');
          this.snackbar.open('Enterprise Group added successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.buttonClickFunction?.()

        }
      })
      }
      else{
        this.adminService.enterpriseGroupupdate(this.enid,formData).subscribe((data:any)=>{
          if(data['Status']===200){
            console.log(data,'successs');
            this.snackbar.open('Enterprise Group updated successfully', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
            this.buttonClickFunction?.()
          }
        })
        }
    }
    }else {
      this.popupForm.markAllAsTouched();
    }
  }


}
