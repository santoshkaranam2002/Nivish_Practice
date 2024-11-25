import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IvinService } from 'src/app/ivin.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  hasImage?: boolean;
  imageUrl?: string;
  userid?: string;
  Password?: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent  {
  @ViewChild(MatStepper) stepper!: MatStepper;
  destroyed = new Subject<void>();
  currentScreenSizes: any;
  mobile: any;
  passwordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('',[Validators.required]);
  hide: any;
  UserTypeOptions: any[] = [];
  existingUserMessage: string = '';
  matcher = new ErrorStateMatcher;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  invalidDetailsMessage: any;
  invalidDetailsMessages:any;
  otpValue: string[] = ['', '', '', ''];
  otpSentMessage:any;
  otpExpired: boolean = false;
  resendButtonDisabled = false;
  countdownSeconds: number = 0;
  countdownInterval: any;
  isVerificationStep = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup:FormGroup;
  fifthFormGroup:FormGroup;
  usertypenames: any;
  usermobile: any;
  userid: any;
  VerifyFormGroup: any;
  phonenumber: any;
  usertypeid: any;
  usertypeidArray: any;
  uidArray: any;
  userdatatype1: any;
  // otpVerified = false;
  isOtpVerified: boolean = false;
  email: string = '';
  showResendError: boolean = false;
  firstname: any;
  lastname: any;
  countrycode: any;
  registeruserid: any;
  regusertype: any;
  regusertypename: any;
  bearertoken: any;
  isOTPSending:any;
  description: any;
  usertype: any;
  authenticationemail: any;
  givenname: any;
  familyname: any;
  firstnamee: any;
  
  constructor(
    private cookieService: CookieService,
    private router:Router, 
    private route:ActivatedRoute, 
    breakpointObserver: BreakpointObserver,
     private ivinservice:IvinService,
     private _formBuilder: FormBuilder,
     private snackbar:MatSnackBar,
     private activatedRoute: ActivatedRoute) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])

    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSizes = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });

    this.firstFormGroup = this._formBuilder.group({
      CountryCode: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.minLength(10)]],
      Email: ['', [Validators.required, Validators.email]]
    });
    this.secondFormGroup = this._formBuilder.group({
      Password: ['', Validators.required],
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      UserType: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      Country: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      PinCode: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      Candidate_Brief: ['', Validators.required],
      Description: ['', Validators.required]
    });
    this.VerifyFormGroup = this._formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.Usertypeid();
    this.usertypeget();
    this.authenticationemail = sessionStorage.getItem('authenticationemail');
    this.givenname = sessionStorage.getItem('authenticationgivenname');
    this.familyname = sessionStorage.getItem('authenticationfamilyname')

    if(this.authenticationemail){
      this.showvertstep();
    }
  }

  showvertstep(){
    console.log('this.authenticationemail',this.authenticationemail)
    this.isVerificationStep = true;
    this.authenticationotpsending();
  }

  authenticationotpsending(){
    const otpsend = {
      CountryCode : null,
      Email :  this.authenticationemail,
      MobileNumber : null
    }
    this.ivinservice.signupotpgeneration(otpsend).subscribe((data)=>{
      if(data['Status']===200)
      console.log('data');
      this.snackbar.open('OTP sent successfully to your email.', 'X', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'Snackbar-green'
      });
    })
  }

  authenticationupdate(){
    const registerdata = {
      MobileNumber:  "9876543210",
      Email: this.authenticationemail,
      CountryCode : "",
      Password: "",
      Firstname: this.givenname,
      Lastname: this.familyname,
      UserType: "7"
    };
    this.ivinservice.Updatesignup(this.userid,registerdata).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log("data updated ###",data);
        this.firstnamee = data.Result.Firstname;
        sessionStorage.setItem('firstname', this.firstnamee);
      }
    })
  }

  authenticationotpverification() {
    if (this.VerifyFormGroup.invalid) {
      this.VerifyFormGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }
    const userdata = this.firstFormGroup.value;
    const countrycode = userdata.CountryCode
    const email = userdata.Email;
    const mobilenumber = userdata.MobileNumber;
  
    const verifydata = this.VerifyFormGroup.value;
    const otp = verifydata.otp1 + verifydata.otp2 + verifydata.otp3 + verifydata.otp4;
  
    const userData = {
      CountryCode : countrycode || null,
      MobileNumber: mobilenumber.toString() || null,
      Email: email || this.authenticationemail,
      Otp: otp
    };
    console.log('otp vertification data send',userData);
    this.ivinservice.signupotpverification(userData).subscribe(
      (response: any) => {
  
        if (response.Status === 200) {
          this.usertypenames = response.Result.Email;
          this.usermobile = response.Result.MobileNumber;
          this.userid = response.Result.id;
          localStorage.setItem("usertypenames", this.userid);
          sessionStorage.setItem("usertype", "7");
          sessionStorage.setItem('description', "News Channel");
          console.log('otp response ',response.Result);
          this.authenticationupdate();
          this.submitForm()
        } else {
          this.isVerificationStep = false;
          alert('OTP verification failed. Please try again.');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error connecting:', error);
        if (error.status === 400) {
          // Display a custom message for incorrect OTP
          alert('Please enter a valid OTP.');
          this.isOtpVerified = false; // Ensure the flag is false on error
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    );
  }

  handleFormSubmit() {
    if (this.authenticationemail) {
      // Call authenticationotpverification when authenticationemail exists
      this.authenticationotpverification();
    } else {
      // Call otpverification if authenticationemail is not present
      this.otpverification();
    }
  }

  showVerificationStep() {
    if (this.firstFormGroup.valid) {
      this.isVerificationStep = true;
    }
  }
  saveAndContinue(formGroup: FormGroup) {
    if (formGroup === this.fourthFormGroup && formGroup.valid) {
      // Handle any logic specific to the fourthFormGroup here
  
      // Move to the next step in the stepper
      this.stepper.next();
    } else if (formGroup === this.fourthFormGroup && !formGroup.valid) {
      formGroup.markAllAsTouched(); // Highlight errors if any
    }
  }

  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/registration.svg',hasImage: true,},
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',userid: 'user1', Password: 'Password'},
  ];

  login(){
    this.router.navigate(['/login'])
  }

  autoFocusNext(event: Event, nextElementId: string) {
    const target = event.target as HTMLInputElement;
    if (target.value.length === 1 && nextElementId) {
      const nextElement = document.querySelector(`input[formControlName="${nextElementId}"]`) as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

  handleBackspace(event: KeyboardEvent, previousElementId: string) {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && target.value.length === 0 && previousElementId) {
      const previousElement = document.querySelector(`input[formControlName="${previousElementId}"]`) as HTMLInputElement;
      if (previousElement) {
        previousElement.focus();
      }
    }
  }

  formatCountdownTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

 
  sendotp() {
    if (this.isOTPSending) {
      return;
    }
    const userData = this.firstFormGroup.value;
    console.log('%%oiuy',userData);
    const phoneNumber = userData.MobileNumber;
    const email = userData.Email;

    if (!this.validatePhoneNumber(phoneNumber)) {
      this.existingUserMessage = 'Please enter a valid phone number';
      return;
    }

    if (!this.validateEmail(email)) {
      this.existingUserMessage = 'Please enter a valid email address';
      return;
    }

    this.isOTPSending = true;
    
    this.ivinservice.signupotpgeneration(userData).subscribe(
      response => {
        console.log(response, "OTP sent");
        this.isVerificationStep = true; 
        this.existingUserMessage = ''; 
        this.email = email; 
        this.snackbar.open('OTP sent successfully to your email.', 'X', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
            panelClass: 'Snackbar-green'
        });
        this.isOTPSending = false;
      },
      (error: any) => {
        if (error.status === 400 && error.error && error.error.Message) {
          const errorMessage = this.parseErrorMessage(error.error.Message);
          this.existingUserMessage = errorMessage; 
        } else {
          this.existingUserMessage = 'An unknown error occurred. Please try again.'; 
        }
        console.error('Error sending OTP:', error);
      }
    );
  }
  
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return false;
    }
  

    const domainParts = email.split('@')[1];
    if (domainParts) {
      const parts = domainParts.split('.');
      if (parts.length < 2 || parts[0].length < 2) {
        return false;
      }
    }
    return true; 
  }

  private parseErrorMessage(message: string): string {
    if (message.includes('Invalid RCPT TO address provided')) {
      return 'The provided email address is invalid.';
    }
    return message;
  }
  
  
  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[0-9]{10,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  goBackToInitialStep() {
    this.isVerificationStep = false;
    this.firstFormGroup.reset();
  }

  
  otpverification() {
    if (this.VerifyFormGroup.invalid) {
      this.VerifyFormGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }
    const userdata = this.firstFormGroup.value;
    const countrycode = userdata.CountryCode
    const email = userdata.Email;
    const mobilenumber = userdata.MobileNumber;
  
    const verifydata = this.VerifyFormGroup.value;
    const otp = verifydata.otp1 + verifydata.otp2 + verifydata.otp3 + verifydata.otp4;
  
    const userData = {
      CountryCode : countrycode,
      MobileNumber: mobilenumber.toString(),
      Email: email,
      Otp: otp
    };
    
    this.ivinservice.signupotpverification(userData).subscribe(
      (response: any) => {
  
        if (response.Status === 200) {
          this.usertypenames = response.Result.Email;
          this.usermobile = response.Result.MobileNumber;
          this.userid = response.Result.id;
          localStorage.setItem("usertypenames", this.userid);
          
          console.log('otp response ',response.Result);
          this.stepper.next(); // Set the flag to true on successful verification
        } else {
          this.isVerificationStep = false;
          alert('OTP verification failed. Please try again.');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error connecting:', error);
        if (error.status === 400) {
          // Display a custom message for incorrect OTP
          alert('Please enter a valid OTP.');
          this.isOtpVerified = false; // Ensure the flag is false on error
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    );
  }
  
  // Ensure this method checks if OTP verification is successful
  // isOTPInvalid(): boolean {
  //   return !this.isOtpVerified;
  // }
  
validateNumericInput(event: KeyboardEvent) {
  const inputChar = String.fromCharCode(event.charCode);
  if (!/^[0-9]$/.test(inputChar)) {
    event.preventDefault();
    alert('Please enter only numeric value in the OTP field');
  }
}

Usertypeid() {
  this.ivinservice.usertypesignup().subscribe((data: any) => {
    this.UserTypeOptions = data.Result.map((UserType: any) => ({
      label: UserType.Description,
      value: UserType.UserTypeID,
    }));
    // Sort the UserTypeOptions array alphabetically by label
    this.UserTypeOptions.sort((a, b) => a.label.localeCompare(b.label));
  });
}


usertypeget(): Observable<string> {
  return this.ivinservice.getallusertype().pipe(
    map((data: any) => {
      if (data["Status"] === 200) {
        console.log("usertypedata", data);

        // Save the Result array to a variable
        const userTypes = data.Result;

        // Assuming this.usertype contains the UserTypeID
        const userTypeID = this.regusertype; // This should be the ID you are checking

        // Find the user type description that matches the UserTypeID
        const matchedUserType = userTypes.find((type: any) => type.UserTypeID === userTypeID);


        if (matchedUserType) {
          // Extract the description
          this.description = matchedUserType.Description;
          console.log("Matched Description:", this.description);
          sessionStorage.setItem('description', this.description);
          return this.description;
        } else {
          console.log("UserTypeID not found");
          return '';
        }
      }
      return '';
    })
  );
}


 updatedata() {
  const userdatatype = this.thirdFormGroup.value
  this.userdatatype1 = userdatatype.UserType
  if(this.userdatatype1===""){
  this.usertypeid=localStorage.getItem('id')

  const userdata = this.secondFormGroup.value;
  const password = userdata.Password; // Changed from this.userdata to userdata
  const firstname = userdata.Firstname; // Changed from this.userdata to userdata
  const lastname = userdata.Lastname; // Changed from this.userdata to userdata

   // localStorage.setItem('FirstName',firstname);
   sessionStorage.setItem('firstname',firstname);
   // console.log('First Name ',firstname);

  const usertypedata = this.firstFormGroup.value;
  const phoneCode = usertypedata.CountryCode;
  const email = usertypedata.Email;
  const mobilenumber = usertypedata.MobileNumber;
  const registerdata = {
    MobileNumber: mobilenumber,
    Email: email,
    CountryCode :phoneCode,
    Password: password,
    Firstname: firstname,
    Lastname: lastname,
    UserType:1
  };
  this.ivinservice.Updatesignup(this.userid, registerdata).subscribe((data: any) => {
    if(data['Status']===200){
      console.log('update successs',data)
    this.stepper.next();
    }
  });
}
else {
  const userdatatype = this.thirdFormGroup.value
  this.userdatatype1 = userdatatype.UserType
  const userdata = this.secondFormGroup.value;
  const password = userdata.Password; // Changed from this.userdata to userdata
  const firstname = userdata.Firstname; // Changed from this.userdata to userdata
  const lastname = userdata.Lastname; // Changed from this.userdata to userdata
  const usertypedata = this.firstFormGroup.value;
  const email = usertypedata.Email;
  const mobilenumber = usertypedata.MobileNumber;
  const phoneCode = usertypedata.CountryCode;

  const registerdata = {
    MobileNumber: mobilenumber || "",
    Email: email || this.authenticationemail,
    CountryCode :phoneCode || "",
    Password: password || "",
    Firstname: firstname ||  this.givenname,
    Lastname: lastname ||  this.familyname,
    UserType:this.userdatatype1 || "7"
  };
  this.ivinservice.Updatesignup(this.userid, registerdata).subscribe((data: any) => {
    if(data['Status'] === 200) {
      console.log(data, "update successs");
      this.regusertype = data.Result.UserType;
      console.log('this.regusertype',this.regusertype);
      // Subscribe to usertypeget to ensure it completes before storing the description
      this.usertypeget().subscribe(() => {
        console.log("usertype reg", this.regusertype);
        console.log("description reg", this.description);
  
        sessionStorage.setItem("usertype", this.regusertype.toString());
        sessionStorage.setItem('description', this.description); 
      });
      this.stepper.next();
      // this.usertypenameget();
    }
  });

}
}

usertypenameget(){
  this.ivinservice.usertypesignupgetid( this.regusertype).subscribe((data:any)=>{
    if (data['Status']===200){
      console.log('usertype name',data);
      this.regusertypename = data.Result[0].Description
      console.log('this.regusertypename',this.regusertypename);
      sessionStorage.setItem('description',this.regusertypename);
    }
  })
}



submitForm(){
  this.usertypeid = localStorage.getItem('id');
  const formdata = this.fourthFormGroup.value;
  const state = formdata.State;
  const city = formdata.City;
  const pinCode = formdata.PinCode;
  const country =formdata.Country;
  const userdatadescription = this.fifthFormGroup.value;
  const description = userdatadescription.Candidate_Brief;
  localStorage.setItem('aboutyourself',description);
  console.log('Aboutyourself',description);
  const descriptiondata = userdatadescription.Description;
  // First Form Group
  const userdata = this.secondFormGroup.value;
  const password = userdata.Password; // Changed from this.userdata to userdata
  const firstname = userdata.Firstname; // Changed from this.userdata to userdata
  const lastname = userdata.Lastname;
  // Second Form Group
  const usertypedata = this.firstFormGroup.value;
  const email = usertypedata.Email;
  const mobilenumber = usertypedata.MobileNumber;
  const phoneCode = usertypedata.CountryCode;

  const formData=new FormData();
  formData.append('UserId', this.userid);
  console.log(' this.userid', this.userid);
  formData.append('UserName','');
  formData.append('ProfilePicture', '');
  formData.append('FirstName', firstname || this.givenname);
  console.log('firstname', firstname);
  formData.append('LastName',lastname || this.familyname);
  console.log('lastname', lastname);
  formData.append('CountryCode',phoneCode || null);
  console.log('phoneCode',phoneCode);
  formData.append('DateOfBirth', '');
  formData.append('PlaceOfBirth', '');
  formData.append('Age','');
  formData.append('Gender', '');
  formData.append('Email', email || this.authenticationemail);
  console.log('email', email);
  formData.append('PhoneNumber', mobilenumber || '9876543210');
  console.log('mobilenumber', mobilenumber);
  formData.append('Address', '');
  formData.append('City', city || 'Visakhapatnam');
  console.log('city', city);
  formData.append('State',state || 'Andhra Pradesh');
  console.log('state', state);
  formData.append('PinCode',pinCode || '530051');
  console.log('pinCode', pinCode);
  formData.append('Candidate_Brief',description || 'Nothing');
  console.log('description', description);
  formData.append('Country',country || 'India');
  console.log('country', country);
  formData.append('Description',descriptiondata || 'Nothing')
  console.log('descriptiondata', descriptiondata);
  console.log('register form data',formData);
  this.ivinservice.About(formData).subscribe((data:any)=>{
   if(data['Status']===200){
    console.log('register data',data);
    this.registeruserid = data.Result.UserId;
    console.log('UserId_id',this.registeruserid);
    sessionStorage.setItem('loginid',this.registeruserid);
    this.snackbar.open('Registration Successfull', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
        panelClass: 'Snackbar-green'
    });
    this.stepper.next();
    this.bearertoken = data.Result.Bearer_Token;
    console.log('Bearer token',this.bearertoken);
      // Set authentication status in IvinService
      this.ivinservice.setAuthenticated(true);
      if(this.bearertoken){
        this.router.navigate(['/pollingbooth']).then(() => {
          window.location.reload();
        });
        sessionStorage.setItem('bearer_token',this.bearertoken);
      }
    // window.location.reload();
   }
});
}

signup(){
  this.router.navigate(['/pollingbooth'])
}

isOTPInvalid(): boolean {
  return (
    this.VerifyFormGroup.get('otp1').invalid ||
    this.VerifyFormGroup.get('otp2').invalid ||
    this.VerifyFormGroup.get('otp3').invalid ||
    this.VerifyFormGroup.get('otp4').invalid
  );
}

ResendOtp() {
  this.otpExpired = false;
  this.showResendError = true;
  this.invalidDetailsMessages = 'OTP sent to your email';
  this.invalidDetailsMessage= false;
  this.resendButtonDisabled = true;
  this.resetOtpValues();
  // this.startCountdown();
  this.sendotp();
}

resetOtpValues() {
  this.otpValue = ['', '', '', ''];
}

}