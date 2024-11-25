import { Component,EventEmitter,Output,TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { IvinService } from 'src/app/ivin.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-organizerpublish',
  templateUrl: './organizerpublish.component.html',
  styleUrls: ['./organizerpublish.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ transform: 'translateX(100%)' }),
        animate('3s ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})

export class OrganizerpublishComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  publishform:FormGroup;
  eventupdateid: any;
  eventdetailsitems: any;
  eventCategoriesids: any;
  eventCategories: any;
  eventtitle: any;
  description: any;
  category: any;
  categoryName: any;
  createdon: any;
  createdOnTime: any;
  startdate: any;
  enddate: any;
  eventdetaisid: any;
  dialogRef!: MatDialogRef<any>;
  showSuccessMessage: boolean = false;
  eventsupdateid: any;
  myloginId: any;
  multipleImages: any;
  id: any;
  multipleImagesArr: any[] = [];
  eventdisplayname: any;
  eventtitleservice: any;
  eventivnservice: any;
  url: any;
  tooltipMessage: string = 'Copy';
  urlid: any;
  starttime: any;
  endtime: any;
  address: any;
  virtuallink: any;
  organizerinfodata: any;
  instructions: any;
  eventhost: any;
  eventFloorPlanImages: any;
  guestimages: any;
  speakerimages: any;
  organizerimages: any;
  sponsorimages: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  currentIndex: number = 0;
  onebyonedate: any;
  timesid: any;
  eventdetaisidd: any;
  eventdetaisidtime: any;
  eventdetaisidtimeurl: any;
  times: any[] = [];
  contacts: any;
  tags: any;
  tagsArray: any;
  tagIconMapping: { [key: string]: string } = {};
  rowid: any;
  eventdetailsID: any;
  eventdetaisurlid: any;

  constructor(private dialog: MatDialog, private fb:FormBuilder, private router:Router, private ivinservice:IvinService,private snackbar:MatSnackBar) {
    this.publishform = this.fb.group({
      fullname:['',Validators.required],
      emailid:['',Validators.required],
      mobilenumber:['',Validators.required],
      description:['',Validators.required],
      consent: [false, Validators.requiredTrue],
    })
  }

  publishEvent() {
    this.moveToTab.emit(3);
  }

  exitAndSave() {
    this.moveToTab.emit(3);
  }

  closeTab() {
    window.close();
  }


  // ngOnInit(){
  //   this.url = sessionStorage.getItem('url');
  //   this.urlid = this.url.match(/publishevent\/(\d+)/)[1];
  //   console.log("urlid???????",this.urlid);
  //   console.log("url publish",this.url);
  //   this.geteventdetails();
  //   this.getcategory();
  //   this.getmultiimageforpublish();
  //   setInterval(() => {
  //     this.triggerSlideAnimation();
  //   }, 3000);
  // }

  ngOnInit() {
    // Initialize onebyonedate to the current date
    this.onebyonedate = new Date();

    this.url = sessionStorage.getItem('url');
    if (this.url) {
      const matchResult = this.url.match(/organizerevent\/(\d+)/);
      if (matchResult && matchResult.length > 1) {
        this.urlid = matchResult[1];
        // console.log("urlid???????", this.urlid);
      }
    }
    console.log("url publish",this.url);
    this.geteventdetails();
    this.getallschedule();
    this.getcategory();
    this.getmultiimageforpublish();
    this.timesgetbydates();
    this.organizerinfoget();
    setInterval(() => {
      this.triggerSlideAnimation();
      // // Log the default start date
      // this.onebyonedate = this.startDate
      // console.log("Selected date:", this.onebyonedate);
    }, 3000);
  }
  


  publish(templateRef:TemplateRef<any>){
    this.dialogRef = this.dialog.open(templateRef);
  }

  publishpopclose(){
    setTimeout(()=>{
      this.dialogRef.close();
    },2000)

  }

  startdatess(){
  // Log the default start date
  this.onebyonedate = this.startDate
  console.log("Selected date:", this.onebyonedate);
  }


  shiftDateBackward() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.onebyonedate = ''
      this.onebyonedate = this.getDateRangeWithWeekdays(this.startDate, this.endDate)[this.currentIndex].date;
      console.log("Selected date:", this.onebyonedate);
      this.timesgetbydates();
    }
 
  }
  
  shiftDateForward() {
    if (this.currentIndex < this.getDateRangeWithWeekdays(this.startDate, this.endDate).length - 1) {
      this.currentIndex++;
      this.onebyonedate = ''
      this.onebyonedate = this.getDateRangeWithWeekdays(this.startDate, this.endDate)[this.currentIndex].date
      console.log("Selected date:", this.onebyonedate);
      this.timesgetbydates();
    }
  }

  getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;

  }

  getDateRangeWithWeekdays(startDate: Date, endDate: Date): { date: Date, weekday: Date }[] {
    const datesWithWeekdays = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      datesWithWeekdays.push({ date: new Date(currentDate), weekday: new Date(currentDate) });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesWithWeekdays;
  }


  // This is the get for event category
  getcategory() {
    this.ivinservice.getallcategory().subscribe((data: any) => {
      if (data['Status'] === 200) {
        // console.log("category///", data);
        const categoryMap: { [key: number]: string } = {}; // Specify type for categoryMap
  
        data.Result.forEach((item: { id: number; EventCategory: string }) => { // Specify types for item
          categoryMap[item.id] = item.EventCategory;
        });
  
        this.categoryName = categoryMap[this.category]; // Use this.category instead of this.categoryId
        // console.log("Event category Name", this.categoryName);
      }
      this.geteventdetails();
    });
  }
  


  // This is for event details Get 
