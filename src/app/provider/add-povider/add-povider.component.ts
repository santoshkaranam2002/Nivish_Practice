import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-povider',
  templateUrl: './add-povider.component.html',
  styleUrl: './add-povider.component.scss'
})
export class AddPoviderComponent {
  popupForm!: FormGroup;

  // @Input() buttonLabel: string='';
  @Input() buttonClickFunction?: () => void;
  groupName: any;
  enid: any;
  buttonLabel: string="Save";
  Mobile: any;
  
  // @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<AddPoviderComponent>,private dialog:MatDialog,private fb: FormBuilder,private adminService:SuperadminService,private snackbar:MatSnackBar) {
    this.enid = this.data.enid;
  }
  ngOnInit(): void {
    this.buttonLabel = this.enid ? 'Update' : 'Save';
    this.groupName = this.data.Group_Name;
    console.log(this.groupName,"this.groupName")
    this.popupForm = this.fb.group({
      ProviderName: ['',Validators.required],
      Mobile: ['',Validators.required],
      Email: ['',Validators.required],
      ServiceLocation: ['',Validators.required],
      dateofbirth: ['',Validators.required],
      noOfSchools:['',],
      submitted: [false],

    })
    this.popupForm.get('popupInput')?.setValue(this.groupName);

  console.log(this.groupName, "this.groupName");
  }
  close(){
    this.dialogRef.close()
  }
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); 
  }
  onSubmit() {


    this.popupForm.patchValue({ submitted: true });

    if (this.popupForm.valid) {
      const startdate = this.popupForm.get('dateofbirth')?.value || null;
      if (startdate) {
        const dobDate = new Date(startdate);
        const dd = String(dobDate.getDate()).padStart(2, '0');
        const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = dobDate.getFullYear();
        const formattedstartDate = `${yyyy}-${mm}-${dd}`;
      
        const addprovider = {
          
          Name:  this.popupForm.value.ProviderName,
          MobileNumber: this.popupForm.value.Mobile,
          Email: this.popupForm.value.Email,
          ServiceLocation: this.popupForm.value.ServiceLocation,
          Date_of_Birth: formattedstartDate


        };
      console.log(addprovider);

      this.adminService.addprovider(addprovider).subscribe((data:any)=>{
        if(data['Status']===200){
          console.log(data,'successs');
          this.snackbar.open('provider has been Successfully added and email sent', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.dialogRef.close();
        }
      })
      
 
    
    }
  }
  else {
      this.popupForm.markAllAsTouched();
    }
  }



}
