import { Component } from '@angular/core';
import {FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuperadminService } from '../../superadmin.service';
import { Apollo } from 'apollo-angular';
import {  enterpisenameget } from '../graphql.events';
interface ApiResponse {
  Result?: string[]; // Assuming Result is an array of strings representing country names
  // Add other properties if your response object has them
}
@Component({
  selector: 'app-health-camp-edit',
  templateUrl: './health-camp-edit.component.html',
  styleUrls: ['./health-camp-edit.component.scss']
})
export class HealthCampEditComponent {
  enterpriseGroups: string[] = ['Group 1', 'Group 2', 'Group 3'];
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
  campForm: any;
  displayName= 'editform';
  showdetails= false;
  HealthCampName: any;
  hcid: any;
  SA_ID: any;
  StartDate: any;
  EndDate: any;
  Discription: any;
  HealthCampType: any;
  EnterpriseName: any;
  Classes: any;
  Country: any;
  Location: any;
  Scheduled_Status: any;
  enterpriseNames: any;
  Number_of_Participant: any;
  Venue_Location: any;
  Event_Type: any;
  Event_Type_Others: any;
  constructor(private dialog: MatDialog,private router:Router, private fb:FormBuilder,private superadminservice:SuperadminService,private appolo:Apollo,) { }


  ngOnInit(): void {
    
    this.healthcampgetbyid()
    this.campForm = this.fb.group({
      countryControl: this.countryControl,
      enterpriseGroupControl: this.enterpriseGroupControl,
      nameofenterpriseControl: this.nameofenterpriseControl,
      cityControl: this.cityControl,
      stateControl: this.stateControl,
      zipcodeControl: this.zipcodeControl,
      startdate: ['', Validators.required],
      webaddressControl: this.webaddressControl,
      emailAddressControl: this.emailAddressControl,
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      type: ['Super Admin', Validators.required]
    });
  }
  formatDate(date: string): string {
    const options = { day: '2-digit', month: 'short', year: 'numeric' } as Intl.DateTimeFormatOptions;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate.replace(/ /g, '/');
  }


  
  healthcampedit(){
    this.router.navigate(['/edithealthcamp'])  }
  toggleDetails(){
    this.showdetails= !this.showdetails
  }
  goBack(){
    this.router.navigate(['/healthcamp'])
  }
  enterprisenameget(){
    const variables = {
      enterprisegroup:  this.enterpriseGroups
    };
  
    this.appolo.use('campAdminClient').watchQuery({
      query: enterpisenameget,
      variables: variables
    }).valueChanges.subscribe(({ data }: any) => {
      console.log('enterprisenameData:', data); // Log the entire data object
  
      if (data && data.EnterpriserDetails) {
        this.enterpriseNames = data.EnterpriserDetails.map((item: any) => item.Enterprise_Name);
        // this.enterpriseNameId = data.EnterpriserDetails.map((item: any) => item.id); // Corrected from data.listContact.map
  
        console.log('Enterprise Names:', this.enterpriseNames);
        // console.log('enterpriseNameId:', this.enterpriseNameId);
  
      } else {
        console.log('Data or EnterpriserDetails is undefined or null.');
      }
    });
  }
  
  healthcampgetbyid(){
    const HCID = sessionStorage.getItem('hcid');
    console.log(HCID,"HCID");        

    this.superadminservice.healthcampgetbyid(HCID).subscribe(
      (data: any) => {
        const InfoseekMasterId = data.Result[0];
        this.hcid = InfoseekMasterId.HCID
        this.SA_ID = InfoseekMasterId.SA_ID
        this.StartDate = this.formatDate(InfoseekMasterId.StartDate); // Format StartDate
        this.EndDate = this.formatDate(InfoseekMasterId.EndDate);
        this.HealthCampName = InfoseekMasterId.HealthCampName
        this.enterpriseGroups = InfoseekMasterId.EnterpriseGroupName.Group_Name
        this.EnterpriseName = InfoseekMasterId.EnterpriseName.Enterprise_Name
        this.Country = InfoseekMasterId.Country
        this.Discription = InfoseekMasterId.Discription
        this.Classes = InfoseekMasterId.ClassandSections
        this.HealthCampType = InfoseekMasterId.HealthCampType
        this.Location = InfoseekMasterId.Location
        this.Scheduled_Status = InfoseekMasterId.Scheduled_Status
        this.Venue_Location = InfoseekMasterId.Venue_Location
        this.Event_Type = InfoseekMasterId.Event_Type
        this.Number_of_Participant = InfoseekMasterId.Number_of_Participant
        this.Event_Type_Others = InfoseekMasterId.Event_Type_Others
        this.enterprisenameget()

        console.log(InfoseekMasterId,"InfoseekMasterId")
        console.log(this.enterpriseGroups,"enterpriseGroups")


      }
        );

  }
}
