import { Component, EventEmitter, Injectable, Output, TemplateRef, ViewChild, HostListener, ElementRef  } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpHeaders,  } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarVerticalPosition,MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.scss']
})
export class UsertypeComponent {
  maxDate: Date = new Date();
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
  urlError: string = '';
  firstName: string = '';
  public generatedUrl: string = '';  // Declare a variable to hold the generated URL

  @ViewChild('fileUpload') fileUpload!: ElementRef;
  postid: any;
  Username: any;
  allstates: any;
  firstname: any;
  lastname: any;
  selectedFileName: string = '';
  selectedFileSize: string = '';
  bannerid: any;
  bannerImageUrl: any;
  bannerfile: any;
  shortdescription: any;
  updatedOn: any;

  constructor(private ivinService:IvinService,private router:Router,private formBuilder: FormBuilder,private http: HttpClient,private dialog: MatDialog,private _snackBar: MatSnackBar, private fb: FormBuilder){
    this.isMobile = window.innerWidth <= 600;
  }

  public profileFormGroup!: FormGroup;

  //Validators
  name: any; email: any; placeOfBirth: any; dob: any; gender: any; phoneNumber: any; address: any; pincode: any; candidateBrief: any;

  ngOnInit() {
    this.getallstatenames();
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
    this.getpersonprofile();
    this.username = localStorage.getItem('username') || 'Default Name';
    this.firstName = sessionStorage.getItem('firstname') || 'Default Name';
    this.getbannerimage();
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

      this.selectedFileName = file.name;
      this.selectedFileSize = this.formatFileSize(file.size);
  
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

  removeImage() {
    this.digitalSignImageUrl = '';
    this.selectedImage = '/assets/images/profilepictures.png';
    this.selectedFileName = '';
    this.selectedFileSize = '';
    this.aboutprofile = null;
    this.Upload_Your_Sign = null;
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
        formData.append('UserName', this.profileFormGroup.get('Username')?.value);
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
        this.ivinService.About(formData).subscribe((data: any) => {
          if (data['Status'] === 200) {
            this._snackBar.open('Your profile has been successfully updated.', '✖', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
              panelClass: 'Snackbar-green'
            });
            this.getpersonprofile();
            this.aboutdetailclose();
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
      this.Updateuserdata();
    } 

}

  
  // about post ends here
// This is for popup
  outcorrections(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
    this.showPopupContentOutside = true;
  }


aboutdetailclose() {
  this.dialogRef.close();
}

OnClose() {
  this.showPopupContentOutside = false;
}


// Get functionality starts
getpersonprofile() {
  this.myloginId = sessionStorage.getItem('loginid');
  console.log('iviniidsantosh',this.myloginId)
  this.ivinService.getUserProfile(this.myloginId).subscribe((data: any) => {
    if (data && data.Result) {
      this.aboutdata = data.Result;
      console.log('aboutdata', this.aboutdata)
      this.prfpic = data.Result[0]['ProfilePicture'];
      this.aboutid = data.Result[0]['id']
      console.log(this.aboutid,'dataaaa')
      this.digitalSignImageUrl = data.Result[0]['ProfilePicture'];
      sessionStorage.setItem('aboutpic',this.digitalSignImageUrl);
      this.firstname = data.Result[0]['FirstName'],
      sessionStorage.setItem('aboutfirstname',this.firstname);
      this.lastname = data.Result[0]['LastName'],
      sessionStorage.setItem('aboutlastname',this.lastname);
      this.shortdescription = data.Result[0]['Candidate_Brief'];
      console.log('descriptionpublic',this.shortdescription)
      sessionStorage.setItem('shortdescription',this.shortdescription)
      this.updatedOn = data.Result[0]['UserId']['UpdatedOn'];
      console.log('updatedon',this.updatedOn)
      sessionStorage.setItem('updatedOn',this.updatedOn),
      // Patching the form values with the retrieved data
      this.Username = data.Result[0]['UserName'];
      sessionStorage.setItem('userprofileusername',this.Username);
      this.profileFormGroup.patchValue({
        Username : data.Result[0]['UserName'],
        Firstname: data.Result[0]['FirstName'],
        lastname : data.Result[0]['LastName'],
        dob: new Date(data.Result[0]['DateOfBirth']),
        age: data.Result[0]['Age'],
        gender: data.Result[0]['Gender'],
        email: data.Result[0]['Email'],
        Countrycode: data.Result[0]['CountryCode'],
        phoneNumber: data.Result[0]['PhoneNumber'],
        address: data.Result[0]['Address'],
        city: data.Result[0]['City'],
        state: data.Result[0]['State'],
        pincode: data.Result[0]['PinCode'],
        aboutyourself: data.Result[0]['Candidate_Brief'],
        Country: data.Result[0]['Country'],
        shortdescription : data.Result[0]['Description'],
      });
    }
  });
}

// Update  start here
Updateuserdata() {
  const dobValue = this.profileFormGroup.get('dob')?.value;
  if (dobValue) {
    const dobDate = new Date(dobValue);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
    const yyyy = dobDate.getFullYear();
    const formattedDOB = `${yyyy}-${mm}-${dd}`;
    const updFormData = new FormData();
    // updFormData.append('UserId', this.myloginId);

    // Check if profile picture is defined before appending
    if (this.aboutprofile) {
      updFormData.append('ProfilePicture', this.aboutprofile);
      console.log('ProfilePicture', this.aboutprofile);
    }

    // updFormData.append('ProfilePicture', this.aboutprofile);
    updFormData.append('UserName', this.profileFormGroup.get('Username')?.value);
    updFormData.append('FirstName', this.profileFormGroup.get('Firstname')?.value);
    updFormData.append('LastName', this.profileFormGroup.get('lastname')?.value);
    updFormData.append('CountryCode', this.profileFormGroup.get('Countrycode')?.value);
    updFormData.append('DateOfBirth', formattedDOB);
    updFormData.append('Age', this.profileFormGroup.get('age')?.value);
    updFormData.append('Gender', this.profileFormGroup.get('gender')?.value);
    updFormData.append('Email', this.profileFormGroup.get('email')?.value);
    updFormData.append('PhoneNumber', this.profileFormGroup.get('phoneNumber')?.value);
    updFormData.append('Address', this.profileFormGroup.get('address')?.value);
    updFormData.append('City', this.profileFormGroup.get('city')?.value);
    updFormData.append('State', this.profileFormGroup.get('state')?.value);
    updFormData.append('PinCode', this.profileFormGroup.get('pincode')?.value);
    updFormData.append('Candidate_Brief', this.profileFormGroup.get('aboutyourself')?.value);
    updFormData.append('Country', this.profileFormGroup.get('Country')?.value);
    updFormData.append('Description', this.profileFormGroup.get('shortdescription')?.value);
    console.log('update user data',updFormData);
    this.ivinService.updateUserProfile(this.aboutid, updFormData).subscribe((data: any) => {
      if (data['Status'] === 200) {
        this._snackBar.open('Your profile has been successfully updated.', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000,
          panelClass: 'Snackbar-green'
        });
        console.log(data, "update successs");
        this.getpersonprofile();
        // this.moveToTab.emit(1);
        this.aboutdetailclose();
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

openNewWindow() {
  const lowercaseUsername = this.Username ? this.Username.toLowerCase() : '';
  this.myloginId = localStorage.getItem('currentId');
  
 
  if (lowercaseUsername) {
    const url = `publiccharts/${lowercaseUsername}`;
    console.log('Opening URL:', url);
    const newWindow = window.open(url, '_blank');

    if (newWindow) {

      setTimeout(() => {
        newWindow.location.reload();
      }, 2000);
    }
  }
}



// openNewWindow() {
//   const lowercaseUsername = this.Username ? this.Username.toLowerCase() : '';
//   this.myloginId = localStorage.getItem('currentId');

//   if (lowercaseUsername) {

//     const url = `publiccharts/${lowercaseUsername}`;
//     console.log('Opening URL:', url);

//     const newWindow = window.open(url, '_blank');
//     if (newWindow) {
      
//       setTimeout(() => {
//         newWindow.location.reload();
//       }, 2000);
//     }
//   }
// }





  bannerpicture(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= 1000 && img.height >= 300) {
            // Image size is valid, proceed with the selected image
            this.bannerfile = file;
            this.Upload_Your_Sign = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = e.target.result;
            this.bannerImageUrl = e.target.result;
            this.bannerupload();
          } else {
            // Image size is smaller than 1000x300 pixels, show error
            this.fileTypeError = true;
            this.errorMessage = 'Image Size Must be at least 1000x300 Pixels.';
            alert(this.errorMessage);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.bannerImageUrl = '/assets/images/profilepicture.png';
    }
  }


  bannerupload(){
    if(!this.bannerid){
    // Retrieve the clicked ID from session storage
    this.myloginId = sessionStorage.getItem('loginid');

    const formData = new FormData();
    formData.append('UserId',this.myloginId);
    formData.append('BannerImage',this.bannerfile);

      this.ivinService.userbannerpost(formData).subscribe((data:any)=>{
        if(data['Status']===200){
            this._snackBar.open('Your banner has been successfully changed.', 'X', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
            panelClass: 'Snackbar-green'
          });
          console.log('banner posted',data);
          this.getbannerimage();
        }
      })
    }else{
      this.updatebanner();
    }
  }


  getbannerimage(){
    this.ivinService.userbannerget(this.myloginId).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('banner getted',data);
        this.bannerImageUrl = data.Result[0].BannerImage;
        console.log('bannerr gette',this.bannerImageUrl);
        this.bannerid = data.Result[0].id
      }
    })
  }    

  updatebanner(){
  // Retrieve the clicked ID from session storage
  this.myloginId = sessionStorage.getItem('loginid');

  const updateform = new FormData();
  // if (this.bannerfile) {
  //   updateform.append('BannerImage', this.bannerfile);
  //   console.log('BannerImage', this.bannerfile);
  // }
  updateform.append('UserId',this.myloginId);
  updateform.append('BannerImage',this.bannerfile);
  updateform.append('id',this.bannerid);
  this.ivinService.userbannerupdate(this.bannerid,updateform).subscribe((data:any)=>{
    if(data['Status']===200){
      console.log('banner update',data);
      this._snackBar.open('Your profile banner has been successfully updated!', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000,
        panelClass: 'Snackbar-green'
      });
    }
  })
  }


}