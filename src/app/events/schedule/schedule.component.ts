import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IvinService } from 'src/app/ivin.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { interval } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();

  scheduleform:FormGroup;
  eventschedule: boolean=false;
  addstartTime: boolean = false;
  selectedDate: string = '';
  dates: { day: string, date: string, month: string }[] = [];
  // dates: { day: string, date: string, month: string, startDate: string, endDate: string }[] = [];
  startTimes: FormGroup[] = [];
  startdate: any;
  enddate:  any;
  selectedDates: string[] = [];
  eventid: any;
  smallerDate: any;
  largerDate: any;
  scheduledateid: any;
  dialogRef!: MatDialogRef<any>;
  userid: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['position', 'startdate', 'starttime', 'endtime', 'text','edit'];
  getandupdateId: any;
  getandupdateeventid: any;
  getschedulebyid: any;
  daatess: any;
  starttime: any;
  endtime: any;
  eventstartdate: any;
  eventenddate: any;
  dummyid: any;

constructor(private dialog:MatDialog, private fb:FormBuilder, private ivinservice:IvinService,private snackbar:MatSnackBar ){

  this.scheduleform = this.fb.group({
    date:['',Validators.required],
    eventtime:['',Validators.required],
    endEventTime:['',Validators.required],
    additionalField:['',Validators.required],
  })
  // Add default start time
  this.addStartTime();
}

ngOnInit(){
  this.getallschedule();
  this.localstorage(); // Uncomment this line to get values from local storage
  this.dates = []; // Clear the dates array
  this.updateDates(); 

  // Set up an interval to refresh the dates every 2 seconds
  interval(2000).subscribe(() => {
    this.updateDates();
  });

}


updateDates() {
  this.localstorage();

  if (this.eventstartdate && this.eventenddate) {
    this.dates = []; // Clear the dates array
    this.generateDates(new Date(this.eventstartdate), new Date(this.eventenddate));
    // this.selectDate('', this.daatess);
  } else if (this.startdate && this.enddate) {
    this.dates = []; // Clear the dates array
    this.generateDates(new Date(this.startdate), new Date(this.enddate));
  }
}


OnClose(){
  this.eventschedule = false;
}

// schedule(templateRef:TemplateRef<any>){
//   this.dialog.open(templateRef);
//   this.eventschedule = true;
// }

schedule(templateRef: TemplateRef<any>) {
  this.dialogRef = this.dialog.open(templateRef);
  this.eventschedule = true;
  this.getschedule();
  this.dummyrowid();
}

eventscheduleclose() {
  this.dialogRef.close();
  this.eventschedule = false;
}



addStartTime() {
  const startTimeGroup = this.fb.group({
    eventtime: ['', Validators.required],
  });
  this.startTimes.push(startTimeGroup);
}
 removeStartTime(index: number) {
    this.startTimes.splice(index, 1);
  }

  localstorage(){
    this.startdate=localStorage.getItem('eventstartdate');
    // console.log('ssstartdate',this.startdate);
    this.enddate=localStorage.getItem('eventenddate');
    // console.log('eenddate',this.enddate);
  }

// This is for generating the dates by using the eventdetails dates
  generateDates(startDate: Date, endDate: Date) {
    this.localstorage();
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const day = currentDate.toLocaleString('en-US', { weekday: 'short' });
      const numericDate = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as getMonth() returns a zero-based index
      const year = currentDate.getFullYear().toString();
  
      this.dates.push({ day, date: `${numericDate} ${month} ${year}`, month});
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
// This is for save the selected date
selectDate(day: string, date: string) {
  const selectedDate = date; // Save only the date
  console.log("selectedDate3688",selectedDate);
  const formattedDate = this.formatDate(selectedDate);
  const index = this.selectedDates.indexOf(formattedDate);
  console.log("selecteddate123",formattedDate);
  console.log("formattedd369",index)
  
  if (index === -1) {
    // Date is not selected, add it to the array
    if (this.selectedDates.length < 1) {
      this.selectedDates.push(formattedDate);
    } else {
      // Inform the user that they can only select one date.
      console.log('You can only select one date.');
    }
  } else {
    // Date is already selected, remove it from the array (deselect)
    this.selectedDates.splice(index, 1);
  }

  console.log('selectedDate9999999999:', this.selectedDates);
}

formatDate(date: string): string {
  const [numericDate, month, year] = date.split(' ');
  return `${numericDate}-${month}-${year}`;
}

isSelected(date: string): boolean {
  const formattedDate = this.formatDate(date);
  return this.selectedDates.includes(formattedDate);
  // return this.selectedDates.includes(formattedDate) && formattedDate === this.formatDate(this.getschedulebyid[0].EventDate);
}


// Function to add seconds if needed
addSecondsIfNeeded(time: string | null): string {
  if (time) {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');

    // Add seconds as "00" by default
    return `${hours}:${minutes}:00`;
  }
  return ''; // Handle case when time is null
}


// This is for date post
datepost() {
  this.eventid = localStorage.getItem("eventdetailsid");
  if(!this.getandupdateeventid){

  // const startTime = this.formatTime(this.scheduleform.get('eventtime')?.value);
  // const endTime = this.formatTime(this.scheduleform.get('endEventTime')?.value);

  // Get the values of StartTime and EndTime from the form controls
  const startTime = this.addSecondsIfNeeded(this.scheduleform.get('eventtime')?.value);
  const endTime = this.addSecondsIfNeeded(this.scheduleform.get('endEventTime')?.value);

 // Format selectedDates to the required format ("YYYY-MM-DD")
 const formattedDate = this.selectedDates.map(date => {
  const [day, month, year] = date.split('-');
  return `${year}-${month}-${day}`;
});

const eventDate = formattedDate[0];

  const DatePost = {
    EventId: this.eventid,
    EventDate : eventDate ,
    // StartTime: startTime,
     StartTime: startTime,
    // EndTime : endTime,
    EndTime : endTime,
    Text: this.scheduleform.get('additionalField')?.value || null,
    // FromDate: this.formatDateToString(this.smallerDate),
    // ToDate: this.formatDateToString(this.largerDate),
  };

  console.log('datepost999', DatePost);

  // Return the observable for evendatepost()
  return this.ivinservice.evendatepost(DatePost).subscribe((data: any) => {
      if (data['Status'] === 200) {
        console.log('datepost.data', data);
        this.moveToTab.emit(2);
        this.snackbar.open('Details Posted Successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        })
        this.eventscheduleclose();
        this.getallschedule();
        // localStorage.setItem('scheduledateid', this.scheduledateid);
      } else {
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
    });
  }else{
    this.updschedule();
  }
  // Add a return statement here to return a default value
  return null;
  } 


// formatTime(date: Date | null): string {
//   if (date instanceof Date) {
//     return date.toLocaleTimeString('en-US', { hour12: false });
//   } else {
//     console.error("Invalid date object:", date);
//     return ''; // Or handle the case when date is null or not a Date object
//   }
// }


getallschedule(){
  this.userid = localStorage.getItem('loginId');
  console.log("23456",this.userid);
  this.ivinservice.getscheduleall( this.userid).subscribe((data:any)=>{
    if(data['Status']===200){
      // console.log('getallevents',data);
      this.dataSource.data = data.Result;
      console.log("Get all for schedule datesss",this.dataSource.data)
    }
  })
}

rowid(id:any){
this.getandupdateId = id;
console.log("schedule id for get and update",this.getandupdateId);
}


// This is to empty the Fields after click on the Add or Update Button 
dummyrowid(){
  console.log("dummyid schedule id for get and update",this.dummyid);
  this.getandupdateId = null;
  this.getschedule();
   // Reset the form controls
   this.scheduleform.reset();

   // Clear the selected dates
   this.selectedDates = [];
  }

scheduleeventid(EventId:any){
  this.getandupdateeventid = EventId;
  console.log("schedule eventid for get and update", this.getandupdateeventid);
}

getschedule() {
  let formattedStartTime: any;
  let formattedEndTime: any;
  this.ivinservice.schedulegetbyid(this.getandupdateId).subscribe((data: any) => {
    if (data['Status'] === 200) {
      console.log("schedulegetbyid", data);
      this.getschedulebyid = data.Result;
      console.log("getschedulebyid 9632", this.getschedulebyid);

      // Generate date from the endpoint given
      this.eventstartdate = this.getschedulebyid[0].Event_start_Date;
      console.log('starttime for schedule',this.eventstartdate);
      this.eventenddate = this.getschedulebyid[0].Event_End_Date;
      console.log("endtime for schedule",this.eventenddate);

      

      // Extracting hours and minutes from StartTime and EndTime
      const startTimeArray = this.getschedulebyid[0].StartTime;
      // const startTimeArray = this.getschedulebyid[0].StartTime.split(':');
      // const startTimeDate = new Date();
      // startTimeDate.setHours(startTimeArray[0]);
      // startTimeDate.setMinutes(startTimeArray[1]);
      formattedStartTime = startTimeArray;

      console.log("Formatted Start Time: ", formattedStartTime);

      // Extracting hours and minutes from StartTime and EndTime
      const endTimeArray = this.getschedulebyid[0].EndTime;
      // const endTimeArray = this.getschedulebyid[0].EndTime.split(':');
      // const endTimeDate = new Date();
      // endTimeDate.setHours(endTimeArray[0]);
      // endTimeDate.setMinutes(endTimeArray[1]);
      formattedEndTime = endTimeArray;

      console.log("Formatted End Time: ", formattedEndTime);

       // Parse the date string and format it
       const eventDate = new Date(this.getschedulebyid[0].EventDate);
       const day = eventDate.getDate().toString().padStart(2, '0');
       const month = (eventDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as getMonth() returns a zero-based index
       const year = eventDate.getFullYear();
       this.daatess = `${day}-${month}-${year}`;

      // Add the formatted date to selectedDates
      this.selectedDates = [this.daatess];

       console.log('Formatted Date:', this.daatess);

    }
    
    // Patch values to the form controls
    this.scheduleform.patchValue({
      date: this.daatess || '',
      eventtime: formattedStartTime,
      endEventTime: formattedEndTime,
      additionalField: this.getschedulebyid[0].Text || null,
    });
    
  })

}



updschedule(){
   // Format selectedDates to the required format ("YYYY-MM-DD")
 const formattedDate = this.selectedDates.map(date => {
  const [day, month, year] = date.split('-');
  return `${year}-${month}-${day}`;
});

const eventDate = formattedDate[0];

// const startTime = this.formatTime(this.scheduleform.get('eventtime')?.value);
// const endTime = this.formatTime(this.scheduleform.get('endEventTime')?.value);

  // Get the values of StartTime and EndTime from the form controls
  const startTime = this.addSecondsIfNeeded(this.scheduleform.get('eventtime')?.value);
  const endTime = this.addSecondsIfNeeded(this.scheduleform.get('endEventTime')?.value);

  const update = {
    EventId: this.getandupdateeventid,
    EventDate: eventDate,
    StartTime : startTime,
    EndTime : endTime,
    Text :this.scheduleform.get('additionalField')?.value || null,
  }

  console.log("schedule updated data",update);

  this.ivinservice.scheduleupdate(this.getandupdateId,update).subscribe((data:any)=>{
    if(data['Status']===200){
      console.log("Schedule updated Successfull",data);
      this.moveToTab.emit(2);
      this.eventscheduleclose();
      this.getallschedule();
      this.snackbar.open('Details Updated Successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
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



}
