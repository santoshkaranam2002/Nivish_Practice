import { Component, TemplateRef,ViewChild,EventEmitter, Output } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IvinService } from 'src/app/ivin.service';
import { compileNgModule } from '@angular/compiler';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.scss'],
})
export class EventdetailsComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  // eventdetails = false;
  eventDetailsForm: FormGroup;
  eventCategories: string[] = [];
  showEndDate: boolean = false;
  eventCategoriesids: any;
  myloginId: any;
  updId: any;
  eventid: any;
  eventdetailsid: any;
  startdate: any;
  enddate: any;
  dialogRef!: MatDialogRef<any>;
  eventdetailsget: any;
  eventdetailsitems: any;
  eventupdateid: any;
  eventDetails: any;
  eventtitle: any;
  eventdescription: any;
  eventcategory: any;
  eventstartdate: any;
  eventenddate: any;
  eventaddress: any;
  eventlocation: any;
  eventcontact: any;
  eventlink: any;
  categoryName: string = '';
  eventdisplayname: any;
  EventTitle: any;
  selectedCategory:string='';
  id: any;

  constructor(private dialog: MatDialog, private fb: FormBuilder,private ivinservice:IvinService,private router: Router,private snackbar:MatSnackBar) {
    this.eventCategories = [];
    this.eventCategoriesids = [];

    this.eventDetailsForm = this.fb.group({
      // Event details form controls
      eventdisplayname:['',Validators.required],
      eventtitle: ['', Validators.required],
      eventdescription: ['', Validators.required],
      eventcategory: ['', Validators.required],
      eventCategoryId: ['',Validators.required] ,
      eventdate: ['', Validators.required],
      enddate:[''],
      eventcontacts: ['',Validators.required],
      address:['',Validators.required],
      Location: ['',Validators.required],
      virtuallink:['',Validators.required],
    });

    this.eventCategoriesids = [];

    this.getcategory();

     // Listen to category selection changes
     this.eventDetailsForm.get('eventcategory')?.valueChanges.subscribe((category: string) => {
      // Check if the selected category is "pollingday"
      if (category === 'pollingday') {
        // Disable the end date field and hide it
        this.eventDetailsForm.get('enddate')?.disable();
        this.showEndDate = false;
      } else {
        // Enable the end date field and show it
        this.eventDetailsForm.get('enddate')?.enable();
        this.showEndDate = true;
      }
    });
  }

  

  ngOnInit(){
    this.getcategory();
    this.eventid=localStorage.getItem('loginId');
    console.log("eventidloc",this.eventid);
    this.geteventdetails();
    this.eventupdateid = this.ivinservice.eventupdateid;
    console.log('########',this.eventupdateid);
    this.populateEventDetails();

    if (this.eventupdateid) {
      this.geteventdetails();
    }
  }


  populateEventDetails() {
    const eventDetails = this.ivinservice.eventDetails;
    if (eventDetails) {
      this.populateFormWithEventDetails(eventDetails);
    }
  }


  // OnClose() {
  //   this.eventdetails = false;
  // }

  eventdetail(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
    // this.eventdetails = true;
  }

  eventdetailclose() {
    this.dialogRef.close();
  }


  addEndDate() {
    this.showEndDate = true;
  }
  hideAddEndDate() {
    this.showEndDate = false;
  }


