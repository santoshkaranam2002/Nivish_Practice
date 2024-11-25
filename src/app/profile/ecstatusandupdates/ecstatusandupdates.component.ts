import { Component, Injectable, TemplateRef, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpHeaders,  } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

interface CardData {
  selectedOption: string;
  CandidateECnumber: string;
  selectedECDocuments: string;

}

@Component({
  selector: 'app-ecstatusandupdates',
  templateUrl: './ecstatusandupdates.component.html',
  styleUrls: ['./ecstatusandupdates.component.scss']
})
export class ECStatusandupdatesComponent {

  typecandidate=new FormControl();
  Ecnumber=new FormControl();
  constituencyname = new FormControl();
  candidatestatus = new FormControl();
  candidaterealtion = new FormControl();

  typecandidateupdate=new FormControl();
  Ecnumberupdate=new FormControl();
  candidaterealtionupdate = new FormControl();
  constituencynameupdate = new FormControl();
  candidatestatusupdate = new FormControl();

  fileTypeError: boolean=false;
  errorMessage: any;
  selectedUserProfile: any;
  Upload_Your_Sign: any;
  selectedImage: any;
  digitalSignImageUrl: any;
  selectedECDocument: any;
  selectedECDocumentupdate:any;
  ECloginId: any;
  showPopupContentOutside = false;
  myId:any;
  Ecdata:any;
  myloginId: any;
  ecCardIndex: any;
  ecStatusId: any;
  CandidateECnumber: any;
  selectedOption: any;
  ecDocname: any;
  selectedECDocuments: any;
  cardDataList: CardData[] = [];
  Ecid: any;
  displayName='post';
  loginId: any;
  updatedid: any;
  Ecimageurl: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  deltId: any;
  portfolioid: any;
  dialogRef!: MatDialogRef<any>;
  


  constructor(private ivinService:IvinService,private router:Router,private http: HttpClient,private dialog: MatDialog,private elementRef: ElementRef,private renderer: Renderer2,private _snackBar: MatSnackBar,){
   
  }

  ngOnInit(): void {
    this.getEcData()
    this.myloginId=localStorage.getItem('loginId');
    // this.openNewWindow();
    
  }

  Ecstatuspost() {
    if (!this.updatedid) {
      this.ECloginId = sessionStorage.getItem('clickedid');
  
      const forData = new FormData();
      forData.append('PortfolioProfileId', this.ECloginId);
      forData.append('TypeOfCandidate', this.typecandidate.value);
      forData.append('CandidateECNumber', this.Ecnumber.value);
      forData.append('ECDocuments', this.selectedECDocument);
      forData.append('ConstituencyName', this.constituencyname.value);
      forData.append('CandidateStatus', this.candidatestatus.value);
      forData.append('CandidateRelationName', this.candidaterealtion.value);
  
      console.log('Ecdata', forData);
  
      this.ivinService.Ecstatus(forData).subscribe(
        (data: any) => {
          if (data["Status"] === 200) {
            this._snackBar.open('Record Has Been Saved Successfully', '✖', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000, // Duration in milliseconds
              panelClass: 'Snackbar-green'
            });
            console.log('postdata', data);
            this.typecandidate.reset();
            this.Ecnumber.reset();
            this.constituencyname.reset();
            this.candidatestatus.reset();
            this.candidaterealtion.reset();
            this.digitalSignImageUrl = ''
            this.typecandidateupdate.reset();
            this.Ecnumberupdate.reset();
            this.candidaterealtionupdate.reset();
            this.constituencynameupdate.reset();
            this.candidatestatusupdate.reset();
            this.getEcData();
            this.aboutdetailclose();
          } else {
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
    } else {
      this.UpdateEcdata();
    }
  }
  
  onProfilePictureSelecte(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        // Check if the file type is an image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > 100 || img.height > 100) {
              // Image size is greater than 100x100 pixels, show error
              this.fileTypeError = true;
              this.errorMessage = 'Image size must be 100x100 pixels or smaller.';
              alert(`Selected Image Size is ${img.width}x${img.height} pixels. 
                Please Select an Image With Dimensions 100x100 Pixels or Smaller.`);
            } else {
              // Image size is valid, proceed with the selected image
              this.selectedECDocument = file;
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
      } else if (file.type === 'application/pdf') {
        // Check if the file type is a PDF document
        if (file.size > 20 * 1024) {
          // PDF file size is greater than 20KB, show error
          this.fileTypeError = true;
          this.errorMessage = 'PDF file size must be 20KB or smaller.';
          alert(`Selected File Size is ${file.size} KB. 
            Please Select a File With Dimensions 20 * 1024 Pixels or Smaller.`);
        } else {
          // PDF file size is valid, proceed with the selected PDF
          this.selectedECDocument = file;
          this.Upload_Your_Sign = file;
          this.fileTypeError = false;
          this.errorMessage = ''; // Clear any previous error message
          this.selectedImage = '/assets/images/pdf-icon.png'; // Set to the PDF icon path
          this.digitalSignImageUrl = '/assets/images/pdf-icon.png'; // Set to the PDF icon path
        }
      } else {
        // Invalid file type, show error
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image or a PDF document.';
      }
    } else {
      // No file selected, show error
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.digitalSignImageUrl = '/assets/images/profilepicture.png';
    }
  }
  
  OnCloseOutside(){
    this.showPopupContentOutside = false;
  }
  
  outcorrections(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
    this.showPopupContentOutside = true;
    this.typecandidate.reset();
    this.Ecnumber.reset();
    this.constituencyname.reset();
    this.candidatestatus.reset();
    this.candidaterealtion.reset();
    this.digitalSignImageUrl = ''
    this.typecandidateupdate.reset();
    this.Ecnumberupdate.reset();
    this.candidaterealtionupdate.reset();
    this.constituencynameupdate.reset();
    this.candidatestatusupdate.reset();
  }

  aboutdetailclose() {
    this.dialogRef.close();
  }

  getEcData(){ 
  this.portfolioid = sessionStorage.getItem('clickedid');
  console.log('portfolioid@@@', this.portfolioid);
  this.ivinService.getEcStatus(this.portfolioid).subscribe((data:any)=>{
    if (data && data.Result) {
      this.Ecdata = data.Result;
      this.Ecid = data.Result[0]["id"];
      console.log('Data', data)
      
    }
  })
}


openupdatename(each:any){
this.updatedid=each.id;
this.constituencynameupdate.setValue(each.ConstituencyName)
this.typecandidateupdate.setValue(each.TypeOfCandidate)
this.Ecnumberupdate.setValue(each.CandidateECNumber)
this.candidatestatusupdate.setValue(each.CandidateStatus)
this.candidaterealtionupdate.setValue(each.CandidateRelationName)
this.digitalSignImageUrl=each.ECDocuments;
// if(this.Ecimageurl){
//   const filename=new URL(this.Ecimageurl).pathname.split('/').pop();
//   this.selectedECDocumentupdate=filename
// }
console.log('sdf',each)
console.log('updatedid',this.updatedid)
this.displayName='update'
}

removeCardEc(each:any) {
  console.log('each ec', each);
  this.deltId = each.id;
  this.ivinService.deleteecstatus(this.deltId).subscribe((data:any)=>{
    if(data['Status'] === 200){
      console.log('response delete', data);
      this._snackBar.open('Record Has Been Deleted Successfully', '✖', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
        panelClass: 'Snackbar-green'
      });
      this.typecandidate.reset();
      this.Ecnumber.reset();
      this.constituencyname.reset();
      this.candidatestatus.reset();
      this.candidaterealtion.reset();
      this.digitalSignImageUrl = ''
      this.typecandidateupdate.reset();
      this.Ecnumberupdate.reset();
      this.candidaterealtionupdate.reset();
      this.constituencynameupdate.reset();
      this.candidatestatusupdate.reset();
      this.getEcData();
      window.location.reload();
    }
  })

}

addCard() {
  let ecstatusObj: CardData = {
    selectedOption: this.typecandidate.value,
    CandidateECnumber: this.Ecnumber.value,
    selectedECDocuments: this.selectedECDocument,
  };
  console.log(ecstatusObj,'ecstatusObj')
  this.cardDataList.push(ecstatusObj);
  this.Ecstatuspost();
}

addCardupdate() {
  let ecstatusObj: CardData = {
    selectedOption: this.typecandidateupdate.value,
    CandidateECnumber: this.Ecnumberupdate.value,
    selectedECDocuments: this.selectedECDocumentupdate,
  };
  console.log(ecstatusObj,'ecstatusObj')
  this.cardDataList.push(ecstatusObj);
  this.UpdateEcdata();
}

UpdateEcdata() {
  this.ECloginId = sessionStorage.getItem('clickedid');
  console.log(this.ECloginId, "ECloginId");

  const updforData = new FormData();

  if (this.selectedECDocument) {
    updforData.append('ECDocuments', this.selectedECDocument);
    console.log('ECDocuments', this.selectedECDocument);
  }

  updforData.append('PortfolioProfileId', this.ECloginId);
  console.log(this.ECloginId, "ECloginId");
  updforData.append('TypeOfCandidate', this.typecandidateupdate.value);
  console.log( this.typecandidate.value, " this.typecandidate.value");
  updforData.append('CandidateECNumber', this.Ecnumberupdate.value);
  console.log(this.Ecnumber.value, "this.Ecnumber.value");
  // updforData.append('ECDocuments', this.selectedECDocument);
  // console.log( this.selectedECDocument, " this.selectedECDocument");
  updforData.append('ConstituencyName',this.constituencynameupdate.value);
  console.log(this.constituencyname.value, "this.constituencyname.value");
  updforData.append('CandidateStatus',this.candidatestatusupdate.value);
  console.log(this.candidatestatus.value, "this.candidatestatus.value");
  updforData.append('CandidateRelationName',this.candidaterealtionupdate.value);
  console.log(this.candidaterealtion.value, "this.candidaterealtion.value");


  // Check if ECDocuments is defined before appending
  // if (this.selectedECDocumentupdate) {
  //   updforData.append('ECDocuments', this.selectedECDocumentupdate);
  //   console.log('Ecdata', this.selectedECDocumentupdate);
  // }

  this.ivinService.updateecstatusdata(this.updatedid, updforData).subscribe((data: any) => {
    if (data['Status'] === 200) {
      this._snackBar.open('Record Has Been Updated Successfully', '✖', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
        panelClass: 'Snackbar-green'
      });
      console.log(data, "upd successs");
      this.typecandidate.reset();
      this.Ecnumber.reset();
      this.constituencyname.reset();
      this.candidatestatus.reset();
      this.candidaterealtion.reset();
      this.digitalSignImageUrl = ''
      this.typecandidateupdate.reset();
      this.Ecnumberupdate.reset();
      this.candidaterealtionupdate.reset();
      this.constituencynameupdate.reset();
      this.candidatestatusupdate.reset();
      this.aboutdetailclose()
      this.getEcData();
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