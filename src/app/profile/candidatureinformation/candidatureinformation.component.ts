import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-candidatureinformation',
  templateUrl: './candidatureinformation.component.html',
  styleUrls: ['./candidatureinformation.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})

export class CandidatureinformationComponent  {
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
  clickedid: any;
  firstCandiat: any;
  toPdf: boolean = false;
  progress: number = 0;
  isUploading: boolean = false;
  interval: any;
  partylogoselectedFileName: string = '';
  partylogoselectedFileSize: string = '';
  partysymbolselectedFileName: string = '';
  partysymbolselectedFileSize: string = '';
  progressManifesto: number = 0;
  isUploadingManifesto: boolean = false;
  manifestointerval: any;
  partysupportingFilesName: any;
  partymanifestoFilesName: any;
  partylogoFileName: any;
  partysymbolFileName: any;
  candidatureinformationspinner : boolean = false;

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
  this.clickedid = sessionStorage.getItem('aboutprofileid');
  this.getCandiatureprofile();
  this.videoForm = this.fb.group({
    // videourls: ['', [Validators.required, Validators.pattern('http?://.+')]]
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
      this.getCandiatureprofile();
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
      this.partylogoselectedFileName = file.name;
      this.partylogoselectedFileSize = this.formatFileSize(file.size);
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > 300 || img.height > 300) {
            // Image size is greater than 100x100 pixels, show error
            this.fileTypeError = true;
            this.errorMessage = 'Image size must be 300x300 pixels or smaller.';
            alert(`Selected Image Size is ${img.width}x${img.height} Pixels.
            Please Select an Image With Dimensions 300x300 Pixels or Smaller.`);
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

  formatFileSize(size: number): string {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  removepartylogoImage() {
    this.partyLogoImageUrl = '';
    this.selectedImage = '/assets/images/profilepictures.png';
    this.partylogoselectedFileName = '';
    this.partylogoselectedFileSize = '';
    // this.aboutprofile = null;
    // this.Upload_Your_Sign = null;
  }

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

      this.partysymbolselectedFileName = file.name;
      this.partysymbolselectedFileSize = this.formatFileSize(file.size);
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > 300 || img.height > 300) {
            // Image size is greater than 100x100 pixels, show error
            this.fileTypeError = true;
            this.errorMessage1 = 'Image size must be 300x300 pixels or smaller.';
            alert(`Selected Image Size is ${img.width}x${img.height} Pixels.
            Please Select an Image With Dimensions 300x300 Pixels or Smaller.`);
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

  removepartysymbolImage() {
    this.partySymbolImageUrl = '';
    this.selectedImage = '/assets/images/profilepictures.png';
    this.partysymbolselectedFileName = '';
    this.partysymbolselectedFileSize = '';
    // this.aboutprofile = null;
    // this.Upload_Your_Sign = null;
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
      const fileSizeLimit = 15 * 1024 * 1024; // 15MB file size limit
      const imageSizeLimit = 500; // 500x500 pixels size limit
  
      if (file.size > fileSizeLimit) {
        this.fileTypeError = true;
        this.imageerrorMessageforsupportingfiles = 'File size must be 15MB or smaller.';
        return;
      }

      // Reset progress and show progress bar
      this.progress = 0;
      this.isUploading = true;
      this.simulateProgress(); 
  
      // Handle image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > imageSizeLimit || img.height > imageSizeLimit) {
              this.fileTypeError = true;
              this.imageerrorMessageforsupportingfiles = 'Image size must be 500x500 pixels or smaller.';
              alert(`Selected Image Size is ${img.width}x${img.height} Pixels. Please Select an Image With Dimensions 500x500 Pixels or Smaller.`);
            } else {
              this.supportingFiles = file;
              this.fileTypeError = false;
              this.imageerrorMessageforsupportingfiles = '';
              this.selectedImage = e.target.result;
              this.partysupportingFilesImageUrl = e.target.result;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
  
      // Handle PDFs, accounting for browser-specific file type handling
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        this.supportingFiles = file;
        this.fileTypeError = false;
        this.imageerrorMessageforsupportingfiles = '';
  
        // Show PDF icon
        this.selectedImage = '/assets/images/Pdf-icon.png'; // Ensure the path to the icon is correct
        this.partysupportingFilesImageUrl = '/assets/images/Pdf-icon.png';
  
      // Handle CSV files
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.supportingFiles = file;
        this.fileTypeError = false;
        this.imageerrorMessageforsupportingfiles = '';
  
        // Show CSV icon
        this.selectedImage = '/assets/images/Excel-icon.png';
        this.partysupportingFilesImageUrl = '/assets/images/Excel-icon.png';
  
      // Handle Word (DOC/DOCX) files
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        this.supportingFiles = file;
        this.fileTypeError = false;
        this.imageerrorMessageforsupportingfiles = '';
  
        // Show Word icon
        this.selectedImage = '/assets/images/Word-icon.png';
        this.partysupportingFilesImageUrl = '/assets/images/Word-icon.png';
  
      } else {
        // Invalid file type
        this.fileTypeError = true;
        this.imageerrorMessageforsupportingfiles = 'Invalid file type. Please select an image, PDF, Word document, or CSV file.';
      }
    } else {
      // No file selected
      this.fileTypeError = true;
      this.imageerrorMessageforsupportingfiles = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partysupportingFilesImageUrl = '/assets/images/profilepicture.png';
    }
  }


  simulateProgress() {
    this.interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10; // Increase progress by 10% every interval (you can adjust this)
      } else {
        clearInterval(this.interval); // Clear the interval when progress reaches 100%
        this.isUploading = false; // Hide progress bar after completion
      }
    }, 200); // Set the interval speed (200ms in this case)
  }

  removeFile() {
    this.supportingFiles = null;
    this.partysupportingFilesImageUrl = ''; // Reset the image or file preview
    this.toPdf = false;
    this.fileTypeError = false;
    this.imageerrorMessageforsupportingfiles = ''; // Clear any error messages
    this.partysupportingFilesName = '';
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

  partyManifestoFiles(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      const fileSizeLimit = 15 * 1024 * 1024; // 15MB file size limit
      const imageSizeLimit = 500; // 500x500 pixels size limit

      if (file.size > fileSizeLimit) {
        this.fileTypeError = true;
        this.imageerrorMessageforpartymanifesto = 'File size must be 15MB or smaller.';
        return;
      }

      // Reset progress and show progress bar
      this.progressManifesto = 0;
      this.isUploadingManifesto = true;
      this.simulateManifestoProgress();
  
      // Handle image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > imageSizeLimit || img.height > imageSizeLimit) {
              this.fileTypeError = true;
              this.imageerrorMessageforpartymanifesto = `Image size must be ${imageSizeLimit}x${imageSizeLimit} pixels or smaller.`;
              alert(`Selected Image Size is ${img.width}x${img.height} Pixels. Please select an image with dimensions ${imageSizeLimit}x${imageSizeLimit} pixels or smaller.`);
            } else {
              // Valid image size, proceed
              this.partyManifesto = file;
              this.fileTypeError = false;
              this.imageerrorMessageforpartymanifesto = '';
              this.selectedImage = e.target.result;
              this.partymanifestoImageUrl = e.target.result;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
  
      // Handle PDFs
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        if (file.size > fileSizeLimit) {
          this.fileTypeError = true;
          this.imageerrorMessageforpartymanifesto = 'PDF file size must be 200KB or smaller.';
        } else {
          this.partyManifesto = file;
          this.fileTypeError = false;
          this.imageerrorMessageforpartymanifesto = '';
          this.selectedImage = '/assets/images/pdf-icon.png';
          this.partymanifestoImageUrl = '/assets/images/Pdf-icon.png';
        }
  
      // Handle CSV files
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.partyManifesto = file;
        this.fileTypeError = false;
        this.imageerrorMessageforpartymanifesto = '';
        this.selectedImage = '/assets/images/Excel-icon.png'; // Provide correct path for CSV icon
        this.partymanifestoImageUrl = '/assets/images/Excel-icon.png';
  
      // Handle Word files
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        this.partyManifesto = file;
        this.fileTypeError = false;
        this.imageerrorMessageforpartymanifesto = '';
        this.selectedImage = '/assets/images/Word-icon.png'; // Provide correct path for Word icon
        this.partymanifestoImageUrl = '/assets/images/Word-icon.png';
  
      } else {
        // Invalid file type
        this.fileTypeError = true;
        this.imageerrorMessageforpartymanifesto = 'Invalid file type. Please select an image, PDF, Word document, or CSV file.';
      }
  
      
    } else {
      // No file selected
      this.fileTypeError = true;
      this.imageerrorMessageforpartymanifesto = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.partymanifestoImageUrl = '/assets/images/profilepicture.png';
    }
  }

  simulateManifestoProgress() {
    this.manifestointerval = setInterval(() => {
      if (this.progressManifesto < 100) {
        this.progressManifesto += 10; // Increase progress by 10% every interval
      } else {
        clearInterval(this.manifestointerval); // Clear the interval when progress reaches 100%
        this.isUploadingManifesto = false; // Hide progress bar after completion
      }
    }, 200); // Set interval speed to 200ms
  }
  
  removeManifestoFile() {
    this.partyManifesto = null;
    this.partymanifestoImageUrl = ''; // Reset the image or file preview
    this.fileTypeError = false;
    this.imageerrorMessageforpartymanifesto = ''; // Clear error messages
    this.partymanifestoFilesName = '';
  }
  
  
  // end the image upload for Party Manifesto


  // Helper function to determine the file type and return the appropriate icon URL
