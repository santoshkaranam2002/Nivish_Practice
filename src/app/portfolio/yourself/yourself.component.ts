import { Component, EventEmitter, Injectable, Output, TemplateRef, ViewChild, HostListener,ElementRef  } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpHeaders,  } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-yourself',
  templateUrl: './yourself.component.html',
  styleUrls: ['./yourself.component.scss']
})
export class YourselfComponent {
  username= localStorage.getItem('username');
  path: any;
  myForm: FormGroup = new FormGroup({});
  activeTab = 'About You';
  imageSizeError=false;
  imageSize:any;
  maxAllowedImages = 5;
  selectedPictures: string[] = [];
  allSelectedImages:any=[];
  myId:any;
  fileError: boolean = false;
  showPopupContentOutside=false;
  emailFormControl = new FormControl('', [Validators.required]);
  nameFromControl = new FormControl('', [Validators.required]);
  profileimage: any;
  aboutprofile: any;
  Upload_Your_Sign: any;
  fileTypeError: boolean=false;
  digitalSignImageUrl: any;
  myloginId: any;
  errorMessage: any;
  aboutdata: any;
  prfpic: any;
  selectedImage: string | ArrayBuffer | null = '/assets/images/svgs/upload-image.svg';
  updId: any;
  aboutid: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  dialogRef!: MatDialogRef<any>;
  isMobile: boolean;
  isDisabled: boolean = true; // Set to true or false based on your requirement
  
  firstName: string = '';

  @ViewChild('fileUpload') fileUpload!: ElementRef;
  postid: any;
  clickedid: any;
  id: any;
  allstates: any;

  constructor(private ivinService:IvinService,private router:Router,private formBuilder: FormBuilder,private http: HttpClient,private dialog: MatDialog,private _snackBar: MatSnackBar, private fb: FormBuilder){
    this.isMobile = window.innerWidth <= 600;
  }

  public profileFormGroup!: FormGroup;

  //Validators
  name: any; email: any; placeOfBirth: any; dob: any; gender: any; phoneNumber: any; address: any; pincode: any; candidateBrief: any;

  ngOnInit() {
    this.getallstatenames();
    this.clickedid = sessionStorage.getItem('clcikedid');
    console.log('@@',this.clickedid);
    this.profileFormGroup = this.fb.group({
      Username: ['', Validators.required],
      Firstname: ['',Validators.required],
      lastname : ['',Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      Country : ['',Validators.required],
      Countrycode : ['',Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      gender: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      age: ['', Validators.required],
      city: ['', Validators.required],
      shortdescription: ['', Validators.required],
      aboutyourself : ['',Validators.required],
    });

    this.username = localStorage.getItem('username') || 'Default Name';
    this.firstName = sessionStorage.getItem('firstname') || 'Default Name';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = window.innerWidth <= 600;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.profileFormGroup.controls[controlName].hasError(errorName);
  }


  getallstatenames(){
    this.ivinService.getallstates().subscribe((data:any)=>{
      if(data['Status']===200){
        this.allstates = data.Result
        console.log("states ##$$",this.allstates);
      }
    })
  }

  profilePicture(event: any) {
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
            this.errorMessage = 'Image size must be 100x100 pixels or smaller.';
          } else {
            // Image size is valid, proceed with the selected image
            this.aboutprofile = file;
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
      this.selectedImage = '/assets/images/profilepicture.png';
      this.digitalSignImageUrl = '/assets/images/profilepicture.png';
    }
  }


  onChangeCoverClick(): void {
    this.fileUpload.nativeElement.click();
  }
 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file.name);
      // Add your file handling logic here
    }
  }

// This is for about post starts here
submit() {
    console.log("submit");
    if (!this.aboutid) {
      this.myloginId = sessionStorage.getItem('loginid');
      const dobValue = this.profileFormGroup.get('dob')?.value;
      if (dobValue) {
        const dobDate = new Date(dobValue);
        const dd = String(dobDate.getDate()).padStart(2, '0');
        const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
        const yyyy = dobDate.getFullYear();
        const formattedDOB = `${yyyy}-${mm}-${dd}`;

        const formData = new FormData();
        formData.append('UserId', this.myloginId);
        // formData.append('UserName',)
        formData.append('ProfilePicture', this.aboutprofile);
        formData.append('ShortName', this.profileFormGroup.get('Username')?.value);
        formData.append('FirstName', this.profileFormGroup.get('Firstname')?.value);
        formData.append('LastName', this.profileFormGroup.get('lastname')?.value);
        formData.append('CountryCode', this.profileFormGroup.get('Countrycode')?.value);
        formData.append('DateOfBirth', formattedDOB);
        formData.append('Age', this.profileFormGroup.get('age')?.value);
        formData.append('Gender', this.profileFormGroup.get('gender')?.value);
        formData.append('Email', this.profileFormGroup.get('email')?.value);
        formData.append('PhoneNumber', this.profileFormGroup.get('phoneNumber')?.value);
        formData.append('Address', this.profileFormGroup.get('address')?.value);
        formData.append('City', this.profileFormGroup.get('city')?.value);
        formData.append('State', this.profileFormGroup.get('state')?.value);
        formData.append('PinCode', this.profileFormGroup.get('pincode')?.value);
        formData.append('Candidate_Brief', this.profileFormGroup.get('aboutyourself')?.value);
        formData.append('Country', this.profileFormGroup.get('Country')?.value);
        formData.append('Description', this.profileFormGroup.get('shortdescription')?.value);
        console.log('post data',formData);
        this.ivinService.portfolioaboutyourself(formData).subscribe((data: any) => {
          if (data['Status'] === 200) {
            this._snackBar.open('Posted successfully!', 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
            });
            this.moveToTab.emit(1);
            this.id = data.Result.id;
            console.log("post id",this.id);
            sessionStorage.setItem('yourselfid',this.id);
            // this.getpersonprofile();
            // this.aboutdetailclose();
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
    } else {
      // this.Updateuserdata();
    } 

}


}

