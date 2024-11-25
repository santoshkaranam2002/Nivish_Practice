declare var google:any
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
  FormGroupDirective,
  Validators,
  FormGroup,
  FormBuilder} from '@angular/forms';
import { from } from 'rxjs';
import { IvinService } from '../ivin.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { text } from 'd3';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    MatButtonToggleModule,
    FlexLayoutModule,
  ]
})

export class LoginComponent implements OnDestroy {
  
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
  selectedToggle: string = 'Login With Email';
  otpForm!: FormGroup;
  description: any;
  username: any;
  email: any;
  givenName: any;
  familyName: any;
  
  constructor(private cookieService: CookieService,private router:Router,
     private route:ActivatedRoute, breakpointObserver: BreakpointObserver, 
     private ivinservice:IvinService,private fb:FormBuilder,
     private formBuilder: FormBuilder,private http: HttpClient,) {
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
    sessionStorage.removeItem('firstname');
    sessionStorage.removeItem('usertype');
    localStorage.removeItem('bearer_token');
    sessionStorage.removeItem('description');
    // this.usertypeget();
    if (window.screen.width <= 960) { // 768px portrait
      this.mobile = true;
    }

    this.otpForm = this.formBuilder.group({
      otpemail: ['', Validators.required] // Define form controls with validation
    });
    this.initializeGoogleSignIn();
  }
  
// Authentication

initializeGoogleSignIn(): void {
  // Check every 500ms if the Google API is loaded, and stop checking once it is loaded
  const retryInterval = setInterval(() => {
    if ((window as any).google && (window as any).google.accounts) {
      clearInterval(retryInterval);  // Stop the interval once Google API is loaded

      // Initialize Google Sign-In with client ID and callback
      (window as any).google.accounts.id.initialize({
        client_id: '596947134190-6ud9hevoqc7hgi18a9536av6teic72qt.apps.googleusercontent.com',  // Use your own Google Client ID
        callback: this.handleCredentialResponse.bind(this),  // Bind 'this' to ensure correct context
        scope: 'email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read'
      });

      // Render the Google Sign-In button
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),  // Target the button container in the HTML
        { 
          type: 'icon',  // Button style
          size: 'large',  // Button size
          theme: 'filled_black',  // Button theme
          shape: 'pill',  // Button shape
          text: 'Continue with Google'  // Button text
        }
      );
    }
  }, 500);  // Retry every 500 milliseconds until Google API is available
}

async handleCredentialResponse(response: any): Promise<void> {
  // First decode the credential to get the basic info
  const tokenParts = response.credential.split('.');
  const decodedPayload = JSON.parse(atob(tokenParts[1]));
  
  // Store basic info
  this.email = decodedPayload.email;
  this.givenName = decodedPayload.given_name;
  this.familyName = decodedPayload.family_name;
  
  // Store in session
  sessionStorage.setItem('authenticationemail', this.email);
  sessionStorage.setItem('authenticationgivenname', this.givenName);
  sessionStorage.setItem('authenticationfamilyname', this.familyName);

  // To get additional info (birthday, gender), you need to use Google's People API
  // This requires a separate OAuth flow with proper scopes
  try {
    // You'll need to implement a separate OAuth flow to get an access token
    const auth = google.accounts.oauth2.initTokenClient({
      client_id: '596947134190-6ud9hevoqc7hgi18a9536av6teic72qt.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          const userInfoResponse = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=birthdays,genders',
            {
              headers: {
                'Authorization': `Bearer ${tokenResponse.access_token}`
              }
            }
          );
          
          const userInfo = await userInfoResponse.json();
          
          // Extract birthday and gender
          const birthday = userInfo.birthdays?.[0]?.date;
          const gender = userInfo.genders?.[0]?.value;
          
          console.log('Birthday:', birthday);
          console.log('Gender:', gender);
          
          if (birthday) {
            sessionStorage.setItem('userBirthday', `${birthday.year}-${birthday.month}-${birthday.day}`);
          }
          if (gender) {
            sessionStorage.setItem('userGender', gender);
          }
        }
      }
    });
    
    // Request the access token
    auth.requestAccessToken();
    
  } catch (error) {
    console.error('Error fetching additional profile info:', error);
  }

  // Log the basic info we got from the ID token
  console.log("Authenticated email: ", this.email);
  console.log("Full Name: ", decodedPayload.name);
  console.log("Given Name: ", this.givenName);
  console.log("Family Name: ", this.familyName);
  console.log("Email Verified: ", decodedPayload.email_verified);
  console.log("Profile Picture: ", decodedPayload.picture);

  // Proceed with your authentication
  this.Authenticationlogin();
}



// Send email to backend for authentication
Authenticationlogin(): void {

  const email = {
    Email : this.email
  }

  this.ivinservice.authenticationlogin(email).subscribe((data: any) => {
    if (data['Status'] === 200) {
      // Navigate to the pollingbooth route upon successful authentication
      console.log(`authentication' ${this.email} 'login`, data);
      this.usertype = data.Result.UserType;
        
      // Subscribe to usertypeget to ensure it completes before storing the description
      this.usertypeget().subscribe(() => {
        console.log("usertype", this.usertype);
        console.log("description", this.description);
  
       // Check if usertype is not null or undefined before calling toString()
        sessionStorage.setItem("usertype", this.usertype?.toString() ?? '7');
        sessionStorage.setItem('description', this.description ?? 'News Channel');

        this.loginId = data.Result.id;
        console.log(this.loginId, "id");
        sessionStorage.setItem("loginid", this.loginId);
        localStorage.setItem('loginId', this.loginId);
        this.firstname = data.Result.Firstname;
        localStorage.setItem('firstname', this.firstname);
        sessionStorage.setItem('firstname', this.firstname);
        console.log('firstname', this.firstname);
        this.username = data.Result.UserName;
        localStorage.setItem('username', this.username);
        sessionStorage.setItem('username', this.username);
        console.log('username', this.username);
  
        this.bearertoken = data.Result.Bearer_Token;
        console.log('Bearer token', this.bearertoken);
  
        // if (userId !== null && userId !== undefined) {
        //   this.cookieService.set('userId', userId);
        //   localStorage.setItem('userEmail', userId);
        // }
  
        // if (password !== null && password !== undefined) {
        //   this.cookieService.set('password', password);
        // }
  
        // Set authentication status in IvinService
        this.ivinservice.setAuthenticated(true);
        if (this.bearertoken) {
          this.router.navigate(['/pollingbooth']).then(() => {
            window.location.reload();
          });
          sessionStorage.setItem('bearer_token', this.bearertoken);
        }
      });
      // this.router.navigate(['/pollingbooth']);
    } else {
      // Show an alert with the error message from the response
      alert(`Login failed: ${data['Message'] || 'Unknown error'}`);
     
    }
  }, 
  (error: any) => {
    // Navigate to registration and pass the email for OTP step
       // Handle unexpected errors from the backend
     console.error('Error occurred:', error);
     const errorMessage = error.error?.Message || 'An unknown error occurred.';
     alert(`Error: ${errorMessage}`);
    // this.router.navigate(['/registration']);
  }
);
}

  
  usertypeget(): Observable<string> {
    return this.ivinservice.getallusertype().pipe(
      map((data: any) => {
        if (data["Status"] === 200) {
          console.log("usertypedata", data);
  
          // Save the Result array to a variable
          const userTypes = data.Result;
  
          // Assuming this.usertype contains the UserTypeID
          const userTypeID = this.usertype; // This should be the ID you are checking
  
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
        console.log(data, "login");
        this.usertype = data.Result.UserType;
        
        // Subscribe to usertypeget to ensure it completes before storing the description
        this.usertypeget().subscribe(() => {
          console.log("usertype", this.usertype);
          console.log("description", this.description);
    
          sessionStorage.setItem("usertype", this.usertype.toString());
          sessionStorage.setItem('description', this.description); // Save after usertypeget completes
          this.loginId = data.Result.id;
          console.log(this.loginId, "id");
          sessionStorage.setItem("loginid", this.loginId);
          localStorage.setItem('loginId', this.loginId);
          this.firstname = data.Result.Firstname;
          localStorage.setItem('firstname', this.firstname);
          sessionStorage.setItem('firstname', this.firstname);
          console.log('firstname', this.firstname);
          this.username = data.Result.UserName;
          localStorage.setItem('username', this.username);
          sessionStorage.setItem('username', this.username);
          console.log('username', this.username);
    
          this.bearertoken = data.Result.Bearer_Token;
          console.log('Bearer token', this.bearertoken);
    
          if (userId !== null && userId !== undefined) {
            this.cookieService.set('userId', userId);
            localStorage.setItem('userEmail', userId);
          }
    
          if (password !== null && password !== undefined) {
            this.cookieService.set('password', password);
          }
    
          // Set authentication status in IvinService
          this.ivinservice.setAuthenticated(true);
          if (this.bearertoken) {
            this.router.navigate(['/pollingbooth']).then(() => {
              window.location.reload();
            });
            sessionStorage.setItem('bearer_token', this.bearertoken);
          }
        });
      } else {
        alert('Invalid login credentials. Please try again.');
      }
    }, (error) => {
      if (error.status === 400) {
        alert('Invalid username or password. Please check your credentials');
      } else {
        alert('Invalid username or password. Please check your credentials');
      }
    });
  }    

  
  tiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',imageUrl:'assets/images/loginimg.png',hasImage: true,},
    {text: '', cols: 2, rows: 1, color: '#FFFFFF',userid: 'user1', Password: 'Password'},
  ];

  registration(){
    this.router.navigate(['/registration']).then(()=>{
       window.location.reload();
    })
    
  }
  
  forgotpassword(){
    this.router.navigate(['/forgotpassword'])
  }
 
  SendOtp() {
    if (this.otpForm.valid) {
      const emailotp = this.otpForm.value.otpemail;
      const otpdata = {
        Email: emailotp 
      };
      console.log('otpdata', otpdata);
      this.ivinservice.OTPSend(otpdata).subscribe(
        (data: any) => {
          if (data && data['Status'] === 200) {
            console.log('otp sent', data);
            this.router.navigate(['/otp'], { state: { SendEmail: emailotp } });
          } else {
            console.error('Failed to send OTP');
          }
        },
        error => {
          console.error('Error sending OTP:', error);
          if (error.status === 400 && error.error.Message) {
            alert('please Enter Registered Email'); // Display the specific error message
          } else {
            alert('An error occurred while sending the OTP. Please try again.');
          }
        }
      );
    } else {
      console.error('Form is invalid');
      alert('Please enter a valid email address.'); // Optional alert for invalid form
    }
  }
  

}