geteventdetails(){
  // if (this.eventdetaisid) {
  //   // this.eventdetaisid = sessionStorage.getItem('rowid');
  //   this.eventdetaisid = this.urlid;
  //   console.log("eventdetails by urlid",this.eventdetaisid);
  // } else {
  //   this.eventdetaisid = localStorage.getItem('eventdetailsid');
  //   console.log("eventdetails by localstorage",this.eventdetaisid);
  // }

   // if (this.eventdetaisid) {
  //   // this.eventdetaisid = sessionStorage.getItem('rowid');
  this.eventdetaisurlid = this.urlid;
  //   console.log("organizer Info by urlid",this.eventdetaisid);
  // } else {
    this.eventdetaisid = localStorage.getItem('eventdetailsid');
  //   console.log("Organizer Info by localstorage", this.eventdetaisid);
  // }

  const eventDetailsId = this.eventdetaisurlid ? this.eventdetaisurlid : this.eventdetaisid;
  console.log("event details id for eventdetails:", eventDetailsId);

  this.ivinservice.Geteventdetails(eventDetailsId).subscribe((data:any)=>{
    if(data['Status']===200){
      this.eventdetailsitems = data.Result;
      console.log('Eventdetails',this.eventdetailsitems);
      this.eventdisplayname = this.eventdetailsitems[0].Event_Display_Name
      // Extracting Event_Title
      this.eventtitle = this.eventdetailsitems[0].Event_Title;
      // console.log("Event Title:", this.eventtitle);


      this.description = this.eventdetailsitems[0].Event_Description;
      // console.log('Event description',this.description);
      this.category = this.eventdetailsitems[0].Event_Category;
      // console.log("Event category",this.category);
      this.startdate = this.eventdetailsitems[0].Event_start_Date;
      console.log('.fmnijgdshgijsh', this.startdate);
      this.enddate = this.eventdetailsitems[0].Event_End_Date;
      console.log('.fmnijgdshgijsh', this.enddate);
      this.address = this.eventdetailsitems[0].Address;

      this.contacts = this.eventdetailsitems[0].Event_Contacts;

      this.virtuallink = this.eventdetailsitems[0].Virtual_OR_Steaming_Link;

      this.getcategory();
      this.getallschedule();
      // this.organizerinfoget();

      // Assigning start and end dates after fetching them from the API response
      this.startDate = new Date(this.eventdetailsitems[0].Event_start_Date);
      console.log("^^^^^^^^^^^",this.startDate);
      this.endDate = new Date(this.eventdetailsitems[0].Event_End_Date);
      console.log("^^^^^^^^^^^!!!!!!!!!!",this.endDate);

      this.startdatess();
      this.timesgetbydates();
    }
  }
)}


joinus(){
  const consentControl = this.publishform.get('consent');
  if (!consentControl || !consentControl.value) {
    // If consent control is null or checkbox is not checked, display an error message or handle it as per your requirement
    alert("Checkbox is required");
    return; // Exit the function
  }

  const join = {
    Full_Name: this.publishform.get('fullname')?.value,
    Email : this.publishform.get('emailid')?.value,
    MobileNumber : this.publishform.get('mobilenumber')?.value,
    Description : this.publishform.get('description')?.value || null,
    Terms_And_Conditions: this.publishform.get('consent')?.value, 
  }
  console.log("joinus",join);
  this.ivinservice.subscribepost(join).subscribe((data:any)=>{
    if(data['Status']===200){
      this.showSuccessMessage = true;
      console.log("joinpost",data);
      this.snackbar.open('Details Posted Successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      this.publishpopclose();
    }else {
      console.error(data.message);
    }
  },
  (error: any) => {
    console.error(error);

    // Display specific error message to the user in an alert
  const errorMessage = error.error && error.error.Message
  ? error.error.Message
  : 'An error occurred. Please try again.';
  alert(errorMessage);
  }
);
  
}


triggerSlideAnimation() {
  // Stop the animation if multipleImagesArr is empty
 if (this.multipleImagesArr.length === 0) {
   return;
 }
 // Trigger the slide animation by updating the array
 this.multipleImagesArr = [...this.multipleImagesArr.slice(1), this.multipleImagesArr[0]];
}


// This is for Get all Images
getmultiimageforpublish(){
  this.myloginId = localStorage.getItem('loginId');

  // this.rowid = this.ivinservice.eventupdateid
  //   console.log("|||||", this.rowid);
  this.eventdetailsID = this.ivinservice.eventdetid;
    console.log("|||||", this.eventdetailsID);

   // Determine the value to send: eventdetailsID or rowid
   const eventId = this.eventdetailsID ? this.eventdetailsID : this.urlid;

  this.ivinservice.getallmultiimage(this.myloginId,eventId).subscribe((data:any)=>{
    if (data['Status']===200){
      console.log('multiimage Get for publish999999999999',data);

      this.multipleImages = data['Result'];
      this.id = data['id'];
       // Extracting multiImages and their respective IDs
    // const multiImages = data['Result'].map((item: any) => ({
    //   id: item.id,
    //   multipleImages: item.multipleImages
    // }));
    // console.log('Multi Images:', multiImages);
    this.extractMultipleImages(data);
    }
  })
}

// This is for get all image ids
extractMultipleImages(data: any) {
  this.multipleImages = data['Result'];
  this.id = data['id'];

  const newArr: any[] = [];
  for (let each of this.multipleImages) {
    newArr.push({ id: each.id, image: each.multipleImages });
  }
  this.multipleImagesArr = newArr;
  console.log('multiarray', this.multipleImagesArr);
}


copyUrlToClipboard() {
  // Create a temporary input element
  const inputElement = document.createElement('input');
  // Assign the URL to the input element's value
  inputElement.value = this.url;
  // Append the input element to the body
  document.body.appendChild(inputElement);
  // Select the URL text
  inputElement.select();
  // Copy the selected text
  document.execCommand('copy');
  // Remove the temporary input element
  document.body.removeChild(inputElement);

  // Show "Copied" tooltip
  this.tooltipMessage = 'Copied';

}


getallschedule(){
  if (this.eventdetaisidd) {
    // this.eventdetaisid = sessionStorage.getItem('rowid');
    this.eventdetaisidd = this.urlid;
    console.log("timessget",this.eventdetaisidd);
  } else {
    this.eventdetaisidd = localStorage.getItem('eventdetailsid');
    console.log("Timesget", this.eventdetaisidd);
  }

this.ivinservice.schedulegetall(this.startdate,this.eventdetaisidd).subscribe((data:any)=>{
  if(data["Status"]===200 && data.Result && data.Result.length > 0){
    console.log("get all times",data);
    this.starttime = data.Result[0].StartTime;
    // console.log("Start timee",this.starttime);
    this.endtime = data.Result[0].EndTime;
    // console.log("End time",this.endtime);
  }
})
}

organizerinfoget(){
  // if (this.eventdetaisid) {
  //   // this.eventdetaisid = sessionStorage.getItem('rowid');
    this.eventdetaisurlid = this.urlid;
  //   console.log("organizer Info by urlid",this.eventdetaisid);
  // } else {
    this.eventdetaisid = localStorage.getItem('eventdetailsid');
  //   console.log("Organizer Info by localstorage", this.eventdetaisid);
  // }

  const eventDetailsId = this.eventdetaisurlid ? this.eventdetaisurlid : this.eventdetaisid;
  console.log("event details id for organizationifo:", eventDetailsId);


  this.ivinservice.organizerget(eventDetailsId).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log("organizer info $$",data.Result);
      this.organizerinfodata = data.Result

      this.instructions = this.organizerinfodata.Instruction;
      this.eventhost = this.organizerinfodata.EventHost;
      this.eventFloorPlanImages = this.organizerinfodata.eventfloorplan_images;
      this.guestimages = this.organizerinfodata.gusts_images;
      // console.log("**********",this.guestimages);
      this.speakerimages = this.organizerinfodata.eventspeacker_images;
      // console.log("&&&&&&&&",this.speakerimages);
      this.organizerimages = this.organizerinfodata.eventorganizerlogo_images
      // console.log("@@@@@",this.organizerimages);
      this.sponsorimages = this.organizerinfodata.eventsponsorLogo_images;
      // console.log("$$$$",this.sponsorimages);
      // this.tags = this.organizerinfodata.Tags;
      // console.log("$$$$@@@@@@",  this.tags);

      let tagsString = this.organizerinfodata.Tags;
      this.tags = tagsString.split('#');
      // this.tags = tagsString.match(/#[^\s]+/g);
      console.log("$$$$@@@@@@",  this.tags);
    }
  })

}


timesgetbydates(){

  // if (this.eventdetaisidtime) {
  // // this.eventdetaisid = sessionStorage.getItem('rowid');
    this.eventdetaisidtimeurl = this.urlid;
  //   console.log("1111111111",this.eventdetaisidtime);
  // } else {
    this.eventdetaisidtime = localStorage.getItem('eventdetailsid');
  //   console.log(">>>>>>>>>>", this.eventdetaisidtime);
  // }

  // Determine the value to be passed to timesgetbydates()
  const eventDetailsIdToPass = this.eventdetaisidtimeurl ? this.eventdetaisidtimeurl : this.eventdetaisidtime;
  console.log("times get by dates:", eventDetailsIdToPass);

  // Convert date to the desired format: yyyy-mm-dd
  const formattedDate = this.onebyonedate.toISOString().split('T')[0];
  console.log("!!!!!!!!!!!!!!!",formattedDate);

  this.ivinservice.timesgetbydates(formattedDate,eventDetailsIdToPass).subscribe((data:any)=>{
    if(data['Status']===200){
      // Store the received times in the 'times' property
      this.times = data.Result;
      console.log("times%%%%%%%%%%%%%%%%",data);
    }
  })
}




}
