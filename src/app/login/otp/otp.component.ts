import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IvinService } from 'src/app/ivin.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';

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
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  invalidDetailsMessage: any;
  invalidDetailsMessages:any;
  otpValue: string[] = ['', '', '', ''];
  otpSentMessage:any;
  otpExpired: boolean = false;
  resendButtonDisabled = false;
  countdownSeconds: number = 0;
  countdownInterval: any;
  email: string = '';
  isOtpValid: boolean = false;
  destroyed = new Subject<void>();
  currentScreenSizes: any;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  mobile: any;
  userId: any;
  recieveotpemail: any;
  showResendError: boolean = false;
  description: any;
  usertype: any;
  regusertype: any;
  firstname: any;
  bearertoken: any;
  
  constructor(private cookieService: CookieService,private router:Router, private route:ActivatedRoute, breakpointObserver: BreakpointObserver, private ivinservice:IvinService) {
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
  }

  ngOnInit() {
    this.recieveotpemail = history.state.SendEmail;
    this.usertypeget();
  }

  onOtpInputChange(index: number, nextInput: HTMLInputElement | null, prevInput: HTMLInputElement | null): void {
    this.otpValue[index] = this.otpValue[index].replace(/[^0-9]/g, '');
    // Check if all OTP inputs are filled
    this.isOtpValid = this.otpValue.every(value => value !== '');
    if (this.otpValue[index] === '' && prevInput) {
      prevInput.focus();
    } else if (this.otpValue[index] !== '' && nextInput) {
      nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, prevInput: HTMLInputElement | null, nextInput: HTMLInputElement | null): void {
    if (event.key === 'ArrowLeft' && prevInput) {
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && nextInput) {
      nextInput.focus();
    }
  }

  formatCountdownTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }


  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/loginimg.png',hasImage: true,},
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',userid: 'user1', Password: 'Password'},
  ];

  resetOtpValues() {
    this.otpValue = ['', '', '', ''];
  }

  registration(){
    this.router.navigate(['/registration'])
  }

  login() {
    this.router.navigate(['/login']);
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

  SubmitOtp() {
    if (this.otpValue.some(value => value.trim() === '')) {
      // this.invalidDetailsMessage = 'Please enter all 4 digits of the OTP.';
      console.error('Error: Not all OTP digits are entered.');
      return;
    }
  
    const oneTime = this.otpValue.join('');
    const otpdata = {
      Email: this.recieveotpemail,
      Otp: oneTime,
    };
  
    this.ivinservice.otpverfication(otpdata).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          console.log('OTP verified successfully', data);
          this.firstname = data.Result.UserData[0].Firstname
          console.log("firstname", this.firstname);
          sessionStorage.setItem('firstname',this.firstname);
          this.regusertype = data.Result.UserData[0].UserType;
          this.bearertoken = data.Result.Bearer_Token;
          this.usertypeget().subscribe(() => {
            console.log("usertype reg", this.regusertype);
            // console.log("description reg", this.description);
      
            sessionStorage.setItem("usertype", this.regusertype.toString());
            // sessionStorage.setItem('description', this.description); 
            if (this.bearertoken) {
              this.router.navigate(['/pollingbooth']).then(() => {
                window.location.reload();
              });
              sessionStorage.setItem('bearer_token', this.bearertoken);
            }else{
              alert('Invalid login credentials. Please try again.');
            }
          });

        }
      },
      (error: any) => {
        if (error.status === 400 && error.error && error.error.Message) {
          // this.invalidDetailsMessage = error.error.Message; 
          alert(' Please enter a valid OTP.');
        } else {
          this.invalidDetailsMessage = 'An error occurred while verifying the OTP. Please try again.';
        }
        console.error('Error posting data:', error);
      }
    );
  }
  
  validateNumericInput(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
      alert('Please enter only numeric value in the OTP field');
    }
  }


  ResendOtp() {
    this.otpExpired = false;
    this.showResendError = true;
    this.invalidDetailsMessages = 'OTP sent to your email';
    this.invalidDetailsMessage= false;
    this.resendButtonDisabled = true;
    this.resetOtpValues();
    // this.startCountdown();
    this.ResendSend();
  }

  ResendSend() {
    const resenddata = {
      Email: this.recieveotpemail,
    };
    console.log('otpsend',resenddata)
    this.ivinservice.OTPSend(resenddata).subscribe(
      (data:any) => {
        if (data['Status'] === 200) {
          console.log('resendotp sent', data);
        }
      },
    );
  }

  closeErrorMessage() {
    this.showResendError = false;
  }

  isOTPInvalid(){
    
  }

}