getFileIcon(fileUrl: string): string {
  const extension = fileUrl.split('.').pop()?.toLowerCase(); // Get the file extension
  
  switch (extension) {
    case 'pdf':
      return '/assets/images/Pdf-icon.png';
    case 'csv':
      return '/assets/images/Excel-icon.png';
    case 'doc':
    case 'docx':
      return '/assets/images/Word-icon.png';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return fileUrl; // Return the actual image URL for images
    default:
      return '/assets/images/Pdf-icon.png'; // Default icon for other file types
  }
}

  // This is for Candidature Inforamtion POST

  onSubmit() {
    this.candidatureinformationspinner = true;
    this.myloginId=sessionStorage.getItem('clickedid');
    console.log("clickedid_candidate",this.myloginId);
    
    if(!this.candid){
    this.myloginId=sessionStorage.getItem('clickedid');
    console.log("clickedid_candidate",this.myloginId);

    const formData=new FormData();
    formData.append('PortfolioProfileId', this.myloginId);
    formData.append('PartyLogo', this.partyLogo);
    formData.append('PartySymbol', this.partySymbol);
    formData.append('UploadPartySupportingFiles', this.supportingFiles);
    formData.append('PartyManifesto', this.partyManifesto);
    formData.append('PoliticalAffiliation', this.myForm.get('partyname')?.value);
    console.log(this.myForm.get('partyname')?.value, 'ffffff')
    formData.append('Slogan', this.myForm.get('slogan')?.value);
    const activistsString = this.tasklist.join(', ');
    formData.append('Activists', this.myForm.get('activists')?.value);
    formData.append('Achievements', this.myForm.get('achievements')?.value);
    formData.append('Priorities', this.myForm.get('priorities')?.value);
    formData.append('VideoURLs', this.myForm.get('videourls')?.value);

  console.log("details",formData)
  this.ivinService.Candidature(formData).subscribe((data:any)=>{
     if(data['Status']===200){
      this._snackBar.open('Record Has Been Saved Successfully', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
        panelClass: 'Snackbar-green'
      });

      this.candidateid =  data['Result']['id'];
      console.log('pavannnnn', this.candidateid);
      localStorage.setItem('candid',this.candidateid);
      console.log(data,"candidature");
      // this.moveToTab.emit(2);
      this.candidatedetailclose();
      this.getCandiatureprofile();
      this.candidatureinformationspinner = false;
     }
  })
}
else{
  this.UpdateCandiatedata();
}
}
// End the Candidature Information post 

OnCloseOutside(){
  this.showPopupContentOutside = false;
}

outcorrections(templateRef: TemplateRef<any>) {
  this.dialogRef = this.dialog.open(templateRef);
  this.showPopupContentOutside = true;
}


candidatedetailclose() {
this.dialogRef.close();
}

OnClose() {
this.showPopupContentOutside = false;
}

// Helper method to extract filename from the URL
getFileNames(fileUrl: string): string {
  if (!fileUrl) return '';
  
  const urlWithoutParams = fileUrl.split('?')[0]; // Remove the query string part
  return urlWithoutParams.split('/').pop() || ''; // Extract the file name from the URL
}


// Helper method to extract file type from the URL
getFileType(fileUrl: string): string {
  if (!fileUrl) return '';
  
  const urlWithoutParams = fileUrl.split('?')[0]; // Remove the query string part
  const extension = urlWithoutParams.split('.').pop(); // Get the file extension
  return extension ? extension.toLowerCase() : '';
}

// Update the icon based on the file type
updatePartyManifestoIcon(fileUrl: string, isManifesto: boolean) {
  const fileType = this.getFileType(fileUrl);

  // Check if it's for manifesto or supporting files, and update accordingly
  if (isManifesto) {
    switch (fileType) {
      case 'png':
        this.partymanifestoImageUrl = this.partymanifestoImageUrl;
        break;
      case 'pdf':
        this.partymanifestoImageUrl = '/assets/images/Pdf-icon.png';
        break;
      case 'csv':
        this.partymanifestoImageUrl = '/assets/images/Excel-icon.png';
        break;
      case 'doc':
      case 'docx':
        this.partymanifestoImageUrl = '/assets/images/Word-icon.png';
        break;
      default:
        this.partymanifestoImageUrl = '/assets/images/default-icon.png';
        break;
    }
  } else {
    switch (fileType) {
      case 'png':
        this.partysupportingFilesImageUrl = this.partysupportingFilesImageUrl;
        break;
      case 'pdf':
        this.partysupportingFilesImageUrl = '/assets/images/Pdf-icon.png';
        break;
      case 'csv':
        this.partysupportingFilesImageUrl = '/assets/images/Excel-icon.png';
        break;
      case 'doc':
      case 'docx':
        this.partysupportingFilesImageUrl = '/assets/images/Word-icon.png';
        break;
      default:
        this.partysupportingFilesImageUrl = '/assets/images/default-icon.png';
        break;
    }
  }
}


// This is for Candidature Inforamtion Get
getCandiatureprofile() {
  this.clickedid = sessionStorage.getItem('clickedid');
  console.log('clicked@@@', this.clickedid);
  
  this.ivinService.getCandiatureInfo(this.clickedid).subscribe((data: any) => {
   
    if (data && data.Result && data.Result.length > 0) {
      console.log(data.Result,"a &&&&&&&&&&&&");
       this.firstCandiat = data.Result[0]; 
      this.candid = data.Result[0]['id']
      localStorage.setItem("candid",this.candid);
      sessionStorage.setItem('candidateid',this.candid)
      console.log('candata',this.candid)


      this.partyLogoImageUrl = data.Result[0]['PartyLogo'];
      this.partySymbolImageUrl = data.Result[0]['PartySymbol'];
      this.partysupportingFilesImageUrl = data.Result[0]['UploadPartySupportingFiles'];
      this.partymanifestoImageUrl = data.Result[0]['PartyManifesto'];

       // Extract the filename from the supporting files URL
       this.partylogoFileName = this.getFileNames(this.partyLogoImageUrl);
       this.partysymbolFileName = this.getFileNames(this.partySymbolImageUrl);
       this.partysupportingFilesName = this.getFileNames(this.partysupportingFilesImageUrl);
       this.partymanifestoFilesName = this.getFileNames(this.partymanifestoImageUrl);

       // Update icons for both manifesto and supporting files
       this.updatePartyManifestoIcon(this.partysupportingFilesImageUrl, false); // false for supporting files
       this.updatePartyManifestoIcon(this.partymanifestoImageUrl, true); // true for manifesto

      this.partyid = this.firstCandiat.PoliticalAffiliation;
      this.ivinService.partyinclinationgetbyid(this.partyid).subscribe((data: any) => {
        this.partyname = data.Result[0]['PartyName'];
        console.log('partyname', this.partyname);
      
        // Find the matching party based on the PartyName
        const selectedParty = this.partynames.find((party:any) => party.PartyName === this.partyname);
      
        if (selectedParty) {
          this.myForm.patchValue({
            partyLogo: this.firstCandiat.PartyLogo,
            partySymbol: this.firstCandiat.PartySymbol,
            supportingFiles: this.firstCandiat.UploadPartySupportingFiles,
            partyManifesto: this.firstCandiat.PartyManifesto,
            politicalaffiliation: this.firstCandiat.PoliticalAffiliation,
            slogan: this.firstCandiat.Slogan,
            activists: this.firstCandiat.Activists,
            achievements: this.firstCandiat.Achievements,
            priorities: this.firstCandiat.Priorities,
            videourls: this.firstCandiat.VideoURLs,
            partyname: selectedParty.PID,  // Use PID for the dropdown value
          });
      
          this.cdr.detectChanges();  // Ensure change detection is run
        }
      });
      

      this.myForm.patchValue({
        partyLogo: this.firstCandiat.PartyLogo,
        partySymbol: this.firstCandiat.PartySymbol,
        supportingFiles: this.firstCandiat.UploadPartySupportingFiles,
        partyManifesto: this.firstCandiat.PartyManifesto,
        politicalaffiliation: this.firstCandiat.PoliticalAffiliation,
        slogan: this.firstCandiat.Slogan,
        activists: this.firstCandiat.Activists,
        achievements: this.firstCandiat.Achievements,
        priorities: this.firstCandiat.Priorities,
        videourls: this.firstCandiat.VideoURLs,
        partyname: this.partyname,
       
      });
      console.log('firstCandiat.PoliticalAffiliation ',this.firstCandiat.PoliticalAffiliation) 

      // Add this line to set partyLogoSrc
      this.partyLogoSrc = this.firstCandiat.PartyLogo;
      this.Candiatdata = data.Result;
      console.log('Candiatdata', this.Candiatdata);
      console.log('data', data);

    }
    this.cdr.detectChanges();
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

// This is for Candidature Inforamtion Update
UpdateCandiatedata() {
  this.candidatureinformationspinner = true;
  const updFormData = new FormData();
  updFormData.append('PortfolioProfileId', this.clickedid);

  if (this.partyLogo) {
    updFormData.append('PartyLogo', this.partyLogo);
    console.log('PartyLogo', this.partyLogo);
  }

  if (this.partySymbol) {
    updFormData.append('PartySymbol', this.partySymbol);
    console.log('PartySymbol', this.partySymbol);
  }

  if (this.supportingFiles) {
    updFormData.append('UploadPartySupportingFiles', this.supportingFiles);
    console.log('UploadPartySupportingFiles', this.supportingFiles);
  }
  
  if (this.partyManifesto) {
    updFormData.append('PartyManifesto', this.partyManifesto);
    console.log('PartyManifesto', this.partyManifesto);
  }

  updFormData.append('PoliticalAffiliation', this.myForm.get('partyname')?.value);
  console.log(this.myForm.get('partyname')?.value, 'ffffff');
  updFormData.append('Slogan', this.myForm.get('slogan')?.value);
  console.log('Slogan', this.myForm.get('slogan')?.value);

  const activistsString = this.tasklist.join(', ');
if (activistsString.trim() !== '') {
  updFormData.append('Activists', activistsString);
  console.log('Activists', activistsString);
}

const achievementsString = this.achlist.join(', ');
if (achievementsString.trim() !== '') {
  updFormData.append('Achievements', achievementsString);
  console.log('Achievements', achievementsString);
}

const prioritiesString = this.prtlist.join(',');
if (prioritiesString.trim() !== '') {
  updFormData.append('Priorities', prioritiesString);
  console.log('Priorities', prioritiesString);
}

const videourlsString = this.videolist.join(',');
if (videourlsString.trim() !== '') {
  updFormData.append('VideoURLs', videourlsString);
  console.log('VideoURLs', videourlsString);
}

  this.ivinService.updatecanditedata(this.candid, updFormData).subscribe((data: any) => {
    if (data['Status'] === 200) {
      this._snackBar.open('Record Has Been Updated Successfully', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
        panelClass: 'Snackbar-green'
      });
      console.log(data, 'upd successs');
      // this.moveToTab.emit(2);
      this.candidatedetailclose();
      this.getCandiatureprofile();
      this.candidatureinformationspinner = false;
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
// End the Candidature Information Update 

}