// This is for event category selected value id will print
  onCategorySelection(event: any): void {
    // Find the selected category's ID
    const selectedIndex = this.eventCategories.findIndex(category => category === event.value);
    console.log(selectedIndex, "select");
  
    let selectedCategoryId = 1; // Default value is 1
  
    if (selectedIndex !== -1) {
      selectedCategoryId = this.eventCategoriesids[selectedIndex];
      console.log('///////', selectedCategoryId);
    }
  
    // Update the form control for eventCategoryId
    this.eventDetailsForm.patchValue({
      eventCategoryId: selectedCategoryId,
    });
  }


  // This is the get for event category
  getcategory(){
    this.ivinservice.getallcategory().subscribe((data:any)=>{
      if(data['Status']===200){
        console.log("Allcategory",data);
        this.eventCategories = data.Result.map((item:any) => item.EventCategory);
        console.log("categoryvalues",this.eventCategories);
        this.eventCategoriesids = data.Result.map((item:any)=> item.id);
        console.log("eventscategoryids",this.eventCategoriesids);
        this.onCategorySelection(this.eventCategories);
      }
    })
  }


  populateFormWithEventDetails(eventDetails: any) {
    this.ivinservice.getallcategory().subscribe((data: any) => {
      if (data['Status'] === 200) {
        const categoryMap: { [key: number]: string } = {};
  
        // Populate categoryMap with category IDs and names
        data.Result.forEach((item: { id: number; EventCategory: string }) => {
          categoryMap[item.id] = item.EventCategory;
        });
  
        // Retrieve category name using category ID from eventDetails
        const categoryId = eventDetails.Event_Category || '';
        this.categoryName = categoryMap[categoryId];
  
        this.eventDetailsForm.patchValue({
          eventdisplayname:eventDetails.Event_Display_Name || '',
          eventtitle: eventDetails.Event_Title || '',
          eventdescription: eventDetails.Event_Description || '',
          eventcategory: this.categoryName || '', // Use the retrieved category name
          eventdate: eventDetails.Event_start_Date || '',
          enddate: eventDetails.Event_End_Date || '',
          address: eventDetails.Address || '',
          eventcontacts: this.extractValue(eventDetails.Event_Contacts || ''),
          Location: eventDetails.Location || '',
          virtuallink: this.extractValue(eventDetails.Virtual_OR_Steaming_Link || ''),
          // Populate other form fields similarly
        });
      }
    });
  }
  
  
  // Helper function to get category name by ID
  getCategoryNameById(categoryId: any): string {
    const index = this.eventCategoriesids.indexOf(categoryId);
    return index !== -1 ? this.eventCategories[index] : '';
  }


// This is for event details tab Post and update
  submitForm(){
    this.getcategory();

    const resetCategory = () => {
      this.eventDetailsForm.patchValue({
        eventcategory: '',
      });
    };
    if (this.eventDetailsForm.get('eventcategory')?.value === '') {
      // Display a message or handle the case where eventcategory is empty
      alert('Please select an event category');
      return; // Stop form submission
    }
    
    const eventdate = this.eventDetailsForm.get('eventdate')?.value;
    if (eventdate) {
      const eventDateObject = new Date(eventdate);
      const dd = String(eventDateObject.getDate()).padStart(2, '0');
      const mm = String(eventDateObject.getMonth() + 1).padStart(2, '0');
      const yyyy = eventDateObject.getFullYear();
      const eventstartdate = `${yyyy}-${mm}-${dd}`;

      const enddate = this.eventDetailsForm.get('enddate')?.value;
      let eventenddate;
      if (enddate) {
        // If end date is provided, use it
        const endDateObject = new Date(enddate);
        const dd = String(endDateObject.getDate()).padStart(2, '0');
        const mm = String(endDateObject.getMonth() + 1).padStart(2, '0');
        const yyyy = endDateObject.getFullYear();
        eventenddate = `${yyyy}-${mm}-${dd}`;
    } else {
        // If end date is not provided, use start date
        const startdate = this.eventDetailsForm.get('eventdate')?.value;
        const startDateObject = new Date(startdate);
        const dd = String(startDateObject.getDate()).padStart(2, '0');
        const mm = String(startDateObject.getMonth() + 1).padStart(2, '0');
        const yyyy = startDateObject.getFullYear();
        eventenddate = `${yyyy}-${mm}-${dd}`;
    }

        const eventdetails={
          UserId:this.eventid,
          Event_Title:this.eventDetailsForm.get('eventtitle')?.value,
          Event_Display_Name:this.eventDetailsForm.get('eventdisplayname')?.value,
          Event_Description:this.eventDetailsForm.get('eventdescription')?.value,
          Event_Category:this.eventDetailsForm.get('eventCategoryId')?.value,
          Event_start_Date:eventstartdate,
          Event_End_Date:eventenddate,
          Location:this.eventDetailsForm.get('Location')?.value,
          Address:this.eventDetailsForm.get('address')?.value,
          Event_Contacts:this.eventDetailsForm.get('eventcontacts')?.value,
          Virtual_OR_Steaming_Link:this.eventDetailsForm.get('virtuallink')?.value,
          Event_Category_Others:null,
      }

        console.log("details",eventdetails)
        if(!this.eventupdateid){
        this.ivinservice.eventdetailspost(eventdetails).subscribe(
          (data: any) => {
            if (data['Status'] === 200) {
              this.snackbar.open('Details Posted Successfully', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
              console.log(data, "eventdetails//");
              // this.formSubmitted.emit();
              this.moveToTab.emit(1);
              this.eventdetailclose();
              this.eventdetailsid=data.Result.id;
              console.log(this.eventdetailsid,"id");
              this.ivinservice.eventdetid = this.eventdetailsid;
              localStorage.setItem('eventdetailsid',this.eventdetailsid);
              this.startdate = data.Result.Event_start_Date;
              console.log('startdate..',this.startdate);
              localStorage.setItem('eventstartdate',this.startdate);
              this.enddate = data.Result.Event_End_Date;
              console.log('endate..',this.enddate);
              localStorage.setItem('eventenddate',this.enddate);
              this.EventTitle = data.Result.Event_Title;
              localStorage.setItem('eventtitle',this.EventTitle);
              this.selectedCategory = data.Result.Event_Category;
              console.log('category selected by user:',this.selectedCategory) 
              localStorage.setItem('category',this.selectedCategory);
              // Handle success
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
          resetCategory();
          }
        );
      }else{
        // This is event details Update
        // this.eventdetailsget = localStorage.getItem('eventdetailsid')
        this.eventupdateid = this.ivinservice.eventupdateid;
        console.log('Updating event details. Event ID:', this.eventupdateid);
          this.ivinservice.Updateeventdetails(this.eventupdateid,eventdetails).subscribe((data:any)=>{
            if(data['Status']===200){
              this.snackbar.open('Details Updated Successfully', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
              console.log('dataupdated',data);
              this.selectedCategory = data.Result.Event_Category;
              console.log('category selected by user updated:',this.selectedCategory) 
              localStorage.setItem('category',this.selectedCategory);
              this.eventdetailclose();
              this.geteventdetails();
              this.moveToTab.emit(1);
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
          resetCategory();
          }
        );
          }
        }
    }


  //  This is for when we are getting Category name this code will help to show the name instead of category id
  getCategoryValueById(categoryId: number): string {
  const index = this.eventCategoriesids.indexOf(categoryId);
  return index !== -1 ? this.eventCategories[index] : 'N/A';
}


// This is for removing the [], "" for  Virtual_OR_Steaming_Link and contacts
private extractValue(arrayString: string): string {
  if (arrayString) {
    return arrayString.replace(/[\[\]']/g, "").trim();
  }
  return '';
}

  // This is for event details Get 
geteventdetails(){
  this.eventupdateid = this.ivinservice.eventupdateid;
  this.ivinservice.Geteventdetails(this.eventupdateid).subscribe((data:any)=>{
    if(data['Status']===200){
      // this.populateFormWithEventDetails(data.Result);
      this.eventdetailsitems = data.Result;
      console.log('geteventdetailsbyid',this.eventdetailsitems);

      this.eventtitle = this.eventdetailsitems[0].Event_Title;
      console.log('this.eventtitle',this.eventtitle);

      this.ivinservice.titleevent = this.eventtitle;

      this.eventdisplayname = this.eventdetailsitems[0].Event_Display_Name;
      this.eventdescription = this.eventdetailsitems[0].Event_Description;
      this.eventcategory = this.eventdetailsitems[0].Event_Category;
      this.eventstartdate = this.eventdetailsitems[0].Event_start_Date;
      this.eventenddate = this.eventdetailsitems[0].Event_End_Date;
      this.eventcontact = this.extractValue(this.eventdetailsitems[0].Event_Contacts);
      this.eventaddress = this.eventdetailsitems[0].Address;
      this.eventlocation = this.eventdetailsitems[0].Location;
      this.eventlink = this.extractValue(this.eventdetailsitems[0].Virtual_OR_Steaming_Link);


      // Extracting values and removing square brackets
      this.eventdetailsitems.Virtual_OR_Steaming_Link = this.extractValue(data.Result.Virtual_OR_Steaming_Link);
      this.eventdetailsitems.Event_Contacts = this.extractValue(data.Result.Event_Contacts);
      
      // Patch values to the form controls
      this.eventDetailsForm.patchValue({
        eventdisplayname:this.eventdetailsitems[0].Event_Display_Name || '',
        eventtitle: this.eventdetailsitems[0].Event_Title || '',
        eventdescription: this.eventdetailsitems[0].Event_Description || '',
        eventcategory: this.getCategoryValueById(this.eventdetailsitems[0].Event_Category) || '',
        eventdate: this.eventdetailsitems[0].Event_start_Date || null,
        enddate: this.eventdetailsitems[0].Event_End_Date || null,
        eventcontacts: this.extractValue(this.eventdetailsitems[0].Event_Contacts) || '',
        address: this.eventdetailsitems[0].Address || '',
        Location: this.eventdetailsitems[0].Location || '',
        virtuallink: this.extractValue(this.eventdetailsitems[0].Virtual_OR_Steaming_Link) || '',
      });
    } else {
      console.error('Failed to fetch event details:', data);
      // Handle error, such as displaying an error message
    }
  })
}






}