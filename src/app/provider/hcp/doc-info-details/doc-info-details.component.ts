import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as graphql from './graphql.doc';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-doc-info-details',
  templateUrl: './doc-info-details.component.html',
  styleUrl: './doc-info-details.component.scss'
})
export class DocInfoDetailsComponent implements OnInit {
  docdetails: any;
  rowData: any;
  dochcpid: any;
  docdemographic: any;
  licensedata: any;
  experience: any;
  experiencedoctor: any;
  educationdata: any;
  doctorevents: any;
  doctorprofileevents: any;
  dialogRef!: MatDialogRef<any>;
  @ViewChild('viewdoctordialogbox', { static: true })
  viewdoctordialogbox!: TemplateRef<any>;
  eventhcid: any;
  doctoreventviewtime: any;
  doctortimeslots: any;
  docTimeSlotsData: any;
  assignments: any;
  noEvents:boolean=false;
// isLoading: any;
  ScheduledStatus: any;
  loadDoctor: any;
  spinnerLoading=true;
  constructor(
    private apollo:Apollo,
    private routes:Router,
    private dialog:MatDialog
  ){
    const navigation = this.routes.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rowData = navigation.extras.state['data'];
      this.dochcpid = this.rowData.HCPID;
      console.log('Received row data:', this.rowData);
    }
  }

  ngOnInit(): void {
 
    this.doctordetailget();
    this.doctordemographics();
    this.doctorsevendetails();
  }

  hcpmasterlist(){
   this.routes.navigate(['/hcp']);

  }

  doctordetailget(){
    const docvarabiles ={
      hcpid: parseInt(this.dochcpid)
    }
    this.apollo.use('hcpadminclient').watchQuery({
      query: graphql.doctorprofileget,
      variables:docvarabiles
    }).valueChanges.subscribe(({data}:any)=>{
      if (data && data.HcpMasterList){
        this.docdetails = data.HcpMasterList[0];
        this.spinnerLoading=false;
        console.log('docdetails', this.docdetails);
        this.experiencedoctor=this.docdetails.ExperienceData;
    
      }
    })
  }

  getGenderAbbreviation(gender: string): string {
    if (gender === 'Male') {
      return 'M';
    } else if (gender === 'Female') {
      return 'F';
    }
    return '';
  }


  getAge(dateOfBirth: string): string {
    if (!dateOfBirth) return '--'; // Handle case where date of birth is not available
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  }

  formatDateOfBirth(dateOfBirth: string): string {
    if (!dateOfBirth) return '--'; // Handle case where date of birth is not available

    const dobDate = new Date(dateOfBirth);
    return formatDate(dobDate, 'dd-MMM-yyyy', 'en-US'); // Format date as DD-MMM-YYYY (e.g., 11-Jan-1995)
  }

  doctordemographics(){
    const demographicsprofile ={
      hcpid:parseInt(this.dochcpid)
    }
    this.apollo.use('hcpadminclient').watchQuery({
      query: graphql.docdemographic,
      variables:demographicsprofile
    }).valueChanges.subscribe(({data}:any)=>{
      if(data && data.HcpMasterList){
        this.docdemographic = data.HcpMasterList[0];
        console.log('demographicdetails', this.docdemographic);
        this.licensedata=this.docdemographic.licenseData;
        this.experience=this.docdemographic.ExperienceData;
        this.educationdata=this.docdemographic.EducationData;
        console.log('licensedata',this.licensedata)
        console.log('experiencedatsa',this.experience)
        console.log('educationdata',this.educationdata)
      }
    })
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options).replace(/ /g, '-');
  }


  doctorsevendetails() {
    const doctorseventdata = {
      hcpid: parseInt(this.dochcpid)
    };
    console.log("!!!", doctorseventdata);
    this.apollo.use('campAdminClient').watchQuery({
      query: graphql.doctorevents,
      variables: doctorseventdata,
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.EventtimeslotsData) {
        this.doctorevents = data.EventtimeslotsData;
        console.log('doctoreventsssssss', this.doctorevents);
        if (this.doctorevents.length > 0) {
          this.doctorprofileevents = this.doctorevents[0].eventHealthcampData;
          console.log('doctorprofileevents', this.doctorprofileevents);
          this.ScheduledStatus=this.doctorprofileevents[0].Scheduled_Status;
          console.log('santoshpavan',this.ScheduledStatus);
          this.eventhcid = this.doctorevents[0].HCID;
          console.log('eventhcid', this.eventhcid);
          this.doctoeventviwtime();
        } else {
          console.log('No events found for the doctor.');
          this.doctorprofileevents = [];
        }
      } else {
        console.log('No EventtimeslotsData found.');
        this.doctorprofileevents = [];
      }
      this.noEvents = !this.doctorprofileevents || this.doctorprofileevents.length === 0;
    });
  }




  viewpopup(){
    this.dialogRef = this.dialog.open(this.viewdoctordialogbox,{width:"800px"
    })
  }

  
  closeDialog(): void {
    this.dialogRef.close();
  }

   doctoeventviwtime() {
    const doctorstimeline = {
      hcid: this.eventhcid
    };
    console.log('doctorstimeline', doctorstimeline);

    this.apollo.use('campAdminClient').watchQuery({
      query: graphql.doctoreventviewtime,
      variables: doctorstimeline,
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.TimeSlotsData) {
        this.docTimeSlotsData = data.TimeSlotsData;
        console.log('docTimeSlotsData', this.docTimeSlotsData);

        this.assignments = this.docTimeSlotsData.map((slot: any) => slot.assignments).flat();
        console.log('assignments', this.assignments);
      } else {
        console.error('No TimeSlotsData found.');
      }
    });
  }

  formatTime(time: string): string {
    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}
