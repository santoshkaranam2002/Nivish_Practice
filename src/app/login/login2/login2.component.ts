import { Component, OnDestroy } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
  FormGroupDirective,
  Validators} from '@angular/forms';
import { from } from 'rxjs';
import { IvinService } from 'src/app/ivin.service';


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
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatListModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule]
})

export class Login2Component implements OnDestroy {
  passwordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('',[Validators.required]);
  matcher = new ErrorStateMatcher;
  withBreaksHtml: any;
  hide: any;
  destroyed = new Subject<void>();
  currentScreenSizes: any;
  mobile: any;
  loginId: any;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  firstname: any;
  usertype: any;
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

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit() {
    if (window.screen.width <= 960) { // 768px portrait
      this.mobile = true;
    }
  }

  // Login Code Based On EndPoint
  login() {
    this.emailFormControl.markAsTouched();
    this.passwordFormControl.markAsTouched();
  
    if (this.passwordFormControl.invalid) {
      return;
    }
  
    const userId = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
  
    const logindata = {
      Email: this.emailFormControl.value,
      Password: this.passwordFormControl.value,
    };
  
    this.ivinservice.loginservice(logindata).subscribe((data: any) => {
      if (data["Status"] === 200) {
        console.log(data,"login");
        this.usertype = data.Result.UserType;
        console.log("usertype",this.usertype)
        sessionStorage.setItem("usertype",this.usertype);
        this.loginId=data.Result.id;
        console.log(this.loginId,"id");
        localStorage.setItem('loginId',this.loginId);
        this.firstname = data.Result.Firstname;
        localStorage.setItem('firstname',this.firstname);
        sessionStorage.setItem('firstname',this.firstname);
        console.log('firstname',this.firstname);
        this.bearertoken = data.Result.Bearer_Token;
        console.log('Bearer token',this.bearertoken);
        sessionStorage.setItem('bearer_token',this.bearertoken);
        // const loginDetails = `User ID: ${userId}\nPassword: ${password}`;
        // alert(`Login Successful!\n${loginDetails}`);
  
        if (userId !== null && userId !== undefined) {
          this.cookieService.set('userId', userId);
          localStorage.setItem('userEmail', userId);
        }
  
        if (password !== null && password !== undefined) {
          this.cookieService.set('password', password);
        }

        // Set authentication status in IvinService
        this.ivinservice.setAuthenticated(true);
  
         // Navigate to pollingbooth and refresh the page
         this.router.navigate(['/pollingbooth']).then(() => {
          window.location.reload();
        });
      } else {
        alert('Invalid login credentials. Please try again.');
      }
    },
    (error) => {
      if (error.status === 400) {
        alert('Invalid username or password. Please check your credentials');
      } else {
        alert('Invalid username or password. Please check your credentials');
      }
     }
    
    );
  }
  
  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/svgs/ivin-login-screen.svg',hasImage: true,},
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',userid: 'user1', Password: 'Password'},
  ];
  
}
