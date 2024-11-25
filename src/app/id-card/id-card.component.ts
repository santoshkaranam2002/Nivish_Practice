import { Component } from '@angular/core';
import { SuperadminService } from '../superadmin.service';



@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.css']
})
export class IdCardComponent {
  displayName='profile';
  Providerdetails: any;
  provideFullName: any;
  provideDateOfBirth: any;
  provideMobileNumber: any;
  provideEmail: any;
  provideGender: any;
  idCardDetails: any; // Property to hold ID card details
  message: any;
  Niv: any;
  Upload_Your_Photo: any;
  Hcp_qrcode: any;
  dataLoaded = false;
  // provideEmail:any;
  // uinValue: any;
  // studentDOB: any;
  // studentFirstName: any;
  // MobileNumber: any;
  // gender: any;
  // profile: any;
  // qrcode: any;

  constructor(private SuperadminService:SuperadminService){

  }
  ngOnInit() {
    this.getIdCard();
  }
  getIdCard() {
    const updRegId = localStorage.getItem('updRegId');
    console.log(updRegId);
  
    this.SuperadminService.gethcpidcard(updRegId).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          console.log(data);
          const result = data['Result'];
  
          if (result) {
            this.provideFullName = result['FullName'] || '';
            console.log(this.provideFullName, "no");
  
            this.provideDateOfBirth = result['Date_of_Birth'] || '';
            this.provideMobileNumber = result['Registered_MobileNumber'] || '';
            this.provideEmail = result['Registered_Email'] || '';
            this.provideGender = result['Gender'] || '';
            this.Niv = result['NIV'] || '';
            this.Upload_Your_Photo = result['Upload_Your_Photo'] || '';
            this.Hcp_qrcode = result['Hcp_qrcode'] || '';
          }
        }
      },
      (error: any) => {
        console.error('Error in gethcpidcard:', error);
        // Handle the error as needed
      }
    );
  }
   
  // getprovideridcard() {
  //   const userId = localStorage.getItem('userId');
  //   if (!userId) {
  //     console.log('userId not found in local storage.');
  //     return;
  //   }

  //   this.nivishservice.getprovideridcard(userId).subscribe(
  //     (data: any) => {
  //       if (data['Status'] === 200) {
  //         const result = data['Result'];
        
  //         if (result) {
  //           this.uinValue = result['NIV'];
  //           console.log('UIN:', this.uinValue);
            
  //           this.studentDOB = result['Date_of_Birth'];
  //           console.log('Date_of_Birth:', this.studentDOB);
            
  //           this.studentFirstName = result['FullName'];
  //           console.log('FullName:', this.studentFirstName);
        
  //           this.gender = result['Gender'];
  //           console.log('Gender:', this.gender);

  //           this.provideEmail = result['GenRegistered_Emailder'];
  //           console.log('Registered_Email:', this.provideEmail);
        
  //           this.MobileNumber = result['Registered_MobileNumber'];
  //           console.log('Registered_MobileNumber:', this.MobileNumber);

  //           this.profile = result['Upload_Your_Photo']
  //           console.log('profilephoto:', this.profile);

  //           this.qrcode = result ['Hcp_qrcode']
  //           console.log('qrcode:',this.qrcode)
     

  //           this.message = 'Get idcard';
  //         }
  //       }
  //       console.log(this.message);
  //       console.log(data);
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       // Handle the error here (e.g., show an error message to the user)
  //     }
  //   );
  // }



//   idCardDetails: any;
// message: any;
// provideEmail: any;
// uinValue: any;
// studentDOB: any;
// studentFirstName: any;
// MobileNumber: any;
// gender: any;
// profile: any;
// qrcode: any;

// constructor(private nivishservice: NivishService) {}

// ngOnInit() {
//   this.getprovideridcard();
// }

// getprovideridcard() {
//   const userId = localStorage.getItem('userId');
//   if (!userId) {
//     console.log('userId not found in local storage.');
//     return;
//   }

//   this.nivishservice.getprovideridcard(userId).subscribe(
//     (data: any) => {
//       if (data['Status'] === 200) {
//         const result = data['Result'];

//         if (result) {
//           this.uinValue = result['NIV'];
//           console.log('UIN:', this.uinValue);

//           this.studentDOB = result['Date_of_Birth'];
//           console.log('Date_of_Birth:', this.studentDOB);

//           this.studentFirstName = result['FullName'];
//           console.log('FullName:', this.studentFirstName);

//           this.gender = result['Gender'];
//           console.log('Gender:', this.gender);

//           this.provideEmail = result['GenRegistered_Email'];
//           console.log('Registered_Email:', this.provideEmail);

//           this.MobileNumber = result['Registered_MobileNumber'];
//           console.log('Registered_MobileNumber:', this.MobileNumber);

//           this.profile = result['Upload_Your_Photo'];
//           console.log('profilephoto:', this.profile);

//           this.qrcode = result['Hcp_qrcode'];
//           console.log('qrcode:', this.qrcode);

//           this.message = 'Get idcard';
//         }
//       }
//       console.log(this.message);
//       console.log(data);
//     },
//     (error) => {
//       console.error('Error:', error);

//     }
//   );
// }

}
