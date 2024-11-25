import { Component, OnInit,  ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IvinService } from '../ivin.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

@Component({
  selector: 'app-pollingbooth',
  templateUrl: './pollingbooth.component.html',
  styleUrls: ['./pollingbooth.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PollingBoothComponent implements OnInit {
  activetab = 'PollingBoothDetails';
  columnsToDisplay = ['BoothNoandName', 'BoothIncharge', 'MandalIncharge', 'ClusterIncharge', 'Voted', '+', 'Pending', '=', 'TotalVoters', 'Stats'];
  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any;
  pollingData: any;
  pollingcount: any;
  menuToggled: any;
  sessionId: any;
  selectedToggle: string = 'outside';
  pollingdays: any;
  selectedPollingDay: any;
  checkboxStates: { [key: string]: boolean[] } = {};
  outsideCheckboxState: boolean[] = [];
  insideCheckboxState: boolean[] = [];
  loading: boolean = false;
  selectedCheckboxNumber: number = 0;
  updInside: { inside_voter: { [key: number]: boolean } } = { inside_voter: {} };
  updOutside: { outside_voter: { [key: number]: boolean } } = { outside_voter: {} };
  outsideVoterData: any;
  insideVoterData: any;
  isLoading: boolean = false;
  noOfVoters: number = 0;
  errorMessage: string | null = null;
  noOfVotersisvoted: { IsVotedCount: number } | null = null;
  votersArray: any[] = [];
  voterserial: any;
  checkboxVisibility: boolean[] = [];
  CollectPolling: any;
  joinedPollingStations: any;
  element: any;
  EmailId: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  CollectPollingNames: any;
  CollectPollingNumbers: any;
  StationNumber: any;
  totalsync: any;
  syncspinner:boolean = false;
  pollingstationname: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private ivinservice: IvinService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const UserEmail = localStorage.getItem('userEmail');
    const UEmail = this.cookieService.get('userId');  
    this.EmailId = UserEmail;
    const EmailId = localStorage.getItem('userEmail');
    this.GetPollingStation(EmailId);
  }

  pollingbooth(element:any){
    const pollingStation = element.Polling_Station_Name_Num;
    this.ivinservice.SelectPollingStation = pollingStation;
    this.StationNumber = this.extractLastNumber(pollingStation);
    this.ivinservice.SelectPollingStationNumber = this.StationNumber;
    this.router.navigate(['/pollingday']);
  }

  private extractLastNumber(pollingStationName: string): number {
    const lastNumberMatch = pollingStationName.match(/\d+$/);
    
    if (lastNumberMatch) {
      return parseInt(lastNumberMatch[0], 10);
    } else {
      // console.error('Unable to extract last number from polling station name:', pollingStationName);
      return 0;
    }
  }

  expandclick(element: any): void {
    if (this.expandedElement !== element) {
      this.pollingstationname = element.Polling_Station_Name_Num;
    }
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  GetPollingStation(byemail: any) {
    this.ivinservice.PollingStationGet(byemail).subscribe((data: any) => {
      if (data && data.Result) {
        this.dataSource.data = data.Result;
        // console.log("Backend Data", this.dataSource.data);
      
        this.CollectPollingNames = data.Result.map((item: { Polling_Station_Name_Num: any; }) => item.Polling_Station_Name_Num).join(',');

        this.CollectPollingNumbers = data.Result.map((item: { Polling_Station_Name_Num: any; }) => {
          const [name, number] = item.Polling_Station_Name_Num.split('-');
          return number.trim();
        }).join(',');
      } else {
        // console.error('Data or Result is undefined/null:', data);
      }
    });
  }

  Sync(byemail:any){
    this.syncspinner = true;
    this.ivinservice.Getvotercount(byemail).subscribe((data:any)=>{
      if (data && data.Result){
        this.totalsync = data.Result;
        // console.log('sync...',this.totalsync);
        this.GetPollingStation(byemail);
        this.syncspinner = false;
      }
    })
  }

  SummaryDownload() {
    this.ivinservice.DownloadSummary(this.EmailId).subscribe((data: any) => {
      if (data['Status'] === 200) {
        // console.log('download data', data);
  
        // Generate PDF with data
        this.generatePdfSummary(data.Result);
      }
    });
  }

  generatePdfSummary(data: any[]) {
    var doc = new jsPDF();
    var headers = [['S.No', 'Constituency', 'Mandal', 'Polling Station Number & Name', 'Total', 'YetToVote', 'Inside', 'Outside']];
    
    // Prepare the data for the table
    var rows = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      rows.push([i + 1, item.Constituency, item.Mandal, item.Polling_Station_Name_Num, item.Total_Voters, item.pendingVoters, item.inside_voted, item.outside_voted]);
    }
  
    const imageUrl = 'assets/images/pdfheader.png';
    doc.addImage(imageUrl, 'PNG', 0, 0, 210, 40);
    doc.text('Summary Report', doc.internal.pageSize.getWidth() / 2.1, 53, { align: 'center' });
  
    const footerUrl = 'assets/images/pdffooter.png';
    const footerHeight = 10; // Adjust footer height as needed
  
    // Calculate the footer image width based on A4 dimensions and margins
    const a4Width = 210; // A4 width in mm
    const marginLeft = 5; // Left margin in mm
    const marginRight = 5; // Right margin in mm
    const footerWidth = a4Width - marginLeft - marginRight;
  
    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 60,
      headStyles: {
        fillColor: [0, 0, 0], // Black color table header 
        textColor: [255, 255, 255], // White color text table header
      },
      didDrawPage: function (data: any) {
        // Add footer image at the bottom of each page within the table
        const xOffset = marginLeft; // Adjust X offset as needed
        const yOffset = doc.internal.pageSize.getHeight() - footerHeight -3; // Calculate Y offset for footer image
        doc.addImage(footerUrl, 'PNG', xOffset, yOffset, footerWidth, footerHeight);
      }
    });
    
    doc.save('SummaryReport.pdf');
  }



