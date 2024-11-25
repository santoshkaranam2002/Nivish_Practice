import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-candidatureinfo',
  templateUrl: './candidatureinfo.component.html',
  styleUrls: ['./candidatureinfo.component.scss']
})
export class CandidatureinfoComponent {
 prtlist:string[]=[];
  myForm: FormGroup;
  partyLogo: any;
  partySymbol: any;
  supportingFiles: any;
  partyManifesto: any;
  fileTypeError: boolean=false;
  selectedImage: any;
  digitalSignImageUrl: any;
  partyLogoImageUrl: any;
  partySymbolImageUrl: any;
  partysupportingFilesImageUrl: any;
  partymanifestoImageUrl: any;
  myloginId: any;
  errorMessage: any;
  errorMessage1: any;
  errorMessage2: any;
  imageerrorMessageforsupportingfiles: any;
  imageerrorMessageforpartymanifesto: any;
  candidateid: any;
  showPopupContentOutside=false;
  Candiatdata: any;
  partynames: any;
  partyNamesArray: string[] = [];
  pidArray: any;
  partyLogoSrc: any;
  videolist:string[]=[];
  url:string='';
  prt:string='';
  canddata: any;
  candid: any;
  task: string = '';
  tasklist: string[] = [];
  achlist:string[]=[];
  ach:string='';
  values: string[] = [];
  partyname: any;
  partyid: any;
  AllPartyNames: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  dialogRef!: MatDialogRef<any>;
  videoForm!: FormGroup;
  uploadedFiles: any = {};
  yourselfid: any;

  constructor(private ivinService:IvinService,private router:Router,private http: HttpClient,private formBuilder: FormBuilder,private dialog: MatDialog,private cdr: ChangeDetectorRef,private _snackBar: MatSnackBar,private fb: FormBuilder){

  this.myForm = this.formBuilder.group({
  
    // Add form controls for each field in the API response
    partyLogo: [''],
    partySymbol: [''],
    supportingFiles: [''],
    partyManifesto: [''],
    politicalaffiliation: [''],
    slogan: [''],
    activists: [''],
    achievements: [''],
    priorities: [''],
    videourls: [''],
    partyname: ['']
    });
  }

 ngOnInit(): void {
  this.videoForm = this.fb.group({
    videourls: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });
    this.PartyNames()
    
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
    })
  }

  // This is for image upload for PARTY LOGO

  partylogo(event: any) {
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
          if (img.width > 300 || img.height > 300) {
            // Image size is greater than 100x100 pixels, show error
            this.fileTypeError = true;
            this.errorMessage = 'Image size must be 300x300 pixels or smaller.';
          } else {
            // Image size is valid, proceed with the selected image
            this.partyLogo = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = e.target.result;
            this.partyLogoImageUrl = e.target.result;
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partyLogoImageUrl = '/assets/images/profilepicture.png';
    }
  }
  // end the image upload for PARTY LOGO

// This is for image upload for PARTY SYMBOL

  partysymbol(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage1 = 'Invalid file type. Please select an image.';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > 300 || img.height > 300) {
            // Image size is greater than 100x100 pixels, show error
            this.fileTypeError = true;
            this.errorMessage1 = 'Image size must be 300x300 pixels or smaller.';
          } else {
            // Image size is valid, proceed with the selected image
            this.partySymbol = file;
            this.fileTypeError = false;
            this.errorMessage1 = ''; // Clear any previous error message
            this.selectedImage = e.target.result;
            this.partySymbolImageUrl = e.target.result;
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage1 = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partySymbolImageUrl = '/assets/images/profilepicture.png';
    }
  }
  
// end the image upload for PARTY SYMBOL

