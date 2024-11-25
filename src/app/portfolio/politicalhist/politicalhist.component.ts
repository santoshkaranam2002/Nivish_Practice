import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-politicalhist',
  templateUrl: './politicalhist.component.html',
  styleUrls: ['./politicalhist.component.scss']
})
export class PoliticalhistComponent {
  canddatures_id: any;
  partynames: any;
  partyNamesArray: string[] = [];
  pidArray: any;
  politicalloginId: any;
  myForm: FormGroup;
  showPopupContentOutside=false;
  politicaldata: any;
  candidaturesid: any;
  partydata: any;
  politicalid: any;
  partyid: any;
  partyname: any;
  Pid: any;
  historyIndex: any;
  selectedPartyName: any;
  phid: any;
  yourtitle: any;
  todate: any;
  fromdate: any;
  phCandId: any;
  displayName='post';
  deltId: any;
  uddatedid: any;
  partynameupd: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  dialogRef!: MatDialogRef<any>;
  yourselfid: any;

  constructor(private ivinService:IvinService,private formBuilder: FormBuilder,private dialog: MatDialog,private _snackBar: MatSnackBar,){

    this.myForm = this.formBuilder.group({
      // Define your form controls here
      partyname: ['',Validators.required],
      officeheld: ['',Validators.required],
      fromdate: ['',Validators.required],
      todate: ['',Validators.required],

      partynameupdate: ['', Validators.required],
      officeheldupdate: ['', Validators.required],
      fromdateupdate: ['', Validators.required],
      todateupdate: ['', Validators.required],
    });
  
    // Assign the partynameupdate control to the property
    // this.partynameupdate = this.myForm.get('partynameupdate');
  }

  ngOnInit(): void {
    this.politicalloginId=sessionStorage.getItem('loginid');
    console.log("myLoginId",this.politicalloginId);
    this.canddatures_id=sessionStorage.getItem("candid");
    this.PartyNames()
    // this.getpoliticaldata();
  }

cand(){
  this.canddatures_id=localStorage.getItem("candid");
  console.log("..........",this.canddatures_id)
}

PartyNames(){
  this.ivinService.partynames().subscribe ((data:any)=>{
    this.partynames=data.Result;
    console.log("??",this.partynames);
    // Extracting PartyName values into a separate array
    this.partyNamesArray = this.partynames.map((party: any) => party.PartyName);
    console.log("Party Names:", this.partyNamesArray);
    this.pidArray = this.partynames.map((party:any) => party.PID);
    console.log("PID",this.pidArray);
    this.partynameupd
  })
}

// this is for post

  politicalsubmit(){
     // Retrieve the login ID and candidature ID from session storage
     this.yourselfid = sessionStorage.getItem('yourselfid');
     this.canddatures_id = sessionStorage.getItem('candid');
 
     console.log("yourselfid $$ ", this.yourselfid);
     console.log("candidatures_id $$", this.canddatures_id);
    // This is for from date
    const fromValue = this.myForm.get('fromdateupdate')?.value;
    if (fromValue) {
      const dobDate = new Date(fromValue);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
      const yyyy = dobDate.getFullYear();
      const formattedfrom = `${yyyy}-${mm}-${dd}`;
  
       // This is for to date
    const toValue = this.myForm.get('todateupdate')?.value;
    if (toValue) {
      const dobDate = new Date(toValue);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
      const yyyy = dobDate.getFullYear();
      const formattedto = `${yyyy}-${mm}-${dd}`;
  
    // const forData=new FormData();
    // forData.append('CandidatureInformationId', this.canddatures_id);
    // console.log('..',this.canddatures_id);
    // forData.append('UserId', this.politicalloginId);
    // console.log('...',this.politicalloginId);
    // forData.append('PartyName', this.myForm.get('partyname')?.value);
    // console.log('cvbnm,',this.myForm.get('partyname')?.value)
    // forData.append('OfficeHeld', this.myForm.get('officeheld')?.value);
    // forData.append('FromDate',formattedfrom);
    // forData.append('ToDate',formattedto);
    // console.log(',,,,',formattedto);

    const political = {
      CandidatureInformationId : this.canddatures_id,
      PortfolioProfileId : this.yourselfid,
      PartyName: this.myForm.get('partynameupdate')?.value,
      OfficeHeld:this.myForm.get('officeheldupdate')?.value,
      FromDate : formattedfrom,
      ToDate : formattedto
    }
    console.log("political post###",political);
  
    this.ivinService.politicalhistory(political).subscribe((data:any)=>{
      if (data["Status"] === 200) {
        this._snackBar.open('Posted successfully!', 'Close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000, // Duration in milliseconds
        });
        console.log('postdata', data)
        this.moveToTab.emit(3);
        // this.politiacaldetailclose();
        // this.getpoliticaldata()
      }else{
        // Handle known error conditions from the backend
        alert(`Error: ${data['Message'] || 'An unknown error occurred.'}`);
      }
    },
    (error: any) => {
        // Handle unexpected errors from the backend
        console.error('Error occurred:', error);
        const errorMessage = error.error?.Message || 'An unknown error occurred.';
        alert(`Error: ${errorMessage}`);
    }
  );
  }
 }
    
  }

  outcorrections(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
    this.showPopupContentOutside = true;
  }
  
  politiacaldetailclose() {
  this.dialogRef.close();
  }
  
  OnClose() {
  this.showPopupContentOutside = false;
  }

getpoliticaldata() {
  this.candidaturesid = localStorage.getItem("candid");
  console.log('candateidss', this.candidaturesid);
  
  this.ivinService.getPoliticalHistory(this.candidaturesid).subscribe((data: any) => {
    if (data && data.Result && data.Result.length > 0) {
      this.politicaldata = data.Result;
      this.politicalid = data.Result[0]["id"];
      console.log('aaaaa',this.politicalid )
      console.log( this.politicaldata,"pdata");

      // Fetch party inclination data for each political item
      this.politicaldata.forEach((politicalItem: any) => {
        const politicalId = politicalItem.PartyName;
        console.log(politicalId,"pid");
        this.ivinService.partyinclinationgetbyid(politicalId).subscribe(
          (partyInclinationData: any) => {
            if (partyInclinationData && partyInclinationData.Result && partyInclinationData.Result.length > 0) {
              politicalItem.partyname = partyInclinationData.Result[0].PartyName;
             
              console.log(politicalItem.partyname, "pname");

            }
          },
          (error) => {
            console.error('Error fetching party inclination data:', error);
            // Handle error, show a message, or perform other actions as needed.
          }
        );
      });
    }
  });
}

Updatepoliticaldata(){
  this.politicalloginId=localStorage.getItem('loginId');
  console.log("myLoginId",this.politicalloginId);
  const fromValue = this.myForm.get('fromdateupdate')?.value;
    if (fromValue) {
      const dobDate = new Date(fromValue);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
      const yyyy = dobDate.getFullYear();
      const formattedfromupdate = `${yyyy}-${mm}-${dd}`;
  
       // This is for to date
    const toValue = this.myForm.get('todateupdate')?.value;
    if (toValue) {
      const dobDate = new Date(toValue);
      const dd = String(dobDate.getDate()).padStart(2, '0');
      const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
      const yyyy = dobDate.getFullYear();
      const formattedtoupdate = `${yyyy}-${mm}-${dd}`;
      const phistoryObj = {
        PartyName: this.myForm.get('partynameupdate')?.value || null,
        OfficeHeld:this.myForm.get('officeheldupdate')?.value || null,
        FromDate:formattedfromupdate || null,
        ToDate:formattedtoupdate || null
      };
  this.ivinService.updatepoliticaldata(this.uddatedid,phistoryObj).subscribe((data: any) => {
console.log('uddatedid',this.uddatedid)

    if(data['Status']===200){
      this._snackBar.open('Update successfully!', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
      });
      console.log(data,"upd successs");
      this.getpoliticaldata();
      // this.moveToTab.emit(3);
      this.politiacaldetailclose();
    }
  })
}
    }
  
}

openupdatepoliticalname(item: any) {
  console.log('item', item);
  this.uddatedid = item.id;
  this.myForm.patchValue({
    partynameupdate: item.PartyName,
    officeheldupdate:item.OfficeHeld,
    fromdateupdate:item.FromDate,
    todateupdate:item.ToDate,
  });

  console.log('item.PID', item.PartyName);
  console.log('vasu', this.uddatedid);
  this.displayName = 'update';
}

removepol(item:any) {
  this.deltId=item;
  console.log(this.deltId,"deltid");
  this.ivinService.deletepolitical(this.deltId).subscribe((data:any)=>{
    if(data){
      console.log('Backend data', data);
      this.myForm.patchValue({
        partynameupdate: '',
        officeheldupdate: '',
        fromdateupdate: null,
        todateupdate: null
      });
      this.getpoliticaldata();
    }

  })
}

addCard() {
  const fromValue = this.myForm.get('fromdate')?.value;
  if (fromValue) {
    const dobDate = new Date(fromValue);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
    const yyyy = dobDate.getFullYear();
    const formattedfrom = `${yyyy}-${mm}-${dd}`;

     // This is for to date
  const toValue = this.myForm.get('todate')?.value;
  if (toValue) {
    const dobDate = new Date(toValue);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
    const yyyy = dobDate.getFullYear();
    const formattedto = `${yyyy}-${mm}-${dd}`;
  const phistoryObj = {
    PartyName: this.myForm.get('partyname')?.value || null,
    OfficeHeld:this.myForm.get('officeheld')?.value || null,
    FromDate:formattedfrom || null,
    ToDate:formattedto || null 
  };
  console.log(phistoryObj,'syamala');
  this.politicalsubmit();
  this.getpoliticaldata();
}}
}

addCardupdate(){
  this.politicalsubmit();
  this.getpoliticaldata()
  this.Updatepoliticaldata() 
}

}