boothdownload() {
  this.ivinservice.pollingdaydowmload(this.pollingstationname).subscribe((data: any) => {
      if (data['Status'] === 200) {
          // Create a new jsPDF instance
          const doc = new jsPDF();

          // Function to add footer
          const addFooter = function(doc: any) {
              const totalPages = doc.internal.getNumberOfPages();
              for (let i = 1; i <= totalPages; i++) {
                  doc.setPage(i);
                  // Add footer image
                  const footerImageUrl = 'assets/images/pdffooter.png';
                  const footerHeight = 10;
                  const xOffset = 10;
                  const yOffset = doc.internal.pageSize.getHeight() - footerHeight - 5;
                  doc.addImage(footerImageUrl, 'PNG', xOffset, yOffset, 190, footerHeight);
              }
          };

          // Add image to the PDF
          const imageUrl = 'assets/images/pdfheader.png';
          doc.addImage(imageUrl, 'PNG', 0, 0, 210, 40);

          // Add title to the PDF
          doc.text('Voter Data', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

          // Add table for summary data
          (doc as any).autoTable({
              head: [['Polling Station Number and Name', 'Total Voters', 'Marked Voted Outside', 'Marked Voted Inside', 'YetToVote']],
              body: data.Result.map((item: any) => [item.Polling_Station_Name_Num, item.Total_Voters, item.outside_voted, item.inside_voted, item.pendingVoters]),
              startY: 55,
              // Specify styles for the table headers
              headStyles: {
                fillColor: [0, 0, 0] // Black color
            }
          });

          // Add contact details
          doc.text('Contact Details', 10, (doc as any).autoTable.previous.finalY + 10);

          const nameFontSize = 15; // Define the font size for names

          const contactDetailsRows = data.Result.flatMap((item: any) => {
              const rows = [];
              // Push each contact detail as a separate row
              rows.push([
                  { content: `Booth Incharge:`, styles: { fontStyle: 'bold' } }, 
                  item.Booth_Incharge, 
                  item.Booth_Incharge_Number
              ]);
              rows.push([
                  { content: `Mandal Incharge:`, styles: { fontStyle: 'bold' } }, 
                  item.Mandal_Incharge, 
                  item.Mandal_Incharge_Number
              ]);
              rows.push([
                  { content: `Booth Communicator:`, styles: { fontStyle: 'bold' } }, 
                  item.Booth_Communicator, 
                  item.Booth_Communicator_Contact
              ]);
              rows.push([
                  { content: `Follow Up:`, styles: { fontStyle: 'bold' } }, 
                  item.Follow_up_Person, 
                  item.Follow_up_Person_Contact
              ]);
              rows.push([
                  { content: `Cluster Incharge:`, styles: { fontStyle: 'bold' } }, 
                  item.Cluster_Incharge, 
                  item.Cluster_Incharge_Number
              ]);
              rows.push([
                  { content: `Unit Incharge:`, styles: { fontStyle: 'bold' } }, 
                  item.Unit_Incharge, 
                  item.Unit_Incharge_Number
              ]);
              rows.push([
                  { content: `Data Entry:`, styles: { fontStyle: 'bold' } }, 
                  item.Data_Entry, 
                  item.Data_Entry_Contact
              ]);
              rows.push([
                  { content: `Food Incharge:`, styles: { fontStyle: 'bold' } }, 
                  item.Food_Incharge, 
                  item.Food_Incharge_Contact
              ]);
              rows.push([
                  { content: `Mandal Party Secretary:`, styles: { fontStyle: 'bold' } }, 
                  item.Mandal_Party_Secretary, 
                  item.Mandal_Party_Secretary_Contact
              ]);
              rows.push([
                  { content: `Tent Incharge 1:`, styles: { fontStyle: 'bold' } }, 
                  item.Tent_Inchage1, 
                  item.Tent_Incharge1_Contact
              ]);
              rows.push([
                  { content: `Tent Incharge 2:`, styles: { fontStyle: 'bold' } }, 
                  item.Tent_Inchage2, 
                  item.Tent_Incharge2_Contact
              ]);
              rows.push([
                  { content: `Voter Motivation:`, styles: { fontStyle: 'bold' } }, 
                  item.Voter_Motivation, 
                  item.Voter_Motivation_Contact
              ]);
              rows.push([
                  { content: `Transportation Incharge 1:`, styles: { fontStyle: 'bold' } }, 
                  item.Transportation1_Incharge, 
                  item.Transportation_Incharge1_Contact
              ]);
              rows.push([
                  { content: `Transportation Incharge 2:`, styles: { fontStyle: 'bold' } }, 
                  item.Transportation2_Incharge, 
                  item.Transportation_Incharge2_Contact
              ]);
              // Add other contact details similarly
              return rows;
          });

        

          (doc as any).autoTable({
              body: contactDetailsRows,
              startY: (doc as any).autoTable.previous.finalY + 15,
              // Specify styles for the table body
              styles: {
                cellPadding: 2,
                fontSize: 10,
                fontStyle: 'normal', // Setting normal font style for body cells
            },
          });

          // Add yet to vote section
          doc.text('Yet To Vote', 10, (doc as any).autoTable.previous.finalY + 10);
          (doc as any).autoTable({
              head: [['S.No', 'Voter Serial Number', 'Voter Id', 'Full Name', 'Phone Number', 'Party Inclination']],
              body: data.Result.flatMap((item: any, index: any) => item.VoterDetails.map((voter: any, i: any) => [i + 1, voter.VoterSerialNumber, voter.VoterId, voter.Name, voter.ContactNumber, item.PartyInclination])),
              startY: (doc as any).autoTable.previous.finalY + 20,
              // Specify styles for the table headers
              headStyles: {
                fillColor: [0, 0, 0] // Black color
            }
          });

          // Add footer to all pages
          addFooter(doc);

          // Save the PDF
          doc.save('Booth Data.pdf');
      }
  });
}


}