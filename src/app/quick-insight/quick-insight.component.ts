import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { IvinService } from '../ivin.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { state } from '@angular/animations';

@Component({
  selector: 'app-quick-insight',
  templateUrl: './quick-insight.component.html',
  styleUrls: ['./quick-insight.component.scss']
})
export class QuickInsightComponent {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['position','QuickInsights', 'Created', 'Updatedon', 'Audienceincluded', 'Action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() index= 1;
  lastpagedata =10000;
  editid: any;
  copyid: any;
  communicationid: any;
  selectedFileType: string = '';
  errorMessage: string = '';
  quickname: string = 'quickinsights';
  selectedIds: number[] = [];
  selectedidslenght: any;
  userid: any;
  profilepicture: any;
  candidaturepartylogo: any;
  candidaturepartysymbol: any;
  
  constructor(private router: Router, private ivinservice:IvinService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.Get();
    this.profileimages(); 
    this.candidatureimages();
  }

  Get() {
    this.ivinservice.TabledataGet(this.index,this.lastpagedata).subscribe(
      (data:any) => {
        if(data && data.Result) {
          this.dataSource.data = data.Result;
          console.log('dataSource', this.dataSource.data);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  editview(element:any) {
    this.editid = element.id;
    sessionStorage.setItem('quickinsightId', this.editid);
    console.log('quickinsightId',this.editid)
    sessionStorage.removeItem('quickinsightCopyId');
    this.router.navigate(['/quickinsightsearch']);
  }

  Communication(element:any){
    this.router.navigate(['/campaignsearch'], { state: {rowData: element, quickcom: this.quickname} });
  }

  refreshPage() {
    location.reload(); 
  }

  onclick(){
    sessionStorage.removeItem('quickinsightId');
    sessionStorage.removeItem('quickinsightCopyId');
    this.router.navigate(['/quickinsightsearch']);
  }

  // Navigate to another component with id
  CopyEdit(element:any) {
    this.copyid = element.id;
    sessionStorage.setItem('quickinsightCopyId', this.copyid);
    console.log('quickinsightCopyId',this.copyid)
    sessionStorage.removeItem('quickinsightId');
    this.router.navigate(['/quickinsightsearch']);
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

  download(){
    this.ivinservice.EditandviewGet(this.selectedIds).subscribe((data:any)=>{
      if(data["Status"]===200){
        console.log("downloadids",data);
        this.quickinsghitspdf(data.Result);
      }
    })
    
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

  
  quickinsghitspdf(data: any[]) {
    var doc = new jsPDF({
      orientation: 'landscape' // Specify landscape orientation
    });

    var headers = [['S.No', 'Quick Insights', 'Created', 'Updated on', 'Audience included']];
    
    // Prepare the data for the table
    var rows = [];
    for (let i = 0; i < data.length; i++) {
      const innerArray = data[i];
      for (let j = 0; j < innerArray.length; j++) {
        const item = innerArray[j];
        rows.push([i + 1, item.NameOfYourQuickInsights || '', item.CreatedOn || '', item.UpdatedOn || '', item.Count || '', ]);
      }
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
    doc.text('QuickInsight Summary Details', doc.internal.pageSize.getWidth() / 2.2, 20, { align: 'center' });
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
    
    doc.save('QuickInsight Data.pdf');
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

}
