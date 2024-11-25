import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

@Component({
  selector: 'app-eventstable',
  templateUrl: './eventstable.component.html',
  styleUrls: ['./eventstable.component.scss']
})
export class EventstableComponent {

dataSource = new MatTableDataSource<any>();
@Output() createEventClicked: EventEmitter<void> = new EventEmitter<void>();

displayedColumns: string[] = ['position', 'Title', 'Type', 'Created', 'Updated_on','Status','star'];
// dataSource = ELEMENT_DATA;
  userid: any;
  selectedIds: number[] = [];
  selectedidslenght: any;
  selectedFileType: string = '';
  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  eventdetailsitems: any;
  categoryid: any;
  eventCategories: any;
  eventCategoriesids: any;
  profilepicture: any;
  candidaturepartylogo: any;
  candidaturepartysymbol: any;

constructor(private router: Router, private ivinservice:IvinService) { }

ngOnInit(){
  this.getallevents();
  this.getcategory();

  this.profileimages();
  this.candidatureimages();
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}

createevent() {
  this.createEventClicked.emit();
}


getallevents(){
  this.userid = localStorage.getItem('loginId');
  this.ivinservice.eventdetailsgetall(this.userid).subscribe((data:any)=>{
    if(data['Status']===200){
      // console.log('getallevents',data);
      this.dataSource.data = data.Result;
      console.log("////",this.dataSource.data)
    }
  })
}

editAndView(rowId: any) {
  // sessionStorage.setItem('rowid',rowId);
  this.ivinservice.eventupdateid = rowId;
  console.log("Edit and View ID:", rowId);
  this.createevent();
  this.copyandedit(rowId);
}


copyandedit(rowId: any){
  const event = this.dataSource.data.find(e => e.id === rowId); // Assuming id is the property representing the ID
  // Store the additional details in the service
  if (event) {
    // Store the event details in the service
    this.ivinservice.eventDetails = event;
  }
  console.log("Event details:", event);
  this.categoryid = event.Event_Category
  console.log("tableeeeeeeeeeeee",this.categoryid);
  this.ivinservice.eventcategoryid = this.categoryid
  this.createevent();
}


exportSelection() {
  if (!this.selectedFileType) {
    this.errorMessage = 'Please select a file type.';
    setTimeout(() => {
      this.errorMessage = ''; // Clear error message after 2 seconds
    }, 2000); // 2000 milliseconds = 2 seconds
    return; // Return from function if file type is not selected
  }
}

toggleAllCheckboxes(event: any) {
  if (event.checked) {
    // If the "S.No" checkbox is checked, select all checkboxes
    this.dataSource.data.forEach((element: any) => {
      if (!this.selectedIds.includes(element.id)) {
        this.selectedIds.push(element.id);
      }
    });
  } else {
    // If the "S.No" checkbox is unchecked, clear all selected checkboxes
    this.selectedIds = [];
  }
  this.ngOnChanges(); // Update the count of selected checkboxes
}


toggleCheckbox(id: number) {
  if (this.selectedIds.includes(id)) {
    // If the ID is already in the array, remove it
    this.selectedIds = this.selectedIds.filter(item => item !== id);
  } else {
    // If the ID is not in the array, add it
    this.selectedIds.push(id);
  }
  this.ngOnChanges();
}

ngOnChanges() {
  console.log('Selected IDs:', this.selectedIds);
  this.selectedidslenght = this.selectedIds.length;
}


profileimages(){
  this.userid = localStorage.getItem('loginId');
  this.ivinservice.getUserProfile(this.userid).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log("profileimage%%%%",data);
      // Assuming ProfilePicture is a single value
      this.profilepicture = data.Result[0].ProfilePicture;
      console.log("image!!", this.profilepicture);
      
    }
  });
}

candidatureimages(){
  this.userid = localStorage.getItem('loginId');
  this.ivinservice.getCandiatureInfo(this.userid).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log("candidatureimage%%%%",data);
      this.candidaturepartylogo = data.Result[0].PartyLogo;
      console.log("candidaturepartylogo!!", this.candidaturepartylogo);
      this.candidaturepartysymbol = data.Result[0].PartySymbol;
      console.log("candidaturepartysymbol!!", this.candidaturepartysymbol);
    }
  })
}

download(){
  this.ivinservice.pdfdownload(this.selectedIds).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log("downloadids",data);
      this.eventspdf(data.Result);
      // this.eventspdf();
    }
  })
  
}


  // This is the get for event category
  getcategory(){
    this.ivinservice.getallcategory().subscribe((data:any)=>{
      if(data['Status']===200){
        console.log("Allcategorytable@@@",data);
        this.eventCategories = data.Result.map((item:any) => item.EventCategory);
        console.log("categoryvalues",this.eventCategories);
        this.eventCategoriesids = data.Result.map((item:any)=> item.id);
        console.log("eventscategoryids",this.eventCategoriesids);
      }
    })
  }


  eventspdf(data: any[]) {
    var doc = new jsPDF({
      orientation: 'landscape' // Specify landscape orientation
    });

    var headers = [['S.No', 'Event Display Name', 'Event Category', 'Event Start Date', 'Event End Date', 'Event Contacts', 'Event Address', 'Event Location', 'Event Link']];
    
    // Prepare the data for the table
    var rows = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      // Get the category value corresponding to the category ID
      const categoryValue = this.getCategoryValue(item.Event_Category);;
      rows.push([i + 1, item.Event_Display_Name, categoryValue, item.Event_start_Date, item.Event_End_Date, item.Event_Contacts, item.Address, item.Location, item.Virtual_OR_Steaming_Link]);
    }
  
    const imageSize = 30; // Set the size of the square images
  
    // Add the first image
    const imageUrl = this.profilepicture;
    console.log("profilepicture $$",imageUrl);
    doc.addImage(imageUrl, 'PNG', 5, 5, imageSize, imageSize);
  
    // Add the second image
    const candidateimageUrl = this.candidaturepartylogo;
    console.log("candidature party logo$$",candidateimageUrl);
    doc.addImage(candidateimageUrl, 'PNG', 210, 5, imageSize, imageSize);
  
    // Add the third image
    const candidatepartysymbolimageUrl = this.candidaturepartysymbol;
    console.log("candidature party symbol$$",candidatepartysymbolimageUrl);
    doc.addImage(candidatepartysymbolimageUrl, 'PNG', 250, 5, imageSize, imageSize);
  
    // Add the bold text "Events Summary Details"
    doc.setFont('helvetica', 'bold');
    doc.text('Events Summary Details', doc.internal.pageSize.getWidth() / 2.2, 20, { align: 'center' });
    doc.setFont('helvetica', 'normal'); // Reset font style to normal for subsequent text
  
    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 60,
      headStyles: {
        fillColor: [0, 0, 0], // Black color table header 
        textColor: [255, 255, 255], // White color text table header
      },
    });
    
    doc.save('Events Data.pdf');
  }
  // Function to get the category value based on the category ID
  getCategoryValue(categoryId: any): string {
    const index = this.eventCategoriesids.indexOf(categoryId);
    if (index !== -1) {
      return this.eventCategories[index];
    } else {
      return ''; // Return empty string if category ID is not found
    }
  }



}
