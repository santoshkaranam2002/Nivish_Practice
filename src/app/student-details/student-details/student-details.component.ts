import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
// import { Demographics, events, studentinfo, studentschool } from '../graphql.student';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import { StudentIdCardComponent } from '../../download-id-cards/student-id-card/student-id-card.component';
// import { demographicsInfoWithId, schoolInfoWithId, studentInfoWithId } from '../graph.ql.studentinformation';
import { formatDate } from '@angular/common';
import { SuperadminService } from '../../superadmin.service';
import { StudentAddComponent } from '../../Students/student-add/student-add.component';
import { Demographics, demographicsInfoWithId, events, schoolInfoWithId, studentInfoWithId, studentinfo, studentschool } from '../graphql.school';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html'
})
export class StudentDetailsComponent implements OnInit {
  [x: string]: any;
  isLoading: boolean = true;
  orders: any;
  cookieService: any;
  studentDetails: { Name: any; Class: any; Section: any; Roll: any; UIN: any; } | undefined;
  studentName:any;
  class:any;
  UIN:any;
  sectionname:any;
  roll:any;
  Registrationnumber:any;
  dob:any;
  Gender:any;
  studentId:any
  studentinfodetails: any;
  InfosicID: any;
  studentifoevents: any;
  studenschooltab: any;
  DemographicsTab: any;
  getDemographicsInfos: any;
  studentAge: number | string = '--';
  age:any;
  mobile: any;
  studentphoto: any;
  qrcode: any;
  uin: any;
  id: any;
  schoolid: any;
  getSchoolInfoz: any;
  getSchoolInfotab: any;
  enterpriseDetails:any;
  getStudentInfos:any;
  noEvents: boolean = false;
  studentData:any;
  infoseekId:any;
  spinnerLoading=true;
  constructor(private router: Router, private elementRef: ElementRef, private dialog: MatDialog, private apollo:Apollo, private adminService:SuperadminService,private route: ActivatedRoute,private location:Location
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.studentData = navigation?.extras?.state?.['data'];
    console.log(this.studentData,'studentDatanarayana');
    console.log(navigation,'navigation');

  }

  backstotudentlist() {
    this.router.navigate(['/dashboard/student-master-list']);
  }
  ngOnInit(): void {
    // const navigation = this.router.getCurrentNavigation();
    // this.studentData = navigation?.extras?.state?.['data'];
    // console.log(this.studentData,"studentId");
    // const rowData = history.state.rowData;
    this.studentId =  this.studentData.id;
    this.InfosicID=this.studentData.Infoseek_Masterid;
    // this.schoolid = rowData.id;
    // this.InfosicID = rowData.infoseekid;
    this.uin = this.studentData.uin;
    this.studentinfoget();
    this.studentphotos();
    this.eventsget();
    this.studentschooltab();
    // this.Demographics();
    this.getSchoolInfo();
    this.getStudentInfo();
    this. getDemographicsInfo ();
    // console.log('rowData', rowData);
    console.log(this.InfosicID,  'InfosicID');
    console.log( this.studentId, 'studentId');

    const deleteButton = this.elementRef.nativeElement.querySelector('#deleteButton');
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        this.deleteAction();
      });
    }
    this.studentifoevents = this.fetchEvents();

    if (window.screen.width <= 960) { // 768px portrait
      this.mobile = true;
    }
    this.studentifoevents.sort((a: any, b: any) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime());

  }

  deleteAction() {
    console.log("Delete functionality triggered!");
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification(`Copied to clipboard: ${text}`);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  showNotification(message: string) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.classList.add('show');

      // Hide the notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  openEditPopup(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      data: {
        details: this.getStudentInfos || this.studentinfodetails,
        age: this.age,
        showFullName: false,
        id:this.schoolid
      },
      width: '90%',
      height: '90%',
    });

    console.log('Opening edit popup with data:', this.getStudentInfos);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit popup was closed');
      if (result) {
        // this.updatedata(); // Call update method if there are changes
      }
      this.studentinfoget();
      this.studentphotos();
      this.eventsget();
      this.studentschooltab();
      // this.Demographics();
      this.getSchoolInfo();
      this.getStudentInfo();
      this. getDemographicsInfo ();
    });
  }

  Schooledittab(): void {
    // const dialogRef = this.dialog.open(EditStudentDataComponent, {
    //   data: {
    //     details: this.getStudentInfos || this.studentinfodetails,
    //     age: this.age,
    //     showFullName: true,
    //     id: this.InfosicID || this.schoolid
    //   },
    //   width: '40%',
    //   height: '90%',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The edit popup was closed');
    //   if (result) {
    //     // this.updatedata();
    //   }
    // });
  }


  ondownloadidcard(): void {
    // this.studentinfoget().then(() => {
    //   const dialogRef = this.dialog.open(StudentIdCardComponent, {
    //     data: {
    //       details: this.studentinfodetails,
    //       age: this.age,
    //       showFullName: false,
    //       Id: this.InfosicID
    //     },
    //     width: '80%',
    //     height: '90%',
    //   });
    //   console.log(this.studentinfodetails,'editdata');


    // }).catch((error: any) => {  // Adding type for error parameter
    //   console.error('Failed to fetch student info before opening dialog', error);
    //   console.log('The edit popup was closed');

    // });
  }

  eventeditButton(): void {
    // const dialogRef = this.dialog.open(EditEventsDataComponent, {
    //   data: { details: this.studentifoevents, formType: 'eventinfo' },

    //   width: '40%',
    //   height: '90%',
    // });console.log( this.studentifoevents,' studentifoeventsediutpopup')

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The edit popup was closed');
    // });
  }


  Demographics_Parentsinfo(): void {
    // const dialogRef = this.dialog.open(ParentsInfoDataComponent, {
    //   data: { details: this.DemographicsTab||this.getDemographicsInfos, showFullName: true, id: this.InfosicID || this.schoolid , formType: 'parentInfo' },
    //   width: '40%',
    //   height: '90%',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The edit popup was closed');
    // });
  }

  Demographics_Otherinfo(): void {
    // const dialogRef = this.dialog.open(ParentsInfoDataComponent, {
    //   data: { details: this.DemographicsTab||this.getDemographicsInfos, showFullName: true,  id: this.InfosicID || this.schoolid ,formType: 'otherInfo' },
    //   width: '40%',
    //   height: '90%',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The edit popup was closed');
    // });
  }


  retrieveDataFromCookies() {
    throw new Error('Method not implemented.');
  }

studentinfoget(): Promise<void> {
  if (!this.InfosicID|| this.studentId) {
    this.isLoading = true; // Set isLoading to true before making the request
    // Call the getStudentInfo function if InfosicID is null
    return this.getStudentInfo().then(age => {
      this.age = age; // Assign the returned age
    }).finally(() => {
      this.isLoading = false;
    });
  }

  this.isLoading = true; // Set isLoading to true before making the request

  const studentvariable = {
    infoseekid: this.InfosicID|| this.studentId
  };
  console.log('studentdatawithinfpseekidinfopage', studentvariable);

  return new Promise((resolve, reject) => {
    this.apollo.use('superAdminevents').watchQuery({
      query: studentinfo,
      variables: studentvariable,
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(
      ({ data }: any) => {
        const studentDetails = data.infoseekDetails;
        this.age = this.calculateAge(studentDetails[0].Date_of_Birth);

        // Create a new object with the additional formattedDOB property
        const studentDetailWithDOB = {
          ...studentDetails[0],
          formattedDOB: this.formatDateOfBirth(studentDetails[0].Date_of_Birth)
        };

        // Create a new array with the updated element
        this.studentinfodetails = [
          studentDetailWithDOB,
          ...studentDetails.slice(1)
        ];

        console.log('studentinfodetails', this.age, this.studentinfodetails[0].formattedDOB);
        resolve(); // Resolving the promise here
        this.spinnerLoading = false;// Disable loading indicator after data is received
        console.log('studentdatawithinfpseekidinfopage',this.studentinfodetails);

      },
      error => {
        console.error('Error fetching student info', error);
        reject(error); // Rejecting the promise on error
        this.spinnerLoading = false; // Disable loading indicator on error
      }
    );
  });
}

formatDateOfBirth(dob: string): string {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}






    calculateAge(dob: string): number {
      const birthDate = new Date(dob);
      const diff = Date.now() - birthDate.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    eventsget(): any[] | void {
      // if (!this.InfosicID) {
      //   // If InfosicID is null, handle it accordingly (e.g., call some function or just return)
      //   console.log('InfosicID is null or undefined.');
      //   return this.fetchEvents();
      // }

      this.isLoading = true; // Set isLoading to true before making the request

      const eventsdataget = {
        infoseekid: this.InfosicID,
      };
      console.log('studentvarible', eventsdataget);

       this.apollo.use('superAdminevents').watchQuery({
        query: events,
        variables: eventsdataget
      }).valueChanges.subscribe(({ data }: any) => {
        this.studentifoevents = data.readContact;
        console.log('events', this.studentifoevents);
        this.noEvents = this.studentifoevents.length === 0;

        this.isLoading = false; // Disable loading indicator after data is received
      });

      return; // Ensure the function returns something in this code path as well
    }

    fetchEvents(): any[] {
      // Your fetchEvents function logic
      return [
        { description: 'Event 1', Scheduled_Status: 'Not Scheduled' },
      ];
    }



  studentschooltab() {
    if (!this.InfosicID|| this.studentId) {
      this.isLoading = true;
      return;
    }
    this.isLoading = true;
    const studenttab = {
      infoseekid: this.InfosicID|| this.studentId
    };
    console.log('studentdatawithinfpseekid', studenttab);

     this.apollo.use('superAdminevents').watchQuery({
      query: studentschool,
      variables: studenttab
    }).valueChanges.subscribe(({ data }: any) => {
      this.studenschooltab = data.infoseekDetails;
      this.enterpriseDetails = data.infoseekDetails[0].InfoseekVerificationdata;
      console.log('studenschooltab', this.studenschooltab, this.enterpriseDetails);
      this.isLoading = false;
    });
  }

  // Demographics() {
  //   if (this.InfosicID|| this.studentId) {
  //     this.isLoading = true; // Set isLoading to true before making the request
  //     const demotab = {
  //       infoseekid: this.InfosicID|| this.studentId
  //     };
  //     console.log('studentvarible', demotab);
  //      this.apollo.use('superAdminevents').watchQuery({
  //       query: Demographics,
  //       variables: demotab
  //     }).valueChanges.subscribe(({ data }: any) => {
  //       this.DemographicsTab = data.infoseekDetails;
  //       console.log('DemographicsTab', this.DemographicsTab);
  //       this.isLoading = false; // Disable loading indicator after data is received
  //     });
  //   } else {
  //     this.getDemographicsInfo();
  //     this.isLoading = false; // Disable loading indicator if InfosicID is not available
  //   }
  // }


  goBack() {
    this.location.back();
    // this.router.navigate(['/StudnetMasterLIst'])
  }



  studentphotos() {


    this.adminService.studentidcard(this.uin).subscribe((data:any)=>{
      if(data['Status'] === 200){
        console.log(data,'studenqr')
        this.qrcode=data.Result[0].qrcode_image
        this.studentphoto=data.Result[0].upload_photo
        this.infoseekId=data.Result[0].InfoseekId
        console.log(this.qrcode,'qrcode');
        console.log(this.studentphoto,'studentphoto');
      }
    });


  }

  // graphql for idgetting



  getStudentInfo(): Promise<number> {
    this.isLoading = true;

    const getStudentInfo = {
      id: this.schoolid|| this.studentId,
    };

    return new Promise((resolve, reject) => {
       this.apollo.use('superAdminevents').watchQuery({
        query: studentInfoWithId,
        variables: getStudentInfo,
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe(
        ({ data }: any) => {
          const studentInfo = data.InfoseekMasterById;

          // Ensure studentInfo is an array
          const studentInfosArray = Array.isArray(studentInfo) ? studentInfo : [studentInfo];

          // Calculate age and formatted date of birth for each student info
          const updatedStudentInfos = studentInfosArray.map(info => {
            const age = this.calculateAge(info.Date_of_Birth);
            const formattedDOB = this.formatDateOfBirthid(info.Date_of_Birth);
            return { ...info, age, formattedDOB };
          });

          this.getStudentInfos = updatedStudentInfos;

          console.log('getStudentInfos', this.getStudentInfos);
          this.spinnerLoading = false;
          resolve(updatedStudentInfos[0].age);
        },
        error => {
          console.error('Error fetching student info', error);
          this.spinnerLoading = false;
          reject(error);
        }
      );
    });
  }

  formatDateOfBirthid(dob: string | Date): string {
    const date = new Date(dob);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  getSchoolInfo() {
    this.isLoading = true;

    const getSchoolInfo = {
      id: this.schoolid|| this.studentId
    };
    console.log('getSchoolInfo', getSchoolInfo);

     this.apollo.use('superAdminevents').watchQuery({
      query: schoolInfoWithId,
      variables: getSchoolInfo
    }).valueChanges.subscribe(({ data }: any) => {
      this.getSchoolInfotab = data.InfoseekMasterById;
      this.getSchoolInfoz = data.InfoseekMasterById[0].EnterpriseDataDetails;
      console.log('getSchoolInfotab getSchoolInfoz', this.getSchoolInfotab, this.getSchoolInfoz);
      this.isLoading = false;
    });
  }

  getDemographicsInfo() {
    // Use `schoolid` or `InfosicID`, or log an error if neither is provided
    const id = this.schoolid || this.InfosicID;
  
    if (id === undefined || id === null) {
      console.error('Error: No valid ID provided for the query.');
      return; // Exit the function if no ID is provided
    }
    const getDemographicsInfo = { id: Number(id) };

    console.log('getDemographicsInfo', getDemographicsInfo);

     this.apollo.use('superAdminevents').watchQuery({
      query: demographicsInfoWithId,
      variables: getDemographicsInfo
    }).valueChanges.subscribe(({ data }: any) => {
      this.getDemographicsInfos = data.InfoseekMasterById;
      console.log('getDemographicsInfos', this.getDemographicsInfos);
      this.isLoading = false;
    });
  }

  getEarliestEvent(): any {
    if (this.studentifoevents.length > 0) {
      let earliestEvent = this.studentifoevents[0];
      for (let i = 1; i < this.studentifoevents.length; i++) {
        if (new Date(this.studentifoevents[i].StartDate) < new Date(earliestEvent.StartDate)) {
          earliestEvent = this.studentifoevents[i];
        }
      }
      return earliestEvent;
    }
    return null;
  }




}
