import { Component,Output, EventEmitter,Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SuperadminService } from '../../superadmin.service';
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

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;


  mobileQuery: MediaQueryList = this.mediaMatcher.matchMedia('(max-width: 600px)');
  showMobileIcon = this.mobileQuery.matches;
  private _mobileQueryListener: () => void;
  displayName='userRegistration';
  formData:any= {studentFirstName:'',
  studentDOB:'',
  mothersFirstName:'',
  emailId:'',}
  verificationCode='';
  otpValue: string[] = ['', '', '', ''];
  invalidDetailsMessage: any;
  successmsg: any;
  result: any;
  oneTime:any;
  hcid: any;
  resendButtonDisabled = false;
  countdownSeconds: number = 0;
  countdownInterval: any;
  otpSentMessage:any;
  otpExpired: boolean = false;
  showResendError: boolean = false;
  invalidDetailsMessages:any;
  mobile: any;

  userId: any;
  email: any;
  invalidOtp: any;
  constructor( private routes:Router ,private route: ActivatedRoute, private breakpointObserver: BreakpointObserver,private fb: FormBuilder,private mediaMatcher: MediaMatcher,private renderer: Renderer2,private adminService:SuperadminService){
    console.log('Component initialized');
    
    this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small]) {
        console.log('Small screen detected');
      } else {
        console.log('Larger screen detected');
      }
    });
    this._mobileQueryListener = () => (this.showMobileIcon = this.mobileQuery.matches);
    this.mobileQuery.addListener(this._mobileQueryListener);
    breakpointObserver
    .observe([
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
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });
}

onOtpInputChange(index: number, nextInput: HTMLInputElement | null, prevInput: HTMLInputElement | null): void {
  this.otpValue[index] = this.otpValue[index].replace(/[^0-9]/g, '');
  console.log(this.otpValue,"otp");
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


  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/svgs/doctor.svg',hasImage: true,},
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',userid: 'user1', Password: 'Password'},
  ];

  resetOtpValues() {
    this.otpValue = ['', '', '', ''];
  }  
  

  dashboard(){
    this.routes.navigate(['./dashboard'])
  } 

  startCountdown() {
    this.countdownSeconds = 10;
    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      if (this.countdownSeconds > 0) {
        this.countdownSeconds--;
      } else {
        this.resendButtonDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
  closeErrorMessage() {
    this.showResendError = false;
  }
  formatCountdownTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  destroyed = new Subject<void>();
  currentScreenSize: any;
  studentForm!: FormGroup;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email,"email");
    });
    this.studentForm = this.fb.group({
      
      Email: ['', [Validators.required]],
    });
    if (window.screen.width <= 1200) { 
      this.showMobileIcon = true;
    }
  }
 
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.mobileQuery.removeListener(this._mobileQueryListener);
}

otpSubmit(){
  const otpData={
    Email:this.email ,
    Otp:this.otpValue.join(""),
  }
  console.log(otpData,"data");
  this.adminService.otpVerification(otpData).subscribe((data:any)=>{
    if (data && data.Status === 200) {
      this.dashboard();
    }
  },
  (error: HttpErrorResponse) => {
         
    if (error.error && error.error.Message) {
      this.invalidOtp = error.error.Message;
    } else {
      this.invalidOtp = error.message;
    }
    console.log(this.invalidOtp, "message");
  }
  );
}
}



function userId(userId: any, terms: { Terms_and_conditions: boolean; Version: number; Date: string; }) {
  throw new Error('Function not implemented.');
}




