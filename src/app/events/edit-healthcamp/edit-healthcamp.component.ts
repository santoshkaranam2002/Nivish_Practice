import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuperadminService } from '../../superadmin.service';
import { Apollo } from 'apollo-angular';
import { classsectionget, enterpisenameget } from '../graphql.events';
import { enterpisegropnameget } from '../../Enterprise/graphql.enterprise';
import { numberofstudentsget } from '../graphql.events';

interface ApiResponse {
  Result?: string[]; // Assuming Result is an array of strings representing country names
  // Add other properties if your response object has them
}
@Component({
  selector: 'app-edit-healthcamp',
  templateUrl: './edit-healthcamp.component.html',
  styleUrl: './edit-healthcamp.component.scss'
})

export class EditHealthcampComponent {
  
  countryControl = new FormControl('', [Validators.required]);
  enterpriseGroupControl=new FormControl('', [Validators.required]);
  nameofenterpriseControl=new FormControl('', [Validators.required]);
  firstNameControl=new FormControl('', [Validators.required]);
  lastNameControl=new FormControl('', [Validators.required]);
  emailAddressControl=new FormControl('', [Validators.required]);
  webaddressControl=new FormControl('', [Validators.required]);
  streetaddressControl=new FormControl('', [Validators.required]);
  cityControl=new FormControl('', [Validators.required]);
  stateControl=new FormControl('', [Validators.required]);
  zipcodeControl=new FormControl('', [Validators.required]);
  faxControl=new FormControl('', [Validators.required]);
  HealthCampType=new FormControl('', [Validators.required]);
  classsectionname = new FormControl([], [Validators.required]);
  Number_of_Participant = new FormControl([], [Validators.required]);

  
 
  campForm: any;
  displayName= 'editform';
  showdetails= false;
  HealthCampget: any;
  hcid: any;
  SA_ID: any;
  StartDate: any;
  EndDate: any;
  HealthCampName: any;
  EnterpriseName: any;
  Discription: any;
  Classes: any;
  Location: any;
  Scheduled_Status: any;
  Country:string[] = [];
  CountryList:string[] = [];
  enterpriseGroups: any;
  studentscount: any;
  @Input() showSpinner: boolean = false;
  isOtherSelected: boolean = false;
  isHealthAssessmentSelected: boolean = false;
  enterpriseGroupid: any;
  selectedEnterpriseGroupId: any;
  enterpriseNames: any;
  enterpriseNameId: any;
  selectedEnterprisenameId: any;
  classsections: any;
  enterprisename: any;
  selectedclasses: any;
  enterprisenames: any;
  EventType:string[]=['Parent Orientation','Health Assessment','Work Shop','Others']
  healthassement:string[]=['comprehensive','Biometric','Dental Camp']
  from='Infoseek';
  enterpriseDetails: any;
  constructor(private dialog: MatDialog,private router:Router, private fb:FormBuilder,private superadminservice:SuperadminService,private appolo:Apollo) { }


  ngOnInit(): void {
    
    this.countrysget()
    this.enterprisegroupget()

    this.healthcampgetbyid()
    this.campForm = this.fb.group({
      HealthCampName:['',],
      StartDate:[''],
      EndDate:[],
      EnterpriseName:[],
      EnterpriseGroupName:[],
      Country:[],
      classsectionname:[],
      Discription:[],
      HealthCampType:[],
      Number_of_Participant:[],
      Event:[],
      Others:[],
      Eventadress:[],
      Schooladress:[]
    });
  }
  numberofstudentsget(){
    // const classsectionname = ["4A", "3A"]
    // console.log(classsectionname,"classsectionname")
    const variables = {
      classSections:this.selectedclasses,
      enterprisename: this.enterprisenames
    };
    console.log(variables,"numberofstudentsgetvariables")
  
    this.appolo.use('campAdminClient').watchQuery({
      query: numberofstudentsget,
      variables: variables
    }).valueChanges.subscribe(({ data }: any) => {
      console.log('class', data);
      if (data && data.InfoseekClassSectionCount && data.InfoseekClassSectionCount.length > 0) {
        const classSectionInfo = data.InfoseekClassSectionCount[0];
        const Number_of_Participant = classSectionInfo.class_section_count;
        this.campForm.patchValue({Number_of_Participant:Number_of_Participant})
        console.log('class_section_count:', this.Number_of_Participant);
    
        // Ensure that the form control exists before setting its value
        // const numberOfStudentsControl = this.campForm.get('Number_of_Participant');
        // if (numberOfStudentsControl) {
        //   numberOfStudentsControl.setValue(this.studentscount);
        // } else {
        //   console.error('Form control "NumberOfStudents" not found');
        // }
      } else {
        console.error('No data or invalid response format');
      }
    });}
    classes(){
      this.displayName="classes"
    }
  enterprisegroupget(){
    this.appolo.use('campAdminClient').watchQuery({
      query: enterpisegropnameget
    }) .valueChanges.subscribe(({ data }: any) => {
      console.log('Data:', data); 
      if (data && data.EnterpriseGroup) {
        this.enterpriseGroups = data.EnterpriseGroup
        console.log('Group Names:', this.enterpriseGroups);
        // console.log('enterpriseGroupid:', this.enterpriseGroupid);
        this.onEnterpriseGroupSelectionChange(event);

  
      }
    

      
      else {
        console.log('Data or listContact is undefined or null.');
      }
    });
  }


  onEnterpriseclassSelectionChange(event: any) {
    console.log('Selection changed:', this.classsectionname.value);
    this.selectedclasses = this.classsectionname.value;
    console.log(this.selectedclasses,"selectedclasses")
    this.numberofstudentsget()
    // this.onEnterpriseGroupSelectionChange(event)
  }
  onEnterprisenameSelectionChange(event: any) {
    this.selectedEnterprisenameId = event.value;
    console.log(this.selectedEnterprisenameId,"selectedEnterprisenameId");
  }


  onEnterpriseGroupSelectionChange(event:any) {
    this.selectedEnterpriseGroupId = event.value||this.campForm.value.EnterpriseGroupName;
    console.log(this.selectedEnterpriseGroupId,event, "selectedEnterpriseGroupId");
    const variables = {
      enterpriseGroupId: this.selectedEnterpriseGroupId 
    };
    console.log(variables, "variables");
    this.appolo.use('campAdminClient').watchQuery({
      query: enterpisenameget,
      variables: variables
    }).valueChanges.subscribe({
      next: ({ data }: any) => {
        console.log('enterprisenameData:', data); 
  
        if (data && data.EnterpriserDetails) {
          this.enterpriseNames = data.EnterpriserDetails.map((item: any) => ({
            id: item.id,
            name: item.Enterprise_Name
          }));
          
          
          const details = data.EnterpriserDetails[0]; // Assuming you want the first set of details
          this.enterpriseDetails = `${details.Country} / ${details.State} / ${details.Street_Address} / ${details.Web_Address}`;
          this.campForm.patchValue({
            State: this.enterpriseDetails
          });
          console.log('Enterprise Names:',data.EnterpriserDetails, this.enterpriseNames);
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

countrysget() {
  this.superadminservice.countrysget().subscribe(
    (response: ApiResponse) => {
      if (response && response.Result) {
        this.CountryList = response.Result;
        console.log(this.CountryList, "countrylist");
      }
    },
    (error) => {
      console.error('An error occurred:', error);
    }
  );

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
    HCID:  this.hcid,
    ClassAndSection:classAndSectionFormatted,
    Created_By: superAdminId,
    Number_of_Participant: this.campForm.get('Number_of_Participant')?.value || null,
    
   

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
setuptimepopup() {
  this.router.navigate(['/setuptime'])
}
  goBack(){
    // this.router.navigate(['/healthcampedit'])
    this.displayName= 'editform';
  }
  healthcampgetbyid(){
    const HCID = sessionStorage.getItem('hcid');
    console.log(HCID,"HCID")

    this.superadminservice.healthcampgetbyid(HCID).subscribe(
      (data: any) => {
       
        const InfoseekMasterId = data.Result[0];
        console.log('EnterpriseGroupName:', InfoseekMasterId.EnterpriseGroupName.Group_Name);
        console.log('EnterpriseName:', InfoseekMasterId.EnterpriseName.Enterprise_Name);
        this.enterprisenames = InfoseekMasterId.EnterpriseName.id
        console.log(this.enterprisenames,"enterprisenames");
        const valuesArray = data.Result[0].ClassandSections.split(',').map((value:String)=> value.trim().replace(/'/g, ''));

        this.classsectionname.setValue(valuesArray)
        this.Number_of_Participant.setValue(data.Result[0].Number_of_Participant)
        if(valuesArray){
          this.onEnterpriseclassSelectionChange(event);
          this.classsectionget()
        }
        console.log(this.classsectionname.value,"cs");
        this.campForm.patchValue({
        // this.hcid = InfoseekMasterId.HCID
        HCID: InfoseekMasterId['HCID'],
        SA_ID: InfoseekMasterId['SA_ID'],
        StartDate: InfoseekMasterId['StartDate'],
        EndDate: InfoseekMasterId['EndDate'],
        HealthCampName: InfoseekMasterId['HealthCampName'],
        EnterpriseGroupName: InfoseekMasterId.EnterpriseGroupName.id,
        EnterpriseName: InfoseekMasterId.EnterpriseName?.id,
        Country: InfoseekMasterId['Country'],
        Discription: InfoseekMasterId['Discription'],
        classsectionname: InfoseekMasterId['ClassandSections'],
        HealthCampType: InfoseekMasterId['HealthCampType'],
        Location: InfoseekMasterId['Location'],
        Scheduled_Status: InfoseekMasterId['Scheduled_Status'],
        Event: InfoseekMasterId['Event_Type'],
        Others:InfoseekMasterId['Event_Type_Others'],
        Number_of_Participant : InfoseekMasterId.Number_of_Participant,
        Schooladress:InfoseekMasterId['Venue_Location'],
        Eventadress:InfoseekMasterId['Venue_Location'],


      }
      
        );  
        this.enterprisegroupget() 
        console.log(InfoseekMasterId,"getevents");
        this.enterprisegroupget()
        this.numberofstudentsget()
        
        console.log(this.campForm.value.EnterpriseGroupName,"sectionname")
        this.onEventChange(InfoseekMasterId['Event_Type']);

       this.onEnterpriseclassSelectionChange(event);
      });


  }
  // onClassSelectionChange(event: any) {
  //   this.selectedclasses = event.value;
  //   this.numberofstudentsget();
  // }
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
    console.log('pavan')
    const variables = {
      Enterprise_name:  this.enterprisenames,
      From : this.from,
    };
    console.log(variables,"enterpriseclassvariables")

  
    this.appolo.use('campAdminClient').watchQuery({
      query: classsectionget,
      variables: variables
    }).valueChanges.subscribe(({ data }: any) => {
      console.log('classsectionget:', data); // Log the entire data object
      this.classsections = data.InfoseekVerification[0].class_section;
      console.log('classections', this.classsections);
     
    });
  }
  healthcamp(){
    this.router.navigate(['/healthcamp'])

  }
  onSubmit() {
    const HCID = sessionStorage.getItem('hcid');

    const superAdminId = sessionStorage.getItem('superAdminId');
    console.log(superAdminId,"superAdminId")
    const startdate = this.campForm.get('StartDate')?.value || null;
    
    if (startdate) {
      const dobDate = new Date(startdate);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = dobDate.getFullYear();
      const formattedstartDate = `${yyyy}-${mm}-${dd}`;
      const enddate = this.campForm.get('EndDate')?.value || null;
      if (enddate) {
        const dobDate = new Date(enddate);
        const dd = String(dobDate.getDate()).padStart(2, '0');
        const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = dobDate.getFullYear();
        const formattedendDate = `${yyyy}-${mm}-${dd}`;
  
    const sectionD={
      SA_ID: superAdminId,
      HealthCampName:this.campForm.get('HealthCampName')?.value || null,
      Country: this.campForm.get('Country')?.value || null,
      EnterpriseGroupName: this.campForm.get('EnterpriseGroupName')?.value|| null,
      EnterpriseName: this.campForm.get('EnterpriseName')?.value|| null,
      Discription:this.campForm.get('Discription')?.value|| null,
      Event_Type:this.campForm.get('Event')?.value|| null,
      Event_Type_Others:this.campForm.get('Others')?.value|| null,
      HealthCampType:this.campForm.get('HealthCampType')?.value|| null,
      StartDate:formattedstartDate,
      EndDate:formattedendDate,
      Classes: this.campForm.get('classsectionname')?.value|| null,
      Number_of_Participant: this.campForm.get('Number_of_Participant')?.value|| null,
      Venue_Location:this.campForm.get('Eventadress')?.value|| null,
      Location: "string",
  
    }
      console.log(sectionD,"sectionD")
  
  
  
  // Append form values to formData
  
  this.superadminservice.healthcampupd(HCID,sectionD).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
        console.log('User data updated successfully');
        this.hcid = data.Result.HCID;
        const hcid = this.hcid;
        this.classes()
        this.enterprisename = data.Result.EnterpriseName.id
        console.log(this.enterprisename,"enterprisename")
        // console.log(hcid,"hcid")
        sessionStorage.setItem('HCID', hcid);
  
        // this.router.navigate(['/healthcamp'])
      }
      console.log( this.hcid,"hcid")
    },
    (error) => {
      console.error('Error updating user data:', error);
    }
  );
  }

}}

}
