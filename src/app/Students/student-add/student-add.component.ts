import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessPopupComponent } from '../../uicomponents/success-popup/success-popup.component';
import { SuperadminService } from '../../superadmin.service';
import { Apollo } from 'apollo-angular';
import { enterpisegropnameget,  enterpisenameQuery, smlNameQuery } from '../../Enterprise/graphql.enterprise';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.scss'
})
export class StudentAddComponent {
  tooltipTextForUploadDetails: string = "Disabled, Will be Introduced in Next Version";
  uploadDetailsDisabled: boolean = true;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  countryselectControl = new FormControl('', Validators.required);
  emergencyContactControl = new FormControl('', Validators.required);
  fathersEthinicity= new FormControl('', Validators.required);
  mothersEthinicity = new FormControl('', Validators.required);
  gender = new FormControl('', Validators.required);
  rhFactor = new FormControl('', Validators.required);
  bloodGroup = new FormControl('', Validators.required);
  ethincity = new FormControl('', Validators.required);
  addstudentForm!:FormGroup
  radioOptions: string='';
  CountryList: any[] = [];
  groupNames: { option: string, id: string }[] = [];
  enterpriseNames: any;
  nameId: any;
  enterpriseId: any;
  addmissionDate:any
  dateOfBirth:any
  formattedadmissionDate: any;
  selectedCountry: any;
  studentId: any;
  buttonLabel: string="Save & Close";
  formLabels: { [key: string]: string } = {
    Country: 'Country',
    selectedGroupName: 'Group Name',
    enterpriseNameControl: 'School',
    admissionCode: 'Regn #',
    studentClass: 'Class',
    studentSection: 'Section',
    rollNumber: 'Roll #',
    firstName: 'First Name',
    middleName1: 'Middle Name 1',
    middleName2: 'Middle Name 2',
    lastName: 'Last Name',
    ethincity: 'Ethnicity',
    bloodGroup: 'Blood Group',
    rhFactor: 'Rh Factor',
    gender: 'Gender',
    mothersFirstName: 'Mother\'s First Name',
    mothersMiddleName1: 'Mother\'s Middle Name 1',
    mothersMiddleName2: 'Mother\'s Middle Name 2',
    mothersLastName: 'Mother\'s Last Name',
    mothersEthinicity: 'Mother\'s Ethnicity',
    fathersFirstName: 'Father\'s First Name',
    fathersMiddleName1: 'Father\'s Middle Name 1',
    fathersMiddleName2: 'Father\'s Middle Name 2',
    fathersLastName: 'Father\'s Last Name',
    fathersEthinicity: 'Father\'s Ethnicity',
    building: 'Building',
    street: 'Street',
    stateProvince: 'State/Province',
    countryselect: 'Country',
    radioEGroup: 'Emergency Group',
    cityTown: 'City/Town',
    landlineNumber: 'Home Phone',
    motherMobileNumber: 'Mother\'s Mobile Number',
    fatherMobileNumber: 'Father\'s Mobile Number',
    parentEmail: 'Parent\'s Email',
    emergencyContact: 'Emergency Contact',
    emergencyContactOthers: 'Emergency Contact Others',
    emergencyFirstName: 'Emergency First Name',
    emergencyMiddleName: 'Emergency Middle Name',
    emergencyLastName: 'Emergency Last Name',
    emergencyRealtionship: 'Emergency Relationship',
    emergencyContactNumber1: 'Emergency Contact Number 1',
    emergencyContactNumber2: 'Doctor Contact Number 2',
    doctorsName: 'Doctor\'s Name',
    doctorsNumber: 'Doctor\'s Number',
    comments: 'Comments'
  };
  showEmergencyContactOthers: boolean=false;
  studentData: any;
  studentEthnicity: any;
  motherEthnicity: any;
  fatherEthnicity: any;
  
  bloodGroupradio: any;
  genderGroupradio: any;
  rhRadioChange: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog:MatDialog,private dialogRef: MatDialogRef<SuccessPopupComponent>,private studentAddRef:MatDialogRef<StudentAddComponent>,private fb:FormBuilder,private superadminService:SuperadminService,private apollo:Apollo,private snackbar:MatSnackBar,){
  }
  ngOnInit(): void {
   
    this.studentId=this.data.id;
    const enterpriseGroupId = sessionStorage.getItem("enterpriseGroupId");
    console.log(enterpriseGroupId,'enterprise group');
    const enterpriseNameId = sessionStorage.getItem("enetrpriseNameId");
    const countryNameId = sessionStorage.getItem("countryNameId");
    if(this.studentId){
      this.getstudentData();
    }  
    this.addstudentForm = this.fb.group({
      Country: ['', Validators.required],
      selectedGroupName:['',Validators.required],
      enterpriseNameControl:['',Validators.required],
      admissionCode:['',Validators.required],
      radioEGroup: ['Add Details'],
      studentClass:['',Validators.required],
      studentSection:['',Validators.required],
      rollNumber:['',Validators.required],
      firstName:['',Validators.required],
      middleName1:[''],
      middleName2:[''],
      lastName:['',Validators.required],
      admissionDate:['',Validators.required],
      // rhFactor:['',Validators.required],
      mothersFirstName:['',Validators.required],
      mothersMiddleName1:['',Validators.required],
      mothersLastName:['',Validators.required],
      fathersFirstName:['',Validators.required],
      fathersMiddleName1:['',Validators.required],
      fathersLastName:['',Validators.required],
      building:['',Validators.required],
      street:['',Validators.required],
      otherAddressPart:['',Validators.required],
      zip:['',Validators.required],
      stateProvince:['',Validators.required],
      cityTown:['',Validators.required],
      landlineNumber:['',[Validators.pattern(/^\d{10}$/)]],
      motherMobileNumber:['',[Validators.pattern(/^\d{10}$/)]],
      fatherMobileNumber:['',[Validators.pattern(/^\d{10}$/)]],
      parentEmail:['',[Validators.email]],
      emergencyContactOthers:['',],
      emergencyFirstName:['',Validators.required],
      emergencyMiddleName:['',Validators.required],
      emergencyLastName:['',Validators.required],
      emergencyRealtionship:['',Validators.required],
      emergencyContactNumber1:['',[Validators.pattern(/^\d{10}$/)]],
      emergencyContactNumber2:['',[Validators.pattern(/^\d{10}$/)]],
      doctorsName:['',Validators.required],
      doctorsNumber:['',[Validators.pattern(/^\d{10}$/)]],
      comments:['',Validators.required],
      ethincity:['',Validators.required],
    })
    this.buttonLabel = this.studentId ? 'Update & Close' : 'Save & Close';
    console.log(this.studentId,"addId");
    this.countrysget();
    this.groupnameget();
    this.onGroupNameSelectionChange(event);
  }
  onRadioButtonChangeEgroup(event: { source: { id: string; }; value: string; }){
    console.log("onRadioButtonChangeEgroup()");
    console.log("event.source=" + event.source.id);
    console.log("event.value=" + event.value);
  }

  onSubmitRadioGroup() { 
    console.log("onSubmitRadioGroup()");
    console.log("radios=" + this.radioOptions);
  }
  onRadioButtonChangeSalutation(event:{source:{id:string;};value:string}){
    console.log("onRadioButtonChangeSalutation()");
    console.log("event.source=" + event.source.id);
    console.log("event.value=" + event.value);
  }
  
  onRadioButtonChangeEmergency(event: any): void {
    this.showEmergencyContactOthers = event.value === 'Other';
    const selectedValue = event.value;
    const emergencyRealtionship = selectedValue;
    this.addstudentForm.patchValue({ emergencyRealtionship: emergencyRealtionship });
    console.log(selectedValue, "valuerelation");

    if (selectedValue === 'Mother') {
        const mothersFirstName = this.addstudentForm.get('mothersFirstName')?.value;
        const middleName = this.addstudentForm.get('mothersMiddleName1')?.value;
        const lastName = this.addstudentForm.get('mothersLastName')?.value;
        const contactnumber = this.addstudentForm.get('motherMobileNumber')?.value;
        this.addstudentForm.patchValue({
            emergencyFirstName: mothersFirstName,
            emergencyMiddleName: middleName,
            emergencyLastName: lastName,
            emergencyContactNumber1: contactnumber
        });
    }
    
    if (selectedValue === 'Father') {
        const firstName = this.addstudentForm.get('fathersFirstName')?.value;
        const middleName = this.addstudentForm.get('fathersMiddleName1')?.value;
        const lastName = this.addstudentForm.get('fathersLastName')?.value;
        const contactnumber = this.addstudentForm.get('fatherMobileNumber')?.value;
        this.addstudentForm.patchValue({
            emergencyFirstName: firstName,
            emergencyMiddleName: middleName,
            emergencyLastName: lastName,
            emergencyContactNumber1: contactnumber
        });
    }

    if (selectedValue === 'Guardian') {
        if (this.studentData && this.studentData.Emergency_Contact_Relationship === 'Guardian') {
            this.addstudentForm.patchValue({
                emergencyFirstName: this.studentData.Emergency_Contact_First_Name || '',
                emergencyMiddleName: this.studentData.Emergency_Contact_Middle_Name || '',
                emergencyLastName: this.studentData.Emergency_Contact_Last_Name || '',
                emergencyContactNumber1: this.studentData.Emergency_Contact_Phone_1 || ''
            });
        } else {
            console.log('message');
            this.addstudentForm.patchValue({
                emergencyFirstName: '',
                emergencyMiddleName: '',
                emergencyLastName: '',
                emergencyContactNumber1: ''
            });
        }
    }

    if (selectedValue === 'Other') {
        if (this.studentData && this.studentData.Emergency_Contact_Relationship === 'Other') {
            this.addstudentForm.patchValue({
                emergencyFirstName: this.studentData.Emergency_Contact_First_Name || '',
                emergencyMiddleName: this.studentData.Emergency_Contact_Middle_Name || '',
                emergencyLastName: this.studentData.Emergency_Contact_Last_Name || '',
                emergencyContactNumber1: this.studentData.Emergency_Contact_Phone_1 || ''
            });
        } else {
            this.addstudentForm.patchValue({
                emergencyFirstName: '',
                emergencyMiddleName: '',
                emergencyLastName: '',
                emergencyContactNumber1: ''
            });
        }
    }
}


  opensuccespopup() {
    this.dialogRef.close();
    let title = this.studentId ? 'Updated':'Success';
    let message = this.studentId ? 'Student updated successfully.' : 'Student added successfully.';
    let buttonLabel = this.studentId ? 'Close' : 'Add Another Student';
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      
      data: {
        title: title,
        message: message,
        buttonLabel: buttonLabel 
      },
      width: '500px'
    });
  
   
    dialogRef.componentInstance.buttonClickFunction = () => {
      
      this.addStudent();
      dialogRef.close();
    };
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }
  addStudent(){
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  close(){
    console.log("close");
    this.studentAddRef.close();
  }
  
  countrysget() {
    this.superadminService.countrysget().subscribe(
      (response: any) => {
        if (response && response.Result) {
          console.log(response,"countrys");
          this.CountryList = response.Result.sort((a: string, b: string) => a.localeCompare(b));
          console.log(this.CountryList, "countrylist");
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  groupnameget(): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: enterpisegropnameget
    }).valueChanges.subscribe(({ data, loading, error }) => {
      if (error) {
        console.error('Error fetching group names:', error);
        return;
      }
      
      if (loading) {
       
        return;
      }

      if (data && data.EnterpriseGroup) {
        
        this.groupNames = data.EnterpriseGroup.map((item: any) => ({
          option: item.Group_Name,
          id: item.id
        })) .sort((a: any, b: any) => a.option.localeCompare(b.option));;
        console.log(this.groupNames, "groupNames");
      }
    });
  }
  getenterpiseName(){
    const enterpisename ={
      enterprisegroup:parseInt(this.nameId),
    };
    console.log(enterpisename,"epname");
    this.apollo.use('campAdminClient').watchQuery({
      query:enterpisenameQuery,
      variables:enterpisename
    }).valueChanges.subscribe(({data}:any)=>
    {
      const enterpriseNames = data.EnterpriserDetails;
      
      console.log(enterpriseNames,"dg");
      if (data && data.EnterpriserDetails) {
        this.enterpriseNames  = data.EnterpriserDetails.map((item: any) => ({ option: item.Enterprise_Name, id: item.id })) .sort((a: any, b: any) => a.option.localeCompare(b.option)) .sort((a: any, b: any) => a.option.localeCompare(b.option));
      }
    })
  }
  onGroupNameSelectionChange(event: any): void {
    this.nameId= event.value;
   
    console.log('Selected Group ID:', this.nameId);
    this.getenterpiseName();
  }
  onEnterPriseNameSelectionChange(event:any): void {
    this.enterpriseId=event.value;
    console.log('Selected enterprise ID:', this.enterpriseId);
  }
  studentEthnicityChange(event:any):void{
    this.studentEthnicity=event.value
    console.log("studentEthnic",this.studentEthnicity);   
  }
  motherEthnicityChange(event:any):void{
    this.motherEthnicity=event.value
    console.log("motherEthnic",this.motherEthnicity);   
  }
  fatherEthnicityChange(event:any):void{
    this.fatherEthnicity=event.value
    console.log("fatherEthnic",this.fatherEthnicity);   
  }
  bloodGroupChange(event:any):void{
    this.bloodGroupradio=event.value
    console.log("bloodGroupradio",this.bloodGroupradio);   
  }
  genderChange(event:any):void{
    this.genderGroupradio=event.value
    console.log("genderGroupradio",this.genderGroupradio);   
  }
  rhFactorChange(event:any):void{
    this.rhRadioChange=event.value
    console.log("rhRadioChange",this.rhRadioChange);   
  }
  onAdmissionDateChange(event: any): void {
    if (event.value instanceof Date) {
        this.addmissionDate = event.value;
        console.log(this.addmissionDate, "addT");
        this.admissionDateFormat();
    }
}

  admissionDateFormat(): void {
    if (this.addmissionDate) {
      const dobDate = new Date(this.addmissionDate);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); 
      const yyyy = dobDate.getFullYear();
      this.formattedadmissionDate = `${yyyy}-${mm}-${dd}`;
    } else {
      
      this.formattedadmissionDate = ''; 
    }
  }
  onSubmit(): void {
    const controls = this.addstudentForm.controls;
    // for (const name in controls) {
    //   if (controls[name].invalid) {
    //     this.snackbar.open(`${this.formLabels[name]} is required`, 'Close', {
    //       duration: 3000, 
    //       verticalPosition: 'top',
    //       panelClass: ['custom-snackbar'] 
    //     });
    //     return; 
    //   }
    // }
    const startdate = this.dateOfBirth;
    
    console.log(startdate,"startdt");
  if (startdate) {
    const dobDate = new Date(startdate);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); 
    const yyyy = dobDate.getFullYear();
    const formattedstartDate = `${yyyy}-${mm}-${dd}`;
  
    const superAdminId = sessionStorage.getItem('superAdminId');
  
      const stdAdd:any={
        Enterprise_Group:"10",
        Enterprise_Name:this.enterpriseId,
        System_User_id:superAdminId,
        Student_Admission_Code:this.addstudentForm.value.admissionCode,
        Student_Admission_Date:this.formattedadmissionDate,
        Student_Roll_Number:this.addstudentForm.value.rollNumber,
        Student_Class:this.addstudentForm.value.studentClass,
        Student_Section:this.addstudentForm.value.studentSection,
        Student_First_Name:this.addstudentForm.value.firstName,
        Student_Middle_Name_1:this.addstudentForm.value.middleName1 || null,
        Student_Middle_Name_2:this.addstudentForm.value.middleName2 || null,
        Student_Last_Name:this.addstudentForm.value.lastName,
        Date_of_Birth:formattedstartDate,
        Gender:this.genderGroupradio,
        Blood_Group:this.bloodGroupradio,
        RH_Factor:this.rhRadioChange,
        Mothers_First_Name:this.addstudentForm.value.mothersFirstName,
        Mothers_Middle_Name:this.addstudentForm.value.mothersMiddleName1,
        Mothers_Last_Name:this.addstudentForm.value.mothersLastName,
        Fathers_First_Name:this.addstudentForm.value.fathersFirstName,
        Fathers_Middle_Name:this.addstudentForm.value.fathersMiddleName1,
        Fathers_Last_Name:this.addstudentForm.value.fathersLastName,
        Address_Building:this.addstudentForm.value.building,
        Adress_Street:this.addstudentForm.value.street,
        Other_Address_Part:this.addstudentForm.value.otherAddressPart,
        Zip: this.addstudentForm.value.zip,
        City:this.addstudentForm.value.cityTown,
        State:this.addstudentForm.value.stateProvince,
        Country:this.selectedCountry,
        Student_Ethnic_Origin:this.studentEthnicity,
        Mothers_Ethnic_Origin:this.motherEthnicity,
        Fathers_Ethnic_Origin:this.fatherEthnicity,
        Home_Phone:this.addstudentForm.value.landlineNumber,
        Mothers_Mobile_Phone:this.addstudentForm.value.motherMobileNumber,
        Fathers_Mobile_Phone:this.addstudentForm.value.fatherMobileNumber,
        Parent_Email:this.addstudentForm.value.parentEmail,
        Emergency_Contact_First_Name:this.addstudentForm.value.emergencyFirstName,
        Emergency_Contact_Middle_Name:this.addstudentForm.value.emergencyMiddleName,
        Emergency_Contact_Last_Name:this.addstudentForm.value.emergencyLastName,
        Emergency_Contact_Relationship:this.addstudentForm.value.emergencyRealtionship,
        Emergency_Contact_Phone_1:this.addstudentForm.value.emergencyContactNumber1,
        Emergency_Contact_Phone_2:this.addstudentForm.value.emergencyContactNumber2,
        Emergency_Doctor_Name:this.addstudentForm.value.doctorsName,
        Emergency_Doctor_Phone_1:this.addstudentForm.value.doctorsNumber,
        Comments:this.addstudentForm.value.comments,
      }
      if (this.studentId) {
        stdAdd.Updated_By=superAdminId;
      }
  
      console.log(stdAdd,"studentData",);
      if(!this.studentId){
      this.superadminService.addStudentMaster(stdAdd).subscribe((data:any)=>{
        if(data['Status']===200){
          console.log(data,"success");
          this.snackbar.open('Student Added Successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.studentAddRef.close();
        }
      })
    } else {
      this.superadminService.smlUpdate(this.studentId,stdAdd).subscribe((data:any)=>
      {
        if(data['Status']===200){
          console.log(data,"updated");
          this.snackbar.open('Student Updated Successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.studentAddRef.close();
        }
      })
    }
  }
}
  onCountrySelect(event: any): void {
    this.selectedCountry = event.value;
    console.log('Selected country:', this.selectedCountry);
  }
  
  goToNextTab(tabGroup: MatTabGroup): void {
    const Country = this.addstudentForm.get('Country');
    const selectedGroupName = this.addstudentForm.get('selectedGroupName');

    const enterpriseNameControl = this.addstudentForm.get('enterpriseNameControl');

    if (Country?.invalid || selectedGroupName?.invalid || enterpriseNameControl?.invalid ) {
      Country?.markAsTouched();
      selectedGroupName?.markAsTouched();
      enterpriseNameControl?.markAsTouched();
      
      return;
    }
  
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  
  
  GeneralgoToNextTab(tabGroup: MatTabGroup): void{
    const admissionCode = this.addstudentForm.get('admissionCode');
    const admissionDate = this.addstudentForm.get('admissionDate'); // Add this control in your form group
    const studentClass = this.addstudentForm.get('studentClass');
    const studentSection = this.addstudentForm.get('studentSection');
    const rollNumber = this.addstudentForm.get('rollNumber');
   



  
    // Check if any of the required fields are invalid
    if (admissionCode?.invalid || admissionDate?.invalid || studentClass?.invalid || studentSection?.invalid || rollNumber?.invalid ) {
      // Mark all fields as touched to display error messages for all
      admissionCode?.markAsTouched();
      admissionDate?.markAsTouched();
      studentClass?.markAsTouched();
      studentSection?.markAsTouched();
      rollNumber?.markAsTouched();
      
      return; // Prevent navigation to the next tab
    }
  
    // Proceed with tab navigation logic if all required fields are valid
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  StudentgoToNextTab(tabGroup: MatTabGroup): void{
    if (!this.ethincity.value) {
      this.ethincity.markAsTouched();
      this.ethincity.updateValueAndValidity();
    }
    if (!this.mothersEthinicity.value) {
      this.mothersEthinicity.markAsTouched();
      this.mothersEthinicity.updateValueAndValidity();
    }
    if (!this.fathersEthinicity.value) {
      this.fathersEthinicity.markAsTouched();
      this.fathersEthinicity.updateValueAndValidity();
    }
   
    if (!this.bloodGroup.value) {
      this.bloodGroup.markAsTouched();
      this.bloodGroup.updateValueAndValidity();
    }
    if (!this.rhFactor.value) {
      this.rhFactor.markAsTouched();
      this.rhFactor.updateValueAndValidity();
    }
    if (!this.gender.value) {
      this.gender.markAsTouched();
      this.gender.updateValueAndValidity();
    }

    if (!this.fathersEthinicity.value) {
      this.fathersEthinicity.markAsTouched();
      this.fathersEthinicity.updateValueAndValidity();
    }
    const firstName = this.addstudentForm.get('firstName');
    const lastName = this.addstudentForm.get('lastName'); // Add this control in your form group
    const ethincity = this.addstudentForm.get('ethincity');
    const bloodGroup = this.addstudentForm.get('bloodGroup');
    const rhFactor = this.addstudentForm.get('rhFactor');
    const gender = this.addstudentForm.get('rhFactor');
    const dateOfBirth = this.addstudentForm.get('dateOfBirth');
    const mothersFirstName = this.addstudentForm.get('mothersFirstName');
    const mothersMiddleName1 = this.addstudentForm.get('mothersMiddleName1');
    const mothersEthinicity = this.addstudentForm.get('mothersEthinicity');
    const mothersLastName = this.addstudentForm.get('mothersLastName');
    const fathersFirstName = this.addstudentForm.get('fathersFirstName');
    const fathersMiddleName1 = this.addstudentForm.get('fathersMiddleName1');
    const fathersLastName = this.addstudentForm.get('fathersLastName');
    const fathersEthinicity = this.addstudentForm.get('mothersEthinicity');




   



  
    // Check if any of the required fields are invalid
    if (firstName?.invalid || lastName?.invalid || bloodGroup?.invalid || rhFactor?.invalid || gender?.invalid || dateOfBirth?.invalid || mothersFirstName?.invalid|| mothersMiddleName1?.invalid || mothersLastName?.invalid || fathersFirstName?.invalid || fathersMiddleName1?.invalid|| fathersLastName?.invalid  ) {
      // Mark all fields as touched to display error messages for all
      firstName?.markAsTouched();
      lastName?.markAsTouched();
      ethincity?.markAsTouched();
      bloodGroup?.markAsTouched();
      rhFactor?.markAsTouched();
      gender?.markAsTouched();
      dateOfBirth?.markAsTouched();
      mothersFirstName?.markAsTouched();
      mothersMiddleName1?.markAsTouched();
      mothersLastName?.markAsTouched();
      mothersEthinicity?.markAsTouched();
      fathersFirstName?.markAsTouched();
      fathersMiddleName1?.markAsTouched();
      fathersLastName?.markAsTouched();
      fathersEthinicity?.markAsTouched();
    


      
      return; // Prevent navigation to the next tab
    }
  
    // Proceed with tab navigation logic if all required fields are valid
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  addressgoToPreviousTab(tabGroup: MatTabGroup): void{
    if (!this.countryselectControl.value) {
      this.countryselectControl.markAsTouched();
      this.countryselectControl.updateValueAndValidity();
    }
    const countryselectControl = this.addstudentForm.get('countryselectControl');
    const stateProvince = this.addstudentForm.get('stateProvince'); // Add this control in your form group
    const cityTown = this.addstudentForm.get('cityTown');
    const street = this.addstudentForm.get('street');
    const building = this.addstudentForm.get('building');
    const gender = this.addstudentForm.get('rhFactor');
    const otherAddressPart = this.addstudentForm.get('otherAddressPart');
    const zip = this.addstudentForm.get('zip');
    const landlineNumber = this.addstudentForm.get('landlineNumber');
    const motherMobileNumber = this.addstudentForm.get('motherMobileNumber');
    const fatherMobileNumber = this.addstudentForm.get('fatherMobileNumber');
    const parentEmail = this.addstudentForm.get('parentEmail');




   



  
    // Check if any of the required fields are invalid
    if (countryselectControl?.invalid || stateProvince?.invalid || cityTown?.invalid || street?.invalid || building?.invalid || otherAddressPart?.invalid || zip?.invalid || landlineNumber?.invalid|| motherMobileNumber?.invalid || fatherMobileNumber?.invalid ||  parentEmail?.invalid ) {
      // Mark all fields as touched to display error messages for all
      countryselectControl?.markAsTouched();
      stateProvince?.markAsTouched();
      cityTown?.markAsTouched();
      street?.markAsTouched();
      building?.markAsTouched();
      gender?.markAsTouched();
      otherAddressPart?.markAsTouched();
      zip?.markAsTouched();
      landlineNumber?.markAsTouched();
      motherMobileNumber?.markAsTouched();
      fatherMobileNumber?.markAsTouched();
      parentEmail?.markAsTouched();
     
    


      
      return; // Prevent navigation to the next tab
    }
  
    // Proceed with tab navigation logic if all required fields are valid
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  emergencygoToNextTab(tabGroup: MatTabGroup): void{
   
    const emergencyContactControl = this.addstudentForm.get('emergencyContactControl');
    const emergencyFirstName = this.addstudentForm.get('emergencyFirstName'); // Add this control in your form group
    const emergencyMiddleName = this.addstudentForm.get('emergencyMiddleName');
    const emergencyLastName = this.addstudentForm.get('emergencyLastName');
    const emergencyRealtionship = this.addstudentForm.get('emergencyRealtionship');
    const emergencyContactNumber1 = this.addstudentForm.get('emergencyContactNumber1');
 




   



  
    if (emergencyContactControl?.invalid || emergencyFirstName?.invalid || emergencyMiddleName?.invalid || emergencyLastName?.invalid || emergencyRealtionship?.invalid || emergencyContactNumber1?.invalid  ) {
      emergencyContactControl?.markAsTouched();
      emergencyFirstName?.markAsTouched();
      emergencyMiddleName?.markAsTouched();
      emergencyLastName?.markAsTouched();
      emergencyRealtionship?.markAsTouched();
      emergencyContactNumber1?.markAsTouched();

     
    


      
      return; // Prevent navigation to the next tab
    }
  
    // Proceed with tab navigation logic if all required fields are valid
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  doctorgoToNextTab(tabGroup: MatTabGroup): void{
    
    const doctorsName = this.addstudentForm.get('doctorsName');
    const doctorsNumber = this.addstudentForm.get('doctorsNumber'); // Add this control in your form group
    const emergencyContactNumber2 = this.addstudentForm.get('emergencyContactNumber2');
    const comments = this.addstudentForm.get('comments');
 




   



  
    if (doctorsName?.invalid || doctorsNumber?.invalid || emergencyContactNumber2?.invalid || comments?.invalid ) {
      doctorsName?.markAsTouched();
      doctorsNumber?.markAsTouched();
      emergencyContactNumber2?.markAsTouched();
      comments?.markAsTouched();
  

     
    


      
      return; // Prevent navigation to the next tab
    }
  
    // Proceed with tab navigation logic if all required fields are valid
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        // Move to the next tab
        tabGroup.selectedIndex = selectedIndex + 1;
      } else {
        // Submit the form on the last tab
        this.onSubmit();
      }
    }
  }
  goToPreviousTab(tabGroup: MatTabGroup): void {
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex > 0) {
        tabGroup.selectedIndex = selectedIndex - 1;
      }
    }
  }
  getstudentData(){
    const student ={
      sml:parseInt(this.studentId),
    };
    this.apollo.use('campAdminClient').watchQuery({
      query: smlNameQuery,
      variables: student,
      fetchPolicy: 'network-only' 
    }).valueChanges.subscribe(({ data }: any) => {
      console.log(data); 
      this.studentData = data.InfoseekMasterData[0];
      console.log(this.studentData,"stdData"); 
      if (this.studentData) {
        this.countryselectControl.setValue(this.studentData.Country);
        this.emergencyContactControl.setValue(this.studentData.Emergency_Contact_Relationship);
        this.ethincity.setValue(this.studentData.Student_Ethnic_Origin);
        this.bloodGroup.setValue(this.studentData.Blood_Group);
        this.gender.setValue(this.studentData.Gender);
        this.rhFactor.setValue(this.studentData.RH_Factor);
        this.mothersEthinicity.setValue(this.studentData.Mothers_Ethnic_Origin);
        this.fathersEthinicity.setValue(this.studentData.Fathers_Ethnic_Origin)
        this.addmissionDate=this.studentData.Student_Admission_Date;
        console.log(this.addmissionDate,"admission");
        this.addstudentForm.patchValue({
          Country: this.studentData.Country,
          selectedGroupName: this.studentData.Enterprise_Group,
          enterpriseNameControl: this.studentData.Enterprise_Name,
          admissionCode: this.studentData.Student_Admission_Code,
          studentClass: this.studentData.Student_Class,
          studentSection: this.studentData.Student_Section,
          rollNumber: this.studentData.Student_Roll_Number,
          firstName: this.studentData.Student_First_Name,
          middleName1: this.studentData.Student_Middle_Name_1,
          middleName2: this.studentData.Student_Middle_Name_2,
          lastName: this.studentData.Student_Last_Name,
          ethincity: this.studentData.Student_Ethnic_Origin,
          bloodGroup: this.studentData.Blood_Group,
          rhFactor: this.studentData.RH_Factor,
          gender: this.studentData.Gender,
          mothersFirstName: this.studentData.Mothers_First_Name,
          mothersMiddleName1: this.studentData.Mothers_Middle_Name,
          mothersMiddleName2: '',
          mothersLastName: this.studentData.Mothers_Last_Name,
          mothersEthinicity: this.studentData.Mothers_Ethnic_Origin,
          fathersFirstName: this.studentData.Fathers_First_Name,
          fathersMiddleName1: this.studentData.Fathers_Middle_Name,
          fathersMiddleName2: '', 
          fathersLastName: this.studentData.Fathers_Last_Name,
          fathersEthinicity: this.studentData.Fathers_Ethnic_Origin,
          building: this.studentData.Address_Building,
          street: this.studentData.Adress_Street,
          otherAddressPart:this.studentData.Other_Address_Part,
          zip:this.studentData.Zip,
          stateProvince: this.studentData.State,
          countryselect: this.studentData.Country,
          radioEGroup: this.studentData.Enterprise_Group,
          cityTown: this.studentData.City,
          landlineNumber: this.studentData.Home_Phone,
          motherMobileNumber: this.studentData.Mothers_Mobile_Phone,
          fatherMobileNumber: this.studentData.Fathers_Mobile_Phone,
          parentEmail: this.studentData.Parent_Email,
         
          emergencyFirstName: this.studentData.Emergency_Contact_First_Name,
          emergencyMiddleName: this.studentData.Emergency_Contact_Middle_Name,
          emergencyLastName: this.studentData.Emergency_Contact_Last_Name,
          emergencyRealtionship: this.studentData.Emergency_Contact_Relationship,
          emergencyContactNumber1: this.studentData.Emergency_Contact_Phone_1,
          emergencyContactNumber2: this.studentData.Emergency_Contact_Phone_2,
          doctorsName: this.studentData.Emergency_Doctor_Name,
          doctorsNumber: this.studentData.Emergency_Doctor_Phone_1,
          comments: this.studentData.Comments,
          
        });
        const relation= this.studentData.Emergency_Contact_Relationship
        console.log(relation,"relation");
        this.addstudentForm.patchValue({ emergencyContact:relation})
        this.dateOfBirth=this.studentData.Date_of_Birth,
        this.addmissionDate=this.studentData.Student_Admission_Date,
        console.log(this.addstudentForm.value,"values");
        this.onGroupNameSelectionChange(event);
        console.log(this.studentData.Adress_Street,"staste");
      }
  
    })
  }

  
}


