import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tempuin-generator',
  templateUrl: './tempuin-generator.component.html',
  styleUrl: './tempuin-generator.component.scss'
})
export class TempuinGeneratorComponent {
  tempUinForm!:FormGroup;
  buttonLabel: string="Generate Temporary UIN";
  @Input() buttonClickFunction?: () => void;
  // showEmergencyContactOthers: boolean=false;
  showConsentOthers: boolean=false;
  uploadFile: any;
  tempData: any;
  parentName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<TempuinGeneratorComponent>,private dialog:MatDialog,private fb: FormBuilder,private adminService:SuperadminService,private snackbar:MatSnackBar) {
    // this.enid = this.data.enid;
  }
  ngOnInit(){
    this.tempData=this.data.details
    // this.parentName=this.tempData.mothersfullName;
    console.log(this.tempData,"datadetails");
    this.tempUinForm = this.fb.group({
      consentGivenBy:['',Validators.required],
      consentOthers:['']
      // noOfSchools:['',],
    })
  }
  onRadioButtonChangeEgroup(event:any){
    this.showConsentOthers = event.value === 'Other';
    this.parentName='';
    if(event.value==='Mother'){
      this.parentName=this.tempData.mothersfullName;
    }
    if(event.value==='Father'){
      this.parentName='Father';
    }
    if(event.value==='Gurdian'){
      this.parentName='Gurdian';
    }
    if(event.value==='School Authority'){
      this.parentName='School Authority';
    }
    if(event.value==='Other'){
      this.parentName='Other';
    }
      
  }
  onSubmit() {
    if (this.tempUinForm.valid && this.uploadFile) {
      const formData = new FormData();
      formData.append('Student_FirstName', this.tempData.amount);
      formData.append('Student_DOB',this.tempData.dob);
      formData.append('Mothers_FullName', this.tempData.mothersfullName);
      formData.append('Registered_EmailId', this.tempData.Email);
      formData.append('Concent_Given_By', this.tempUinForm.get('consentGivenBy')?.value);
      formData.append('Concent_Given_By_Other', this.tempUinForm.get('consentOthers')?.value);
      formData.append('Concent_Image', this.uploadFile);
      console.log(formData,"formData");
      this.adminService.tempUinPost(formData).subscribe((data:any)=>{
        if(data['Status']===200){
          console.log(data,"updated");
          this.snackbar.open('Generate Temporary UIN successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.dialogRef.close()
        }
      })
    
    } else {
      this.tempUinForm.markAllAsTouched();
    }
  }
  close(){
    this.dialogRef.close()
  }
  handleFileSelected(file: File) {
    console.log('Selectefid file:', file);
    this.uploadFile=file;
    console.log(this.uploadFile,"updFile");
  }
  
}