// This is for image upload for Upload Party Supporting Files


  // Code to check where the uploaded is PDF or not
  isPdf(fileUrl: string | null): boolean {
    // If fileUrl is null or empty, it's not a PDF
    if (!fileUrl) return false;

    // Check if the URL or file type indicates a PDF
    return fileUrl.endsWith('.pdf') || fileUrl.includes('pdf');
  }

  getFileName(filePath: string): string {
    if (!filePath) return 'No file uploaded';
    return filePath.split('/').pop()?.split('?')[0] || 'Unknown file';
  }

  supportingfiles(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        // Check if the file type is an image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > 500 || img.height > 500) {
              // Image size is greater than 100x100 pixels, show error
              this.fileTypeError = true;
              this.imageerrorMessageforsupportingfiles = 'Image size must be 500x500 pixels or smaller.';
            } else {
              // Image size is valid, proceed with the selected image
              this.supportingFiles = file;
              this.fileTypeError = false;
              this.imageerrorMessageforsupportingfiles = ''; // Clear any previous error message
              this.selectedImage = e.target.result;
              this.partysupportingFilesImageUrl = e.target.result;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // Check if the file type is a PDF document
        if (file.size > 200 * 1024) {
          // PDF file size is greater than 500KB, show error
          this.fileTypeError = true;
          this.imageerrorMessageforsupportingfiles = 'PDF file size must be 200KB or smaller.';
        } else {
          // PDF file size is valid, proceed with the selected PDF
          this.supportingFiles = file;
          this.fileTypeError = false;
          this.imageerrorMessageforsupportingfiles = ''; // Clear any previous error message
          // You may choose to display a placeholder image for the PDF or not
          this.selectedImage = '/assets/images/pdf-voter.png';
          this.partysupportingFilesImageUrl = '/assets/images/pdf.png';
        }
      } else {
        // Invalid file type, show error
        this.fileTypeError = true;
        this.imageerrorMessageforsupportingfiles = 'Invalid file type. Please select an image or a PDF document.';
      }
    } else {
      // No file selected, show error
      this.fileTypeError = true;
      this.imageerrorMessageforsupportingfiles = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partysupportingFilesImageUrl = '/assets/images/pdf.png';
    }
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        // File URL for preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedFiles[fileType] = { url: e.target.result, type: file.type };
        };
        reader.readAsDataURL(file);
        this.fileTypeError = false;
      } else {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please upload an image or PDF.';
      }
    } else {
      this.uploadedFiles[fileType] = null;
    }
  }
  
  // end the image upload for Upload Party Supporting Files


  // This is for image upload for Party Manifesto

  parrtymanifesto(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        // Check if the file type is an image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > 638 || img.height > 902) {
              // Image size is greater than 100x100 pixels, show error
              this.fileTypeError = true;
              this.imageerrorMessageforpartymanifesto = 'Image size must be 300x300 pixels or smaller.';
            } else {
              // Image size is valid, proceed with the selected image
              this.partyManifesto = file;
              this.fileTypeError = false;
              this.imageerrorMessageforpartymanifesto = ''; // Clear any previous error message
              this.selectedImage = e.target.result;
              this.partymanifestoImageUrl = e.target.result;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
      } else if (file.type === 'application/pdf') {
        // Check if the file type is a PDF document
        if (file.size > 200 * 1024) {
          // PDF file size is greater than 200KB, show error
          this.fileTypeError = true;
          this.imageerrorMessageforpartymanifesto = 'PDF file size must be 200KB or smaller.';
        } else {
          // PDF file size is valid, proceed with the selected PDF
          this.partyManifesto = file;
          this.fileTypeError = false;
          this.imageerrorMessageforpartymanifesto = ''; // Clear any previous error message
          // You may choose to display a placeholder image for the PDF or not
          this.selectedImage = '/assets/images/pdf-icon.png';
          this.partymanifestoImageUrl = '/assets/images/pdf-icon.png';
        }
      } else {
        // Invalid file type, show error
        this.fileTypeError = true;
        this.imageerrorMessageforpartymanifesto = 'Invalid file type. Please select an image or a PDF document.';
      }
    } else {
      // No file selected, show error
      this.fileTypeError = true;
      this.imageerrorMessageforpartymanifesto = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partymanifestoImageUrl = '/assets/images/profilepicture.png';
    }
  }
  
  // end the image upload for Party Manifesto

  // This is for Candidature Inforamtion POST

  onSubmit() {
    this.yourselfid = sessionStorage.getItem('yourselfid');
    if (!this.yourselfid) {
        console.error("No yourselfid found in session storage.");
        alert("Please complete the previous step before submitting.");
        return;
    }
    console.log("yourselfid-candida", this.yourselfid);

    // Continue with form data creation and API submission
    const formData = new FormData();
    formData.append('PortfolioProfileId', this.yourselfid);
    formData.append('PartyLogo', this.partyLogo);
    formData.append('PartySymbol', this.partySymbol);
    formData.append('UploadPartySupportingFiles', this.supportingFiles);
    formData.append('PartyManifesto', this.partyManifesto);
    formData.append('PoliticalAffiliation', this.myForm.get('partyname')?.value);
    formData.append('Slogan', this.myForm.get('slogan')?.value);
    formData.append('Activists', this.myForm.get('activists')?.value);
    formData.append('Achievements', this.myForm.get('achievements')?.value);
    formData.append('Priorities', this.myForm.get('priorities')?.value);
    formData.append('VideoURLs', this.myForm.get('videourls')?.value);

    console.log("details", formData);
    this.ivinService.Candidature(formData).subscribe((data: any) => {
        if (data['Status'] === 200) {
            this._snackBar.open('Posted successfully!', 'Close', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: this.durationInSeconds * 1000,
            });
            this.moveToTab.emit(2);
            this.candidateid = data['Result']['id'];
            console.log('candidate id', this.candidateid);
            sessionStorage.setItem('candid', this.candidateid);
        } else {
            alert(`Error: ${data['Message'] || 'An unknown error occurred.'}`);
        }
    }, (error: any) => {
        console.error('Error occurred:', error);
        const errorMessage = error.error?.Message || 'An unknown error occurred.';
        alert(`Error: ${errorMessage}`);
    });
}


// End the Candidature Information Get

// for Priorities
addprt(prt: string): void {
  this.prtlist.push(prt);
  this.prt = ''; 
}

removeprt(index: number){
  this.prtlist.splice(index,1);
}
// Priorities end

// for Achievements
addach(task:string) {
  this.achlist.push(task);
  this.task = ''; 
}

removeach(index: number): void {
  this.achlist.splice(index, 1);
}

// Achievements end

// for Activists
AddTask(task: string): void {
  console.log(task)
  this.tasklist.push(task);
  console.log(this.tasklist)
  this.task = '';
}

removeact(index: number): void {
  this.tasklist.splice(index, 1);
}
// Activists 

 // videourls
 addurl(url:string):void{
  console.log(url,"urlllllll")
  this.videolist.push(url);
  this.url ='';
}
// this is for removeurl
removeurl(index:number){  
  this.videolist.splice(index,1);
}
// videourls end



}