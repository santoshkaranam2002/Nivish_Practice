import { Component,EventEmitter,Output,TemplateRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { IvinService } from 'src/app/ivin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss']
})
export class AssignComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  eventassign: boolean=false;
  assignform : FormGroup
  Assign: boolean=false;
  profileimage: any;
  selectedassignprofile: any;
  Upload_Your_Sign: any;
  fileTypeError: boolean=false;
  digitalSignImageUrl: any;
  errorMessage: any;
  selectedImage: string | ArrayBuffer | null = 'assets/images/svgs/upload-document.svg';
  selectedStations: { [key: string]: boolean } = {};
  filteredStations: string[] = [];
  searchTerm: string = '';
  selectedStationsArray: string[] = []
  pollingstations: any;
  pollingstationsnames: any;
  userid: any;
  Polling_Station_Name_Num: any;
  createAssignDialogRef!: MatDialogRef<any>;
  assignDialogRef!: MatDialogRef<any>;
  firstname: any;
  eventdetailsid: any;

  constructor(private dialog:MatDialog,private fb:FormBuilder,private ivinservice:IvinService,private snackbar:MatSnackBar){
    this.assignform = this.fb.group({
      assign:['',Validators.required],
      data:['withthedata',Validators.required],
      availabledata:['madugula',Validators.required],
    })
  }

  ngOnInit(){
    const UserEmail = localStorage.getItem('userEmail');
    this.PollingDropDown(UserEmail);
    this.firstname = localStorage.getItem('firstname');
  }

  // This is for Filter the stations according the user searched
  filterStations() {
    // console.log('filterStations() called');
    this.filteredStations = this.pollingstationsnames.filter((station: string) =>
      station.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered Stations:', this.filteredStations);
  }

  
// This is for remove the  stations form the array
  removeStation(station: string): void {
    const index = this.selectedStationsArray.indexOf(station);
    if (index !== -1) {
      this.selectedStationsArray.splice(index, 1);
    }
    // Update the selectedStations object
    this.selectedStations[station] = false;

  }

  
  // Method to update the array when checkboxes are selected/deselected
  updateSelectedStationsArray() {
    this.selectedStationsArray = Object.keys(this.selectedStations).filter(
      (station) => this.selectedStations[station]
    );
    console.log('Selected Stations Array:', this.selectedStationsArray);
    console.log('lenth',this.selectedStationsArray.length);
  }


  assign(templateRef: TemplateRef<any>) {
    this.assignDialogRef = this.dialog.open(templateRef);
    this.eventassign = true;
  }

  createassign(templateRef: TemplateRef<any>) {
    this.createAssignDialogRef = this.dialog.open(templateRef);
    this.Assign = true;
  }

  createasssignclose() {
    this.createAssignDialogRef.close();
  }

  assignclose() {
    this.assignDialogRef.close();
    this.moveToTab.emit(3);
  }

  // This is for picture select for assign
  onassignpicture(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > 100 || img.height > 100) {
            // Image size is greater than 100x100 pixels, show error
            this.fileTypeError = true;
            this.errorMessage = 'Image size must be 100x100 pixels or smaller.';
          } else {
            // Image size is valid, proceed with the selected image
            this.selectedassignprofile = file;
            this.Upload_Your_Sign = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = e.target.result;
            this.digitalSignImageUrl = e.target.result;
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = 'assets/images/svgs/upload-document.svg';
      this.digitalSignImageUrl = 'assets/images/svgs/upload-document.svg';
    }
  }
  
  // pollingstation names data get in dropdown
  PollingDropDown(byemail:any){
    this.ivinservice.PollingStationGet(byemail).subscribe((data:any) => {
      if (data && data.Result) {
        this.pollingstations = data.Result;
        console.log('stationssss',this.pollingstations)
        this.pollingstationsnames = data.Result.map((item:any)=>item.Polling_Station_Name_Num);
        console.log('stationnamess',this.pollingstationsnames);
      }
    })
  }

// This is for post for polling stations assign
  pollingstationsassign(){
    this.userid = localStorage.getItem('loginId');
    this.eventdetailsid = localStorage.getItem('eventdetailsid');
    const upd = {
      UserId : this.userid,
      EventId : this.eventdetailsid,
    }
    console.log('userid',upd);
    this.Polling_Station_Name_Num = this.selectedStationsArray;
    console.log("namesassinged", this.Polling_Station_Name_Num)
    this.ivinservice.stationsassign( this.Polling_Station_Name_Num,upd).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('assigned',data);
        this.snackbar.open('Details Updated Successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        })
        this.createasssignclose();
      }
    })
  }




}
