import { ChangeDetectorRef, Component,EventEmitter ,OnInit,Output, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isEmailLogin: boolean = true;
  selectedOption: string = 'Login with Email';  // Initialize with the default option
  displayName='rdlogin';
  hcid: any;
  showErrorMessage: boolean = false;
  successmsg: any;
  invalidDetailsMessage: any;
  userId: any;
  loginForm!: FormGroup;
  otpForm!:FormGroup;
  loginErrorMessage: any;
  superAdminId: any;
  otpErrorMessage: any;


  constructor(private fb: FormBuilder,private adminService:SuperadminService,private routes:Router,private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    sessionStorage.removeItem("formData");
    this.adminService.setLoggedIn(false);
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue],
      type: ['Super Admin', Validators.required]
    });
    this.otpForm=this.fb.group({
      emailOtp:['', [Validators.required, Validators.minLength(3)]],
      type: ['Super Admin', Validators.required],
      conditions: [false, Validators.requiredTrue],
    })


  }

 

  // image function start
  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/svgs/doctor.svg',hasImage: true,}
  ];
  // image fuction end

  switchTemplate() {
    this.displayName='rdotp';

  }
  switchTemplates() {
    this.displayName='rdlogin';
  }

  rdloginpage(){
    this.displayName='rdloginpage'
  }

  handleOptionChange(selectedOption: string): void {
    console.log('Selected option:', selectedOption);
    this.isEmailLogin = selectedOption === 'Login With Email';
  }

  onResendClick(){
    // this.routes.navigate(['/otp']);
  }

  onLoginPasswordChange(password: string) {
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = {
        Email: this.loginForm.value.username,
        Password: this.loginForm.value.password,
        Type: this.loginForm.value.type
      };

      console.log(formData);

      this.adminService.login(formData).subscribe(
        (data: any) => {
          if (data['Status'] === 200) {
            const superAdminId = data.Result.id;
            console.log(superAdminId, "superId");
            sessionStorage.setItem('superAdminId', superAdminId);
            sessionStorage.setItem('formData', JSON.stringify(formData));


            this.routes.navigate(['/dashboard']);
            console.log(data, "success");
          }
        },
        (error: HttpErrorResponse) => {
          if (error.error && error.error.Message) {
            this.loginErrorMessage = error.error.Message;
          } else {
            this.loginErrorMessage = error.message;
          }
          console.log(this.loginErrorMessage, "message");
        }
      );
    } else {
      this.loginForm.markAllAsTouched(); 
    }
  }
  
otpSubmit(){
  if (this.otpForm.valid) {
    const otpData = {
      Email: this.otpForm.value.emailOtp,
      Type: this.otpForm.value.type
    };
    console.log(otpData,"otpEmail");
    this.adminService.otpGeneration(otpData).subscribe((data:any)=>
    {
      if(data["Status"]===200){
        this.openSnackBar('OTP generated successfully', 'success-snackbar');
        this.routes.navigate(['/otp'], { queryParams: { email: otpData.Email } });
      }
    },
    (error: HttpErrorResponse) => {
         
      if (error.error && error.error.Message) {
        this.otpErrorMessage = error.error.Message;
      } else {
        this.otpErrorMessage = error.message;
      }
      console.log(this.otpErrorMessage, "message");
    }
  );
  }
  else {
    this.otpForm.markAllAsTouched(); 
  }
}

openSnackBar(message: string, panelClass: string) {
  this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass]
  });
}

}
