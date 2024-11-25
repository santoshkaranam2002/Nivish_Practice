import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-coridnator',
  templateUrl: './add-coridnator.component.html',
  styleUrl: './add-coridnator.component.scss'
})
export class AddCoridnatorComponent {
  addCordinatorForm!:FormGroup;
  buttonLabel: string="Add";
  @Input() buttonClickFunction?: () => void;
  id: any;
  cordinator: any;
  type: any;
  isPrimaryDisabled: boolean = false;
  isSecondaryDisabled: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<AddCoridnatorComponent>,private dialog:MatDialog,private fb: FormBuilder,private adminService:SuperadminService,private snackbar:MatSnackBar) {
    // this.enid = this.data.enid;
    this.cordinator=this.data.details|| {}
    this.id=this.data.id;
    this.type=this.cordinator.type||'Primary';
  }
  ngOnInit(){
    console.log(this.cordinator,this.id);
    if (!this.cordinator) {
      this.cordinator = {};
  }
    this.addCordinatorForm = this.fb.group({
      radioEGroup:[this.cordinator.type||'',Validators.required],
      popupInput: [this.cordinator.name || '',Validators.required],
      mobileCordinator:[this.cordinator.mobile||'',Validators.required],
      emailCordinator:[this.cordinator.email||'',Validators.required]
    })
    if (this.type === 'Primary') {
      this.isSecondaryDisabled = true;
    } else if (this.type === 'Secondary') {
      this.isPrimaryDisabled = true;
    }
    this.buttonLabel = this.type ? 'Update' : 'Add';
  }
  onRadioButtonChangeEgroup(event:any){

  }
  onSubmit(){
    if(this.addCordinatorForm.valid){
      const coOrdinator={
        Coordinator_Type: this.addCordinatorForm.value.radioEGroup,
        Name:  this.addCordinatorForm.value.popupInput,
        Email: this.addCordinatorForm.value.emailCordinator,
        Mobile_No:this.addCordinatorForm.value.mobileCordinator,
      }
      this.adminService.UpdateCoordinator(this.id,coOrdinator).subscribe((data:any)=>{
        if(data['Status']===200){
          console.log(data,"cordinator data");
          this.snackbar.open('Cordinator Updated successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dialogRef.close();
        }
      })
    }else{
      this.addCordinatorForm.markAllAsTouched();
    }
  }
  close(){
    this.dialogRef.close()
  }
}
