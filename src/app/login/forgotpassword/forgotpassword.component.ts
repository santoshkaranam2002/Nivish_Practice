import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IvinService } from 'src/app/ivin.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit, OnDestroy {

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
  emailFormControl = new FormControl('', [Validators.required]);
  isPasswordReset: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver,
    private ivinService: IvinService,
    private _formBuilder: FormBuilder,
    private snackbar:MatSnackBar
  ) {
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

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit() {
    if (window.screen.width <= 960) { // 768px portrait
      this.mobile = true;
    }
  }

  tiles: Tile[] = [
    { text: '', cols: 2, rows: 1, color: '#FFFFFF', imageUrl: 'assets/images/forgetpassword.svg', hasImage: true },
    { text: '', cols: 2, rows: 1, color: '#FFFFFF', userid: 'user1', Password: 'Password' },
  ];

  login() {
    this.router.navigate(['/login']);
  }

  resetPassword() {
    this.isPasswordReset = true;
  }

  forgetpasswordpost() {
    this.emailFormControl.markAsTouched();
  
    if (this.emailFormControl.valid) {
      const Email = this.emailFormControl.value;
      console.log('forgetemail', Email);
  
      this.ivinService.forgetpasswordpost(Email).subscribe(
        (data: any) => {
          if (data.Status === 200) {
            console.log('data', data);
  
            this.isPasswordReset = true;
  
            this.snackbar.open('Reset Password Link Sent Successfully', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          } else {
            console.error('Unexpected response:', data);
          }
        },
        (error: any) => {
          if (error.status === 400 && error.error?.Message) {
            alert('Email not found. Please enter a valid email address.');
          } else {
            console.error('Error:', error);
          }
        }
      );
    } else {
      console.error('Email form is invalid');
    }
  }
  
}
