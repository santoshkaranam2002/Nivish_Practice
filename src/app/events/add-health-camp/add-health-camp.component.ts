import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SetUpTimePopupComponent } from '../set-up-time-popup/set-up-time-popup.component';
import { HealtCampResourceActionspopupComponent } from '../healt-camp-resource-actionspopup/healt-camp-resource-actionspopup.component';
import { SuperadminService } from '../../superadmin.service';
import { enterpisenameget, enterpisegroupnameget } from '../graphql.events';
import { classsectionget } from '../graphql.events';
import { numberofstudentsget } from '../graphql.events';

import { Apollo } from 'apollo-angular';
import { validate } from 'graphql';
interface ApiResponse {
  Result?: string[]; // Assuming Result is an array of strings representing country names
  // Add other properties if your response object has them
}
interface EnterpriseGroup {
  Group_Name: string;
  id: number;
}
@Component({
  selector: 'app-add-health-camp',
  templateUrl: './add-health-camp.component.html',
  styleUrl: './add-health-camp.component.scss'
})
export class AddHealthCampComponent {
  campForm!: FormGroup; // Define your form group
  selectedIds: any;
  dialogRef: any;
  currentTemplateName: string = 'healthcamp';
  data:any
  
  @ViewChild('dialogpopup', { static: true })
  dialogpopup!: TemplateRef<any>;
  @ViewChild('campadminpopup', { static: true })
  campadminpopup!: TemplateRef<any>;
  @ViewChild('setuptime', { static: true })
  setuptime!: TemplateRef<any>;
  selectedGroupId: any
  isOtherSelected: boolean = false;
  isHealthAssessmentSelected: boolean = false;


  @Input() label: string = ''; 
  enterpriseGroups: string[] = [];
  enterpriseNames: string[] = [];
  enterpriseGroupid: number[] = [];
  // enterpriseGroups: string[] = [];
  // enterpriseGroupid: any;
  CountryList:string[] = [];
  EventType:string[]=['Parent Orientation','Health Assessment','Work Shop','Others']
  healthassement:string[]=['Comprehensive','Biometric','Dental Camp']
  username=new FormControl('', [Validators.required]);  

  enterpriseGroupControl=new FormControl('', [Validators.required]);
  nameofenterpriseControl=new FormControl('', [Validators.required]);
  healthcampname=new FormControl('', [Validators.required]);
  // healthcamptype=new FormControl('', [Validators.required]);
  classsectionname=new FormControl('', [Validators.required]);
  country=new FormControl('', [Validators.required]);
  enterpriseGroup=new FormControl('', [Validators.required]);
  enterpriseGroupname=new FormControl('', [Validators.required]);
  comment=new FormControl('', [Validators.required]);
  enterprise=new FormControl('', [Validators.required]);
  NumberOfStudents=new FormControl('', [Validators.required]);

  stateControl=new FormControl('', [Validators.required]);
  zipcodeControl=new FormControl('', [Validators.required]);
  faxControl=new FormControl('', [Validators.required]);
  startdate=new FormControl('', [Validators.required]);
  enddate=new FormControl('', [Validators.required]);

  

  Group_Name: any;
  // enterprisegroupid: any;

  enterpriseNameId: number[] = [];  
  hcid: any;
  enterprisename: any;
  classsections: any;
  selectedEnterpriseGroupId: any;
  selectedEnterprisenameId: any;
  selectedclasses: any;
  classsectionscount: any;
  studentscount: any;
  @Input() showSpinner: boolean = false;
  groupNames: any;
  displayName= 'editform';
  Country: any;
  Street_Address: any;
  Web_Address: any;
  ZIP_Code: any;
  State: any;
  enterpriseDetails: any;
  minDate: Date;
  constructor(private dialog: MatDialog,private router:Router,private fb:FormBuilder,private superadminservice:SuperadminService, private appolo:Apollo) { 
    this.minDate = new Date();
  }
  ngOnInit(): void {
  

  
  
  
  this.groupnameget()
    // this.classsectionget()
    this.enterprisegroupget()
    this.countrysget()
    // this.enterprisename()
    this.campForm = this.fb.group({
      healthcampname:['', Validators.required],
      // healthcamptype: [null, Validators.required],
      startdate: [null, Validators.required],
      enddate: [null, Validators.required],
      Country: [null, Validators.required],
      enterprise: [null, Validators.required],
      comment: [null, Validators.required],
      NumberOfStudents: [''],
      healthcamptype:[null, Validators.required],
      group:[null, Validators.required],
      submitted: [false],
      Event: [null, Validators.required],
      Others:[''],
      Venue:[null, Validators.required],
      // schooladdress:[null, Validators.required],
      State:[null, Validators.required],


    });;
   
  }

  opendialog(): void {
    this.currentTemplateName = 'healthcampclasses';
}

oneventchange(event: any) {
  console.log(event.checked);
  if (event.checked) {
    const venue = this.campForm.get('State')?.value;
    console.log(venue, "venue");
    this.campForm.patchValue({
      Venue: venue
    });
  } else {
    this.campForm.patchValue({
      Venue: ""
    });
  }
}

 
  setuptimepopup() {
    this.router.navigate(['/setuptime'])
  }

    
  
  closeDialogAndNavigate(): void {
    this.dialog.closeAll();
    this.router.navigate(['/healthcamp']);
    }
  
openCampAdminPopup(): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.position = {
      top: '250px',
      right: '60px'
  };

  const dialogRef = this.dialog.open(this.campadminpopup, dialogConfig);
}

goback(){
  this.router.navigate(['/healthcamp'])
}

// enterprisegroupget(){
//   this.appolo.use('campAdminClient').watchQuery({
//     query: enterpisegroupnameget
//   }) .valueChanges.subscribe(({ data }: any) => {
//     console.log('Data group:', data); 
  
    
//     if (data && data.EnterpriseGroup) {
//       this.enterpriseGroups = data.EnterpriseGroup.map((item: any) => item.Group_Name);
//       this.enterpriseGroupid =data.EnterpriseGroup.map((item: any) => item.id);
      
//       console.log('Group Names:', this.enterpriseGroups);
//       console.log('enterpriseGroupid:', this.enterpriseGroupid);
      

//     }
//   });
// }

enterprisegroupget(): void {
  this.appolo.use('campAdminClient').watchQuery<any>({
    query: enterpisegroupnameget
  }).valueChanges.subscribe({
    next: ({ data }: { data: { EnterpriseGroup: EnterpriseGroup[] } }) => {
      if (data && data.EnterpriseGroup) {
        // Extract and sort the groups
        const sortedGroups = data.EnterpriseGroup
          .map((item: EnterpriseGroup) => ({
            name: item.Group_Name,
            id: item.id
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Update the arrays with sorted data
        this.enterpriseGroups = sortedGroups.map(group => group.name);
        this.enterpriseGroupid = sortedGroups.map(group => group.id);

        console.log('Sorted Group Names:', this.enterpriseGroups);
        console.log('Sorted Group IDs:', this.enterpriseGroupid);
      }
    },
    
  });
}
onEventChange(selectedValue: string) {
  this.isOtherSelected = selectedValue === 'Others';
  this.isHealthAssessmentSelected = selectedValue === 'Health Assessment';

  if (this.isHealthAssessmentSelected) {
    this.campForm.get('healthcamptype')?.enable();
  } else {
    this.campForm.get('healthcamptype')?.disable();
    this.campForm.get('healthcamptype')?.setValue('');
  }

  if (!this.isOtherSelected) {
    this.campForm.get('Others')?.setValue('');
  }
}
groupnameget(): void {
  this.appolo.use('campAdminClient').watchQuery<any>({
    query: enterpisegroupnameget
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
      })) ;
      console.log(this.groupNames, "groupNames");
    }
  });
}

// removeSelectedClass(className: string) {
//   let currentValue = this.classsectionname.value;
//   if (currentValue) {
//     const values: string[] = currentValue.split(','); // Assuming values are comma-separated
//     const index = values.indexOf(className);
//     if (index >= 0) {
//       values.splice(index, 1);
//       this.classsectionname.setValue(values.join(',')); // Join back into a string
//     }
//   }
// }
removeChip(chip: any) {
  const removevalue = this.classsectionname.value;
  // console.log(removevalue,"classsectionname")
  if (Array.isArray(removevalue)) {
    this.removeFirst(removevalue, chip);
    this.classsectionname.setValue(removevalue);
  }
}
removeFirst<T>(array: T[], toRemove: T): void {
  const index = array.indexOf(toRemove);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
classsectionget(){

  
  const variables = {
    Enterprise_name: this.enterprisename,
    From:"Infoseek"
  };
  console.log(variables,"enterprisegroupvariables")

  this.appolo.use('campAdminClient').watchQuery({
    query: classsectionget,
    variables: variables
  }).valueChanges.subscribe(({ data }: any) => {
    console.log('classsectionget:', data); // Log the entire data object
    this.classsections = data.InfoseekVerification[0].class_section;
    console.log('namedata', this.classsections);
   
  });
}
numberofstudentsget(){
  // const classsectionname = ["4A", "3A"]
  // console.log(classsectionname,"classsectionname")
  const variables = {
    enterprisename: this.enterprisename,
    classSections:this.selectedclasses
  };
  console.log("Enterprise name:", this.enterprisename);
  console.log("Selected classes:", this.selectedclasses);
  console.log(variables,"numberofstudentsgetvariables")

  this.appolo.use('campAdminClient').watchQuery({
    query: numberofstudentsget,
    variables: variables
  }).valueChanges.subscribe(({ data }: any) => {
    console.log('sectioncount', data);
    if (data && data.InfoseekClassSectionCount && data.InfoseekClassSectionCount.length > 0) {
      const classSectionInfo = data.InfoseekClassSectionCount[0];
      this.studentscount = classSectionInfo.class_section_count;
      console.log('class_section_count:', this.studentscount);
  
      // Ensure that the form control exists before setting its value
      const numberOfStudentsControl = this.campForm.get('NumberOfStudents');
      if (numberOfStudentsControl) {
        numberOfStudentsControl.setValue(this.studentscount);
      } else {
        console.error('Form control "NumberOfStudents" not found');
      }
    } else {
      console.error('No data or invalid response format');
    }
  });}
onEnterpriseclassSelectionChange(event: any) {
  this.selectedclasses = event.value;
  console.log(this.selectedclasses,"selectedclasses")
  this.numberofstudentsget()

}
onEnterprisenameSelectionChange(event: any) {
  this.selectedEnterprisenameId = event.value;
  console.log(this.selectedEnterprisenameId,"selectedEnterprisenameId")
}

onEnterpriseGroupSelectionChange(event: any) {
  this.selectedEnterpriseGroupId = event.value;
  console.log(this.selectedEnterpriseGroupId, "selectedEnterpriseGroupId");

  const variables = {
    enterpriseGroupId: this.selectedEnterpriseGroupId // Make sure the variable name matches the query
  };
  console.log(variables, "variables");

  this.appolo.use('campAdminClient').watchQuery({
    query: enterpisenameget,
    variables: variables
  }).valueChanges.subscribe({
    next: ({ data }: any) => {
      console.log('enterprisenameData:', data); // Log the entire data object

      if (data && data.EnterpriserDetails) {
        // Mapping enterprise details
        this.enterpriseNames = data.EnterpriserDetails.map((item: any) => item.Enterprise_Name);
        this.enterpriseNameId = data.EnterpriserDetails.map((item: any) => item.id);
        
        const details = data.EnterpriserDetails[0]; // Assuming you want the first set of details
        this.enterpriseDetails = `${details.Country} / ${details.State} / ${details.Street_Address} / ${details.Web_Address}`;
        this.campForm.patchValue({
          State: this.enterpriseDetails
        });

        console.log('Enterprise Names:', this.enterpriseNames);
        console.log('enterpriseDetails:', this.enterpriseDetails);

      } else {
        console.log('Data or EnterpriserDetails is undefined or null.');
      }
    },
    error: (error: any) => {
      console.error('ApolloError:', error);
      // Handle the error appropriately
    }
  });
}

// enterpisenameget(){
//   this.appolo.watchQuery({
//     query: enterpisegropnameget
//   }) .valueChanges.subscribe(({ data }: any) => {
//     console.log('Data:', data); // Log the entire data object
   
    
//     if (data && data.readContact) {
//       this.enterpriseGroups = data.readContact.map((item: any) => item.Group_Name);

//       console.log('Group Names:', this.enterpriseGroups);
//     }
  
  
    
//     else {
//       console.log('Data or listContact is undefined or null.');
//     }
//   });
// }
countrysget() {
  this.superadminservice.countrysget().subscribe(
    (response: ApiResponse) => {
      if (response && response.Result) {
        // this.CountryList = response.Result;
        // console.log(this.CountryList, "countrylist");
        this.CountryList = response.Result.sort((a: string, b: string) => a.localeCompare(b));
      }
    },
    (error) => {
      console.error('An error occurred:', error);
    }
  );

}



onSubmit() {
  this.campForm.patchValue({ submitted: true });

  if (this.campForm.valid) {
    const superAdminId = sessionStorage.getItem('superAdminId');
    
  
    console.log(superAdminId,"superAdminId")

  const startdate = this.campForm.get('startdate')?.value || null;
  if (startdate) {
    const dobDate = new Date(startdate);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = dobDate.getFullYear();
    const formattedstartDate = `${yyyy}-${mm}-${dd}`;
    const enddate = this.campForm.get('enddate')?.value || null;
    if (enddate) {
      const dobDate = new Date(enddate);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = dobDate.getFullYear();
      const formattedendDate = `${yyyy}-${mm}-${dd}`;
  const addevents={
    SA_ID: superAdminId,
    HealthCampName:this.campForm.get('healthcampname')?.value || null,
    Country:this.campForm.get('Country')?.value || null,
    EnterpriseGroupName: this.selectedEnterpriseGroupId,
    HealthCampType:this.campForm.get('healthcamptype')?.value || null,
    EnterpriseName: this.selectedEnterprisenameId,
    Event_Type:this.campForm.get('Event')?.value|| null,
    Event_Type_Others:this.campForm.get('Others')?.value|| null,
    Discription:this.campForm.get('comment')?.value|| null,
    Venue_Location:this.campForm.get('Venue')?.value|| null,
    StartDate: formattedstartDate,
    EndDate:formattedendDate,
    // Classes: "string",
    Location: this.campForm.get('State')?.value|| null,

  }
    console.log(addevents,"addevents")



// Append form values to formData

this.superadminservice.healthcampadd(addevents).subscribe(
  (data: any) => {
    if (data['Status'] === 200) {
      console.log('User data updated successfully');
      this.hcid = data.Result.HCID;
      const hcid = this.hcid;
      this.enterprisename = data.Result.EnterpriseName.id
      console.log(this.enterprisename,"enterprisename")
      const enterprisename=this.enterprisename
      // console.log(hcid,"hcid")
      sessionStorage.setItem('HCID', hcid);
      this.classsectionget()


      this.opendialog()
      //this.routes.navigate(['/stepeight'])
    }
   
    console.log( this.hcid,"hcid")
  },
  
  (error) => {
    console.error('Error updating user data:', error);
  }
);
}
  }
}
else {
  this.campForm.markAllAsTouched();
}
}
classandsectionpost() {
  this.showSpinner = true;
  const superAdminId = sessionStorage.getItem('superAdminId');
  console.log(superAdminId,"superAdminId")
  const classSectionArray = Array.isArray(this.classsectionname.value) ? this.classsectionname.value : [];
  const classAndSectionFormatted = classSectionArray
  .map((section: string) => `'${section}'`)
  .join(', ');
  const classandsectionpost={
    HCID: this.hcid,
    ClassAndSection:classAndSectionFormatted,
    Created_By: null,
    Number_of_Participant: this.campForm.get('NumberOfStudents')?.value || null,
    EnterpriseNameId:this.selectedEnterprisenameId
   

  }
    console.log(classandsectionpost,"sectionD")



// Append form values to formData

this.superadminservice.classandsectionpost(classandsectionpost).subscribe(
  (data: any) => {
    if (data['Status'] === 200) {
      
      console.log('User data updated successfully');
      this.setuptimepopup()
      // this.opendialog()
      //this.routes.navigate(['/stepeight'])
    }
  },
  (error) => {
    console.error('Error updating user data:', error);
  }
);
}

}




