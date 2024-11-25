import { Component, EventEmitter, Output } from '@angular/core';
import { Router,ActivatedRoute, } from '@angular/router';
import { SuperadminService } from '../superadmin.service';

import { Form, FormBuilder ,NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-hcp-sections',
  templateUrl: './hcp-sections.component.html',
  styleUrl: './hcp-sections.component.scss',
  providers: [DatePipe]

})
export class HcpSectionsComponent {
  countries: { id: number; name: string }[] = [];
  signofformFilledby:any;
  licenseId:any;
  EducationId:any;
  updateFormLicenseId: number | null = null;
  updateFormEductaionId:number | null=null;
  showUpdateForm:boolean=false;
  selectedCategorylic:any;
  selectedCategoryotherslic:any;
  LicenseAuthoritylic:any;
  LicenseAuthorityotherlic:any;
  SelectedCountryIdlic:any;
  SelectedstatesIdlic:any;
  issueddatelic:any;
  validatetilllic:any;
  lifelongvaliditylic:any;
  Licensenumberlic:any;
  displayName='presonal';
  newprovideFullName:any;
  newprovideDateOfBirth:any;
  newprovideMobileNumber:any;
  newprovideEmail:any;

  // displayName='License';
  @Output() selectedGenderChange = new EventEmitter<string>();

  
num:number=1;
provideFullName:string='';
provideEmail:string='';
provideMobileNumber:string='';
provideDateOfBirth:string='';
userdetails:any={};

selectedGender: string = ''; 
  dialog: any;
  myId: number=1;
  nameofinstitute:any;
  TypeofDegree:any;
  FieldofStudy:any;
  SelectedCountryId:any;
  ToDate:any;
  FromDate:any;
  UploadCertificate:any;
  selectedCategory:any;
  selectedCategoryothers:any;
  LicenseAuthority:any;
  LicenseAuthorityother:any;
  Years:any;
  Months:any;
  Licensenumber:any;
  SelectedstatesId:any;
  providerEducationMessage:any;
  issueddate:any;
  validatetill:any;
  lifelongvalidity: boolean = false;
  showLicense: boolean = false;
  showEducation: boolean = false;
  CountryList:any;
  CountryIds: any;
  statesListId:any;
  selectedCountry:any;
  statesList:any;
  statesIds: any;
  statesId: any;
  selectedUserId: any;
  Date_of_Birth:any; 
  Gender:any;
  Name:any;
  MobileNumber:any;
  Email:any;
  // userdetails: any;
  allproviderlicense: any;
  allEducation:any;
  providerpersonalnMessage:any;
  FullName:any;
  errorLicense:any;
  provide:any;
  message:any;
  licenseExp!:NgForm;
  myForm!:NgForm;
  licensepost!: NgForm;
  errorFile: string = '';
  errorText: string = '';
  fileUpd: File | null = null;
  educationForm!:NgForm;
  // errorFile: string = '';
  errorEducation:any;
  licenseData:any;
  EducationData:any;
  hcpproId: any;
  showEducationupdForm: boolean=false;
  nameofinstitutepro: any;
  FieldofStudyPro: any;
  TypeofDegreePro: any;
  SelectedCountryIdPro: any;
  FromDatePro: any;
  ToDatePro: any;
  dataLoaded:boolean=false;
  dataloading:boolean=false;
  hcppostid: any;
  private hasReloaded = false;
  personalForm!:NgForm ;

  
  // displayName='Note';
  fileTypeError: boolean = false;
  selectedImage: any;
  selectedUserProfile:any | null = 'null';
  studentPhoto:any | null = 'null';
  // message: any;
  signofParent:any;
  lstDtofSignCopy:any;
  typurName:any;
  standardClass:any;
  gurdianOf:any;
  submittedDt:any;
  placeof:any;
  terms:boolean=false;
  data: any;
  picIdpro: any;
  picId: any;
  errorMessage: any;
  minDate: string;
  maxDate: string;
  notedates:any;


 

  digitalSignImageUrl: string | null = null;
  studentPhotoImageUrl: string | null = null;

  policies:any;
  licenseDetails: any;
  educationdoc: any;
  Upload_certificate: any;
  personalupdateFom: any;
  fullprofilePath: any;
  selectedFileName: any;
  personalPic: string | undefined;
  picerror: any;
  personpicError: any;
  providerlicenseDoc: any;
  providerlicenseupload: any;
  providerEductaionUpload: any;
  providerEductaionUploadDoc: any;
  providerlicenseDocName: string | undefined;
  errorEducationDoc: any;
  providerEductaionUploadName: string | undefined;
  consentForm: any;
  errorConsent: any;
  errorNoteImage: any;
  Upload_Your_Sign: any;
  providerlicenseDocument: any;
  providerEductaionUploadDocument: any;
  noteError: any;
  identificationForm!: NgForm;
  newprovidenationality:any;
  newprovideemiratesid:any
  newprovidePassport:any;
  providelastname:any;
  providemidlle:any;
  newprovideType:any;
  provideType:any;
  providecategoryType:any;
  providecategoryTypeOther:any;
  sbForm:any;
  Specialization:any;
  updSpecialization:any;
  providepostcategoryType:any;
  providepostcategoryTypeOther:any;
  providePostmidlle:any;
  providepostlastname:any;
  postLicID: any;
  noEducationData:boolean=false;
  addLicnesemessage: any;
  addEducationmessage:any;
  noLicenseData: any;
  Issued_Date: any;
constructor(private routes:Router,private nivishservice:SuperadminService,private route: ActivatedRoute,private formBuilder: FormBuilder,private datePipe: DatePipe

){
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
this.submittedDt = `${year}-${month}-${day}`;
this.minDate = this.submittedDt; // To restrict to the current date or later
this.maxDate = this.submittedDt;  // To restrict to the current date or earlier


    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const yearToday = today.getFullYear();
    const monthToday = (today.getMonth() + 1).toString().padStart(2, '0');
    const dayToday = today.getDate().toString().padStart(2, '0');
    this.notedates = `${yearToday}-${monthToday}-${dayToday}`;
    
    const yearNextWeek = nextWeek.getFullYear();
    const monthNextWeek = (nextWeek.getMonth() + 1).toString().padStart(2, '0');
    const dayNextWeek = nextWeek.getDate().toString().padStart(2, '0');
    this.notedates = `${yearNextWeek}-${monthNextWeek}-${dayNextWeek}`;
    
    this.minDate = today.toISOString().split('T')[0]; // To restrict to the current date or later
    this.maxDate = this.notedates;
    
    
}

 ngOnInit(){
  
  const providerId = localStorage.getItem('selctedproviderId');
    // console.log(providerId,"noteproid")
    const hcpproId=localStorage.getItem('hcpproId');
    // console.log(hcpproId,"hcpid for note")
  // this.reloadPage();
  // if (!this.hasReloaded) {
  //   // Trigger the reload
  //   location.reload();
    
  //   // Set the flag to true to prevent further reloads
  //   this.hasReloaded = true;
  // }
  this.fetchCountry();
        this.getCountry();
          

  
   
        // console.log('Selected User ID:', this.selectedUserId); 
       
        // localStorage.removeItem('updRegId');
        const updRegId= localStorage.getItem('updRegId');
        // console.log(updRegId,'updRegId');
        if(updRegId){
          this.sectionCompletion.presonal = true;

          this.sectionget();
          this.getlicenseByid();
          this.getEducationById();
        }else{
          localStorage.removeItem('updRegId');
          this.fetchCountry();
          this.getCountry();
          this.provideposttemplate();
          this.sectionCompletion.presonal = true;
        }
        // Call functions only if 'id' is present
        
        
    
       

        // console.log('ID not found in queryParams. Functions skipped.');
        
        // Handle if the 'id' is not available in queryParams
        // For example, show an error message or perform an alternative action.
       
   

 
  // this.getAllLicense();
  // this.getallEducation();
  
  // const providerId = localStorage.getItem('providerId');
  // console.log(providerId,"kiran")
  // this.selectedUserId = params['id'];
  // console.log(this.selectedUserId,'kishore')

  
 }
 
 provideposttemplate(){
  this.displayName='presonalPost';
  this.sectionCompletion.presonal = true;

 }
  selectMale() {
    this.selectedGender = 'Male';
  }
  reloadPage() {
    location.reload();
  }
  selectFemale() {
    this.selectedGender = "Female";
    
  }


eductn(){
  this.displayName='Education';
}
closeEducationupd(){
  this.showEducationupdForm=false;
}


// licensePost(){

// }
// providernote(){
//   this.routes.navigate(['/providernote']);
// }

sectionCompletion = {
  presonal: false,
  License: false,
  Education: false,
  Note: false,
  identification:false
 
}
formatDate(date: string | Date): string {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
presonal(){
  const updRegId= localStorage.getItem('updRegId');
  // console.log(updRegId,"previous");
  if(updRegId){

    this.displayName='presonal';
    this.sectionget();
    this.sectionCompletion.presonal = true;
  }else{
    localStorage.removeItem('updRegId');
          this.fetchCountry();
          this.getCountry();
          this.provideposttemplate();
          this.sectionCompletion.presonal = true;
  }
  
}
License(){
  this.displayName='License';
  this.sectionCompletion.License = true;
}
sidebarLicense(){
  // this.getlicenseByid(() => {

  //   if (this.noLicenseData) { 
  //     this.addLicnesemessage = 'Add some license details';
  //   }
  //   else{
  //     this.displayName='License';
  //     this.sectionCompletion.License = true;
  //   }
  // });
  this.displayName='License';
  this.sectionCompletion.License = true;
}
sidebarEductaion(){
  this.getEducationById(() => {

    if (this.noEducationData) { // Assuming this.noEducationData is set to true by getEducationById if no data
      this.addEducationmessage = 'Add some Education details';
    }
    else{
      this.displayName='Education';
      this.sectionCompletion.Education = true;
    }
  })
}
proEducation(){
  
  this.displayName='Education';
  this.sectionCompletion.Education = true;
}
Note(){
  this.getEducationById(() => {

    if (this.noEducationData) { // Assuming this.noEducationData is set to true by getEducationById if no data
      this.addEducationmessage = 'Add some Education details';
    }
    else{
      this.displayName='Note';
      this.sectionCompletion.Note = true;
    }
  })
  
 
}


closeTerms(){
  this.showLicense=false;
}
openLicense(){
  this.showLicense=true;
}
openEducation(){
  this.showEducation=true
}

closeEducation() {
  this.showEducation = false;
}
closeLicense(){
  this.showLicense = false;
}


selectedTab: string = 'HCP'; 

selectTab(tab: string) {
  this.selectedTab = tab;
}


 ///////////////////////////////////////////education///////////////////////////
// EducationPost(){
//   const userData ={
//     HcpId: this.myId,Name_of_institute:this.nameofinstitute,
//     Provider:this.num,
    
//     Type_of_degree:this.TypeofDegree,
//     Filed_of_study:this.FieldofStudy,
//     Country:this.SelectedCountryId,
//     from_Date:this.FromDate,
//     to_Date:this.ToDate,
//     Upload_certificate:this.UploadCertificate.toString()

//   };


//   console.log(userData); 

//   this.nivishservice.providerEducation(userData).subscribe(
//     (data: any) => {
//       console.log(data);

//       if (data['Status'] === 200) {
//         this.showEducation=false;
//         // this.providerEducationMessage = ' successful';
        
//       } else {
//         // this.providerEducationMessage = ' failed';
//       }
//     },
//     (error: any) => {
//       console.error(error);
//       // this.providerEducationMessage = 'An error occurred';
//     }
//   );
// }
// license

//  LicensePost(){
//   console.log('Invoking LicensePost function...');

//   // Log variables to verify their values
//   // console.log('myId:', this.myId);
//   // console.log('num:', this.num);

//   const Data ={
//     HcpId: this.myId,
//     Provider:this.num,
//     Category:this.selectedCategory,
//     Category_Others:this.selectedCategoryothers,
//     License_Authority:this.LicenseAuthority,
//     License_Authority_others:this.LicenseAuthorityother,
//     License_Number:this.Licensenumber,
//     State:this.SelectedstatesId,
//     Country:this.SelectedCountryId,
//     Issued_Date:this.issueddate,
//     Validate_till:this.validatetill,
//     Life_long_till:this.lifelongvalidity,
//     Upload_certificate:this.UploadCertificate

//   };

//   console.log('License Data:', Data);

//   this.nivishservice.providerLicense(Data).subscribe(
//     (data: any) => {
//       console.log(data);

//       if (data['Status'] === 200) {
//         this.showLicense=false;
        
        
//       } else {
       
//       }
//     },
//     (error: any) => {
//       console.error(error);
      
//     }
//   );
// }

 

onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement?.files) {
    const file = inputElement.files[0];
    this.fileUpd = file;
    this.Education.Upload_certificate = file.name;
  }
  else {
    // No file selected, reset file-related information
    this.fileUpd = null;
    this.Education.Upload_certificate = ''; // or set it to null, depending on your needs
  }
}
ondocumentUploads(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    this.providerlicenseDoc = file;
    this.providerlicenseupload=file;
    this.providerEductaionUpload=file;
    this.providerEductaionUploadDoc=file;
    this.fileTypeError = false;

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
      // this.studentPhotoImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    this.selectedFileName = '';
    this.selectedImage = '/assets/images/profilepicture.png';
    // this.studentPhotoImageUrl = '/assets/images/profilepicture.png';
  }
}
// Remove the duplicate declaration
Education: { Upload_certificate: string } = { Upload_certificate: '' };

sectionget() {
  
  const hcppostid = this.hcppostid;
  // console.log(hcppostid, "gethcpost");
  const updRegId= localStorage.getItem('updRegId');

  this.nivishservice.personalhcpgetbyid(updRegId).subscribe(
    (data: any) => {
      console.log('API Response:', data);
      this.userdetails = data;

      if (this.userdetails && this.userdetails.Result && this.userdetails.Result.length > 0) {
        console.log('Result Array:', this.userdetails.Result);
        const firstResult = this.userdetails.Result[0];

        this.provideFullName = firstResult.First_Name || '';
        this.providemidlle = firstResult.Middle_Name || '';
        this.providelastname = firstResult.Last_Name || '';
        this.provideDateOfBirth = firstResult.Date_of_Birth || '';
        this.provideMobileNumber = firstResult.Registered_MobileNumber || '';
        this.provideEmail = firstResult.Registered_Email || '';
        this.provideType = firstResult.Type || '';
        this.providecategoryType=firstResult.Category||'';
        this.selectedGender = firstResult.Gender || '';
        this.newprovidenationality=firstResult.Nationality  || '',
        this.newprovideemiratesid=firstResult.Emirates_Id || '',
        this.newprovidePassport=firstResult.Passport || '',
        this.studentPhotoImageUrl=firstResult.Upload_Your_Photo;
        if (this.studentPhotoImageUrl) {
          const filename = new URL(this.studentPhotoImageUrl).pathname.split('/').pop();
          this.personalPic = filename;
          console.log( this.personalPic,"image name");
        } else {
          console.warn('studentPhotoImageUrl is null or undefined.');
          this.personalPic = ''; 
        }
        console.log(this.studentPhotoImageUrl,"upload");
        console.log(firstResult,'data');
        // console.log('Result[0] Properties:', Object.keys(firstResult));
        this.getlicenseExperience();
      } else {
        // console.log('Result is undefined, null, or empty array.');
      }

      // console.log('UserDetails:', this.userdetails, this.selectedGender);
    },
    (error: any) => {
      console.error(error);
    }
  );
}


sectionpostget() {
  const hcppostid=this.hcppostid

  this.nivishservice.getbyid(hcppostid).subscribe(
    (data: any) => {
      // console.log('API Response:', data);
      this.userdetails = data;

      if (this.userdetails && this.userdetails.Result && this.userdetails.Result.length > 0) {
        // console.log('Result Array:', this.userdetails.Result);
        this.newprovideEmail = this.userdetails.Result[0].FullName || '';
        this.newprovideEmail = this.userdetails.Result[0].Date_of_Birth || '';
        this.newprovideEmail = this.userdetails.Result[0].MobileNumber || '';
        this.newprovideEmail = this.userdetails.Result[0].Email || '';
        this.selectedTab = this.userdetails.Result[0].Type||'';
        this.selectedGender = this.userdetails.Result[0].Gender || '';
        
      }
      // console.log('Result[0] Properties:', Object.keys(this.userdetails.Result[0]));

      // console.log('UserDetails:', this.userdetails,this.selectedGender);
    },
    (error: any) => {
      console.error(error);
    }
  );
}
// updateData() {
//   const updatedData = {
//     Name: this.Name,
//     Date_of_Birth: this.Date_of_Birth,
//     MobileNumber: this.MobileNumber,
//     Email: this.Email,
//   }
//   this.nivishservice.updateprovider(this.selectedUserId, updatedData).subscribe(
//     (response: any) => {
//       console.log('Update Response:', response);
      
//     },
//     (error: any) => {
//       console.error('Update Error:', error);

//     }
//   );
// }



fetchCountry() {
  this.nivishservice.getallcountry().subscribe(response => {
    if (response && response.Result) {
      this.CountryList = response.Result;
      // console.log(this.CountryList); 

    }
  });
}
onCountryChange(event: any) {
  this.newprovidenationality = event;
  // console.log(this.SelectedCountryId,"selected countrys")
  this.getStatesForCountry(this.newprovidenationality);
}



getStatesForCountry(selectedCountryId: any) {
  this.nivishservice.getstate(selectedCountryId).subscribe(
    (response: any) => {
      if (response && response.Result) {
        this.statesList = response.Result;
        // console.log(this.statesList,"get states")
      }
    },
    (error: any) => {
      // Handle errors if any
    }
  );
}
onstateChange(event:any){
  this.SelectedstatesId=event;
  // console.log('Selected state ID:', this.SelectedstatesId);
}
// getAllLicense(){
//   this.nivishservice.licensehcpget().subscribe(
//     (data: any) => {
//       this.allproviderlicense = data.Result;
//             console.log(this.allproviderlicense,"sdfghjk");
//     },
//     (error: any) => {
//       console.error('Error fetching user data:', error);
//     }
//   );
// }

// getallEducation(){
//   this.nivishservice.educationhcpget().subscribe(
//     (data: any) => {
//       this.allEducation = data.Result;
//             console.log(this.allEducation,"rwerweert");
//     },
//     (error: any) => {
//       console.error('Error fetching user data:', error);
//     }
//   );
// }



handleRadioChange() {
 
  if (this.lifelongvalidity) {
    this.issueddate = null;
    this.validatetill = null;
    console.log(this.validatetill,this.issueddate)
  } 
  else {
    this.issueddate = ''; 
    this.validatetill = ''; 
  }
}


hasDataInDateFields() {
  return  !!this.validatetill;
}




// PersonalInformationPost() {
//   const user = this.userdetails[0]; 
//   if (user) {
    
//     const users = {
//       FullName: user.Name,
//       Gender: user.Gender,
//       Date_of_Birth: user.Date_of_Birth,
//       MobileNumber: user.MobileNumber,
//       Email: user.Email,
//     };

//     if (user.id) {
     
//       this.nivishservice.updateprovider(user.id, users).subscribe(
//         (data: any) => {
//           console.log('pavan',data);
//           if (data['Status'] === 200) {
//             this.providerpersonalnMessage = 'Update successful';
//           } else {
           
//           }
//         },
//         (error: any) => {
//           console.error(error);
//         }
//       );
//     } else {
//       //
//       this.nivishservice.personamaster(users).subscribe(
//         (data: any) => {
//           console.log('jjggh',data);
//           if (data['Status'] === 200) {
//             this.providerpersonalnMessage = 'Post successful';
//           } else {
           
//           }
//         },
//         (error: any) => {
//           console.error(error);
//         }
//       );
//     }
//   }
// }

  
 
// providermasterhcpupd(){
 
//   const tagUpd={
//     FullName:this.provideFullName,
//     Date_of_Birth: this.provideDateOfBirth,
//     Gender:this.selectedGender,
//     MobileNumber:this.provideMobileNumber,
//     Email:this.provideEmail,
//     Tag:false,
//   }
//   this.nivishservice.hcpmasterUpdate(this.selectedUserId,tagUpd).subscribe(
//     (data:any)=>{
//       if(data["Status"]===200){
//         this.message='hcpupdated';
     
//       }

//     })
// }

identificationUpdate(form:NgForm) {
  this.identificationForm=form;
  if (form.invalid) {
    this.errorText = 'Please fill in all the required details';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorText = ''; // Clear the general error message if the entire form is valid
    this.identificationdataupdate(form.value);
  }
}
identificationdataupdate(idfydata:any){


  const updRegId= localStorage.getItem('updRegId');

  const providerId = localStorage.getItem('providerId');
  const identification={
    Nationality: this.newprovidenationality,
    Emirates_Id:this.newprovideemiratesid,
    Passport: this.newprovidePassport
  }
 
  console.log(identification, "projectv");
  this.nivishservice.hcpIdentificationUpdate(updRegId,identification).subscribe(
    (data:any) => {
      if(data['Status']===200){
        this.addLicnesemessage='';
        this.License();
      }
    }
  )
  // // this.nivishservice.personalhcpUpdate(updRegId,userspost).subscribe(
  // //   (data: any) => {
      
  // //     if (data['Status'] === 200) {
  // //       const hcpproId = data.Result.HCPID;
  // //       // console.log(hcpproId, 'babu');

  // //       localStorage.setItem('hcpproId', hcpproId.toString());
  // //       // console.log("proid", hcpproId);

  // //       this.message = 'person posted';
  // //       this.hcpproId = hcpproId;
  // //       this.providerstudentpicUpd();

      
  // //       this.getlicenseByid();
  // //       this.getEducationById();
  // //           } else {

  // //     }
  // //     // console.log(data, "power");

  // //   },
  // //   (error: any) => {
  // //     console.error(error);
  // //   }
  // );
}
PersonalInformationUpdate(form:NgForm) {
  console.log("clicked");
  this.personalupdateFom=form;
  if (form.invalid) {
    this.errorText = 'Please fill in all the required details';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorText = ''; // Clear the general error message if the entire form is valid
    this.personaldataupdate(form.value);
  }
}
personaldataupdate(pdata:any){

  const provideDateOfBirth = this.formatDate(this.provideDateOfBirth);

  const issueddate = this.formatDate(this.issueddate);
  const updRegId= localStorage.getItem('updRegId');
  console.log(updRegId,"hcpid");
  const providerId = localStorage.getItem('selctedproviderId');
  console.log('jaihind', providerId);
  if (providerId) {
    console.log('update', providerId);

    const numericProviderId = parseInt(providerId.trim(), 10);
  
   const userspost = {
      ProviderID: numericProviderId || providerId, // Use numeric version if possible, fallback to string
      First_Name: this.provideFullName,
      Middle_Name: this.providemidlle,
      Last_Name: this.providelastname,
      Category: this.providecategoryType,
      Date_of_Birth: provideDateOfBirth,
      Registered_Email: this.provideEmail,
      Registered_MobileNumber: this.provideMobileNumber,
      // Type: this.selectedTab,
      Gender: this.selectedGender,
    };
  // const userspost = {
  //   ProviderID: providerId as string,
  //   First_Name: this.provideFullName,
    

    
  // };
 
  // console.log(userspost, "projectv");

  this.nivishservice.personalhcpUpdate(updRegId,userspost).subscribe(
    (data: any) => {
      
      if (data['Status'] === 200) {
        console.log(data,"providees");
        // const hcpproId = data.Result.HCPID;
        // console.log(hcpproId, 'babu');

        // localStorage.setItem('hcpproId', hcpproId.toString());
        // console.log("proid", hcpproId);

        this.message = 'person posted';
        // this.hcpproId = hcpproId;
        this.providerstudentpicUpd();

      
        this.getlicenseByid();
        this.getEducationById();
            } else {

      }
      // console.log(data, "power");

    },
    (error: any) => {
      console.error(error);
    }
  );
}}
personalupdates(form: NgForm) {
  this.personalForm=form;
  
  if (form.invalid) {
    this.errorText = 'Please fill in all the required details';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorText = ''; // Clear the general error message if the entire form is valid
    this.PersonalInformationPost(form.value);
  }
}

PersonalInformationPost(ppdData:any){
  const formattedDateOfBirth = this.formatDate(this.newprovideDateOfBirth);

  const providerId = localStorage.getItem('selctedproviderId');
  console.log('jaihind', providerId);
 const pIpost={
  ProviderID:providerId,
  First_Name:this.newprovideFullName,
  Middle_Name:this.providePostmidlle,
  Last_Name:this.providepostlastname,
  Category:this.providepostcategoryType,
  Date_of_Birth:formattedDateOfBirth,
  Registered_MobileNumber:this.newprovideMobileNumber,
  Registered_Email:this.newprovideEmail,
  Type:this.newprovideType,
  Gender:this.selectedGender,
  
  

 }
 console.log(pIpost,'personalpost');
 this.nivishservice.personamaster(pIpost).subscribe(
  (data:any)=>{
    if(data['Status']===200){
      this.message='success post';
      const updRegId = data.Result.HCPID
      // console.log(updRegId,'updId');
      localStorage.setItem('updRegId', updRegId.toString());
      this.sectionCompletion.presonal = true;

     
      this.providerpostpicture();

      this.getlicenseByid();
    }
  }
)
}

licenseExpPost(form: NgForm) {
  this.licensepost = form;
  
 

  if (form.invalid) {
    this.errorLicense = 'Please fill in the License Experience';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorLicense = ''; 
  }

  if (form.valid) {
    this.saveLicenseExpPost(form.value);
  }
}
saveLicenseExpPost(licenseD:any){
  const updRegId= localStorage.getItem('updRegId');

  const hcppostid=this.hcppostid
  // console.log(hcppostid,"zzz")
  const hcpPro=this.hcpproId
  // console.log("health",hcpPro)
  const providerId = localStorage.getItem('selctedproviderId');
  // console.log(providerId)
  const liExp={
    HCPID:updRegId,
    ProviderID:providerId,
    Total_Experience_Years:this.Years,
    Total_Experience_Months:this.Months,
    Sub_Contracted_Form:this.sbForm,
  }
  // console.log(liExp)
  this.nivishservice.hcpProviderExpupd(updRegId,liExp).subscribe(
    (data:any)=>{
      if(data['Status']===200){
       
        this.message='experience Updated';
        this.addEducationmessage='';
        // this.proEducation();
        this.getlicenseByid(() => {

          if (this.noLicenseData) { // Assuming this.noEducationData is set to true by getEducationById if no data
            this.addLicnesemessage = 'Add some license details';
          }
          else{
            this.proEducation();
          }
        });
        
        

      }
    })
}
getlicenseExperience() {
  const updRegId = localStorage.getItem('updRegId');

  this.nivishservice.hcplicenseExpGet(updRegId).subscribe((data: any) => {
    console.log(data,'getlicenseexp')
    this.Years = data.Result[0].Total_Experience_Years;
    this.Months = data.Result[0].Total_Experience_Months;
    this.sbForm = data.Result[0].Sub_Contracted_Form
  });
}

licensePost(form: NgForm) {

  const updRegId= localStorage.getItem('updRegId');

  const providerId = localStorage.getItem('selctedproviderId');
  const hcpPro=this.hcpproId
  const hcppostid=this.hcppostid

  if (this.providerlicenseupload) {
    
    const uploadCertificate = this.providerlicenseupload.toString();
    const validatetill = this.formatDate(this.validatetill);

    const issueddate = this.formatDate(this.issueddate);

    const LicenseData = {
      HCPID: updRegId,
      ProviderID: providerId,
      Category: this.selectedCategory,
      Category_Others: this.selectedCategoryothers,
      License_Authority: this.LicenseAuthority,
      License_Authority_others: this.LicenseAuthorityother,
      License_Number: this.Licensenumber,
      State: this.SelectedstatesId,
      Country: this.SelectedCountryId,
      Issued_Date: issueddate,
      Validate_till: validatetill||null,
      Life_long_till: this.lifelongvalidity? this.lifelongvalidity:null,
      Upload_certificate: uploadCertificate
    };
    // console.log('trail',LicenseData)
  }
    
  this.myForm = form;
  if (form.invalid) {
    this.errorText = 'Please fill in all the required details';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorText = '';
  }

 
  if (form.valid) {
    this.saveLicensePost(form.value);
    // form.resetForm();

  }
}


saveLicensePost(licenseData:any) {
  const validatetill = this.formatDate(this.validatetill);

  const issueddate = this.formatDate(this.issueddate);
  const updRegId = localStorage.getItem('updRegId');
  const providerId = localStorage.getItem('selctedproviderId');
  if (!this.providerlicenseupload) {
    this.errorFile = 'Upload certificate is required.';
   
    return; 
  }

  const licUpd=
  {
    
    HCPID: updRegId,
    ProviderID: providerId,
    License_Authority: this.LicenseAuthority,
    License_Authority_others: this.LicenseAuthorityother || '',
    License_Number: this.Licensenumber,
    Specialization: this.Specialization,
    Issued_Date:issueddate ,
    Validate_till:this.lifelongvalidity ? '' : (validatetill ? validatetill.toString() : ''),
    Life_long_till: this.lifelongvalidity ? this.lifelongvalidity.toString() : ''
  }

  // const formData = new FormData();

  // formData.append('HCPID', updRegId??'');
  // formData.append('ProviderID', providerId??'');
  // // formData.append('Category', this.selectedCategory);
  // // formData.append('Category_Others', this.selectedCategoryothers || '');
  // formData.append('License_Authority', this.LicenseAuthority);

  // formData.append('License_Authority', this.LicenseAuthority);
  // formData.append('License_Authority_others', this.LicenseAuthorityother || '');
  // formData.append('License_Number', this.Licensenumber);
  // // formData.append('State', this.SelectedstatesId);
  // // formData.append('Country', this.SelectedCountryId);
  // formData.append('Issued_Date', this.issueddate);
  // formData.append(
  //   'Validate_till',
  //   this.lifelongvalidity ? '' : (this.validatetill ? this.validatetill.toString() : '')
  // );
  // formData.append('Life_long_till', this.lifelongvalidity ? this.lifelongvalidity.toString() : '');

  // if (this.providerlicenseupload) {
  //   const uploadCertificate = this.providerlicenseupload;
  //   formData.append('Upload_certificate', uploadCertificate, 'certificate.pdf');
  // }

  this.nivishservice.providerLicense(licUpd).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
        this.postLicID=data.Result.id;
        this.licdocpost();
      }
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
}

licdocpost(){
    const formData = new FormData();

  if (this.providerlicenseupload) {
    const uploadCertificate = this.providerlicenseupload;
    formData.append('Upload_certificate', uploadCertificate, 'certificate.pdf');
  }
 
    this.nivishservice.hcpLIcenseDocumentUpdated(this.postLicID,formData).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          this.message = 'Updated license';
          this.showLicense = false;
          this.getlicenseByid();
          this.providerlicenseupload = null;
          this.providerlicenseDoc = null;
          this.providerlicenseupload=null;
          this.providerEductaionUpload=null;
          this.providerEductaionUploadDoc=null;
          this.myForm.resetForm();
          this.errorFile = '';

        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );

}

             //////////////////////////////////////////////////////////////////////



educationPost(form: NgForm) {
  this.educationForm = form;
  if (form.controls['file']) {
    if (form.controls['file'].invalid) {
      this.errorFile = 'Please provide a file for upload';
      form.controls['file'].markAsTouched();
    } else {
      this.errorFile = ''; 
    }
  }
  if (form.invalid) {
    this.errorEducation = 'Please fill in all the required details';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorText = ''; 
  }
 
  if (form.valid) {
    this.saveEducationPost(form.value);
   

  }
}
saveEducationPost(educationData: any) {
  const updRegId = localStorage.getItem('updRegId');
  const providerId = localStorage.getItem('selctedproviderId');
  if (!this.providerEductaionUploadDoc) {
    this.errorEducationDoc='Upload certificate is required.';
    return;
  }
  const formData = new FormData();
  const FromDate = this.formatDate(this.FromDate);
  const ToDate = this.formatDate(this.ToDate);
  formData.append('HCPID', updRegId??'');
  formData.append('ProviderID', providerId??'');
  formData.append('Name_of_institute', this.nameofinstitute);
  formData.append('Type_of_degree', this.TypeofDegree);
  formData.append('Filed_of_study', this.FieldofStudy);
  formData.append('Country', this.SelectedCountryId);
  formData.append('from_Date', FromDate);
  formData.append('to_Date', ToDate);

  if (this.providerEductaionUploadDoc) {
    const uploadCertificate = this.providerEductaionUploadDoc;
    formData.append('Upload_certificate', uploadCertificate, 'certificate.pdf');
  }

  this.nivishservice.providerEducation(formData).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
        this.message = 'Education Posted';
        this.showEducation = false;
        this.getEducationById();
        this.educationForm.resetForm();
        this.providerEductaionUploadDoc=null;
        this.providerEductaionUpload=null;
        this.providerlicenseupload=null;
        this.providerlicenseDoc=null;
        this.errorEducationDoc='';
      }
      console.log(this.message);
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
}





getlicenseByid(callback?: () => void) {
  const updRegId= localStorage.getItem('updRegId');

  // const hcpPro = this.hcpproId;
  // const hcpPostId = this.hcppostid;

  // console.log('prasanth', hcpPro, hcpPostId);

  // Check if hcpPro is available, then call hcplicenseget with hcpPro
  
  this.dataLoaded = false;

  this.nivishservice.hcplicenseget(updRegId).subscribe((data: any) => {
    if (data.Result && data.Result.length > 0) {
      this.licenseData = data;
      // console.log(this.licenseData, 'praveen');
      this.dataLoaded = true;
      this.Issued_Date= this.licenseData.Issued_Date
      console.log('this.Issued_Date',this.Issued_Date)
      // this.proEducation();
      this.noLicenseData = false;
      this.addLicnesemessage='';
    }else{
      this.noLicenseData = true;

    }
    if (callback) callback();
    // } else {
    //   // console.log('Empty data received');
    // }
  });
  }
  
  // Check if hcpPostId is available, then call hcplicenseget with hcpPostId
//   if (hcpPostId) {
//     this.nivishservice.hcplicenseget(hcpPostId).subscribe(
//       (data: any) => {
//         this.licenseData = data || {};
//         console.log(this.licenseData, 'praveen');
//         this.dataLoaded = true;
//       }
//     );
//   }
// }
getEducationById(callback?: () => void){
  // const hcpPostId = this.hcppostid;

  // const hcpPro=this.hcpproId
  const updRegId= localStorage.getItem('updRegId');

  this.dataloading = false;

  // const selectedUserId = localStorage.getItem('selectedUserId');
  
  this.nivishservice.hcpEducationGet(updRegId).subscribe((data:any)=>{
    if (data.Result && data.Result.length > 0) {
      this.EducationData=data || {};
      // console.log(this.EducationData,"varsh");
      this.dataloading=true
      this.noEducationData = false;
      this.addEducationmessage='';
    }else{
      this.noEducationData = true;
    }
    if (callback) callback();
  })
}
// if (hcpPostId) {
//     this.nivishservice.hcpEducationGet(hcpPostId).subscribe(
//     (data:any)=>{
//       this.EducationData=data || {};
//       console.log(this.EducationData,"varsh");
//       this.dataloading=true;
//     })
// }
// }
openUpdateForm(licenseId: number) {
  // Set the license ID to fetch details
  this.updateFormLicenseId = licenseId;

  // Set the variable to true to show the update form
  this.showUpdateForm = true;

  // Fetch details based on the license ID and populate the form fields
  this.fetchLicenseDetails(licenseId);
}
fetchLicenseDetails(licenseId:number){
  this.nivishservice.gethcplicence(licenseId).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
        const result = data['Result'][0];
        console.log(result,'licenseget');

        // const provider = result.HcpId ? result.HcpId.Provider : null;
        this.selectedCategorylic = result.Category;
        console.log( this.selectedCategoryotherslic ,"categ");
        this.selectedCategoryotherslic = result.Category_Others;
        this.LicenseAuthoritylic = result.License_Authority;
        this.LicenseAuthorityotherlic = result.License_Authority_others ;
        this.Licensenumberlic = result.License_Number;
        this.updSpecialization= result.Specialization;
        this.SelectedCountryIdlic = result.Country || null;
        const SelectedCountryIdlic=result.Country || null;
        this.fetchCountry();
        this.getStatesForCountry(SelectedCountryIdlic);
        this.SelectedstatesIdlic = result.State || null;
        this.issueddatelic = result.Issued_Date 
        this.validatetilllic = result.Validate_till 
        this.lifelongvaliditylic=result.Life_long_till
        this.providerlicenseDocument = result.Upload_certificate;
        if(this.providerlicenseDocument){
          const filename=new URL(this.providerlicenseDocument).pathname.split('/').pop();
          this.providerlicenseDocName=filename
        }
      
        this.fetchCountry();

        this.onValidityChange();

      
  


        
      }
      // console.log(this.message);
      // console.log(data);
    },
    (error: any) => {
      console.error('Error:', error);
      // Handle the error here (e.g., show an error message to the user)
    }
  );
}
updateproviderLicense(licenseId: number) {
  const validatetill = this.formatDate(this.validatetill);

  const issueddatelic = this.formatDate(this.issueddatelic);
  const validatetilllic = this.formatDate(this.validatetilllic);

  const updatelicensedocument={
    // Category:this.selectedCategorylic,
    // Category_Others:this.selectedCategorylic==='Other'?this.selectedCategoryotherslic||'':null,
    License_Authority:this.LicenseAuthoritylic,
    License_Authority_others:this.LicenseAuthoritylic==='Other'?this.LicenseAuthorityotherlic||'':null,
    License_Number:this.Licensenumberlic,
    Specialization:this.updSpecialization,
    // Country:this.SelectedCountryIdlic,Specialization
    // State:this.SelectedstatesIdlic,
    Issued_Date:issueddatelic,
    Validate_till:this.lifelongvaliditylic?'':validatetilllic||'',
    Life_long_till:this.lifelongvaliditylic?this.lifelongvaliditylic.toString():'',
   
  }

  this.nivishservice.updatehcplicence(this.updateFormLicenseId, updatelicensedocument).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
       
        // this.providerEductaionUploadDoc=null;
        this.updateProviderdocLicense();
      }
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
}
updateProviderdocLicense(){
  if (this.providerlicenseDoc === 'null' || this.providerlicenseDoc === undefined) {
    console.log("Image not provided, using filename:", this.providerlicenseDocName);
  
    if (!this.providerlicenseDocName || this.providerlicenseDocName === '') {
      // this.picerror = 'Pls choose the Image';
     
    } else {
      this.message = 'License updated';
        this.showUpdateForm = false;
        this.getlicenseByid();
        this.providerEductaionUploadDoc=null;
        this.providerEductaionUpload=null;
        this.providerlicenseupload=null;
        this.providerlicenseDoc=null;

    }
  }else {
    const formData = new FormData();
    if (this.providerlicenseDoc) {
      const uploadCertificate = this.providerlicenseDoc;
      formData.append('Upload_certificate', uploadCertificate, 'certificate.pdf');
    }
    this.nivishservice.hcpLIcenseDocumentUpdated(this.updateFormLicenseId,formData).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          this.message = 'License updated';
        this.showUpdateForm = false;
        this.getlicenseByid();
        this.providerEductaionUploadDoc=null;
        this.providerEductaionUpload=null;
        this.providerlicenseupload=null;
        this.providerlicenseDoc=null;

        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
}}
displayPartialUrl(fullUrl: string): string {
  // Set the desired length for the displayed URL
  const maxLength = 30;

  // Check if the URL is longer than the desired length
  if (fullUrl.length > maxLength) {
    // If yes, display a substring of the URL with an ellipsis
    return fullUrl.slice(0, maxLength) + '...';
  } else {
    // If no, display the full URL
    return fullUrl;
  }
}

closeupdLicense(){
  this.showUpdateForm=false;
}
openUpdateEductaionForm(EducationId: number) {
  // Set the license ID to fetch details
  this.updateFormEductaionId = EducationId;

  // Set the variable to true to show the update form
  this.showEducationupdForm = true;

  // Fetch details based on the license ID and populate the form fields
  this.fetchEducationDetails(EducationId);
}
fetchEducationDetails(EducationId:number){
  this.nivishservice.eductaiongethcp(EducationId).subscribe(
    (data:any)=>{
      if(data["Status"]===200){
        const Eductaion= data['Result'][0];
        this.nameofinstitutepro=Eductaion.Name_of_institute,
        this.TypeofDegreePro=Eductaion.Type_of_degree,
        this.FieldofStudyPro=Eductaion.Filed_of_study,
        this.SelectedCountryIdPro=Eductaion.Country,
        this.FromDatePro=Eductaion.from_Date,
        this.ToDatePro=Eductaion.to_Date;
        this.providerEductaionUploadDocument=Eductaion.Upload_certificate;
        if(this.providerEductaionUploadDocument){
          const filename=new URL(this.providerEductaionUploadDocument).pathname.split('/').pop();
          this.providerEductaionUploadName=filename
        }
        
        console.log(this.Upload_certificate,"upd certificate");
        this.getCountry();

      }
    })
}
getCountry() {
  this.nivishservice.getallcountry().subscribe((response: { Result: any[]; }) => {
    if (response && response.Result) {
      this.countries = response.Result.map(item => ({ id: item.id, name: item.Country }));
      // console.log(this.countries);
    }
  });
}
educationupd(EducationId: number) {

  const FromDatePro = this.formatDate(this.FromDatePro);
  const ToDatePro = this.formatDate(this.ToDatePro);

  // const formData = new FormData();

  // formData.append('Name_of_institute', this.nameofinstitutepro);
  // formData.append('Type_of_degree', this.TypeofDegreePro);
  // formData.append('Filed_of_study', this.FieldofStudyPro);
  // formData.append('Country', this.SelectedCountryIdPro);
  // formData.append('from_Date', this.FromDatePro);
  // formData.append('to_Date', this.ToDatePro);
  const providerEducationDescpUpdate={
    Name_of_institute:this.nameofinstitutepro,
    Type_of_degree:this.TypeofDegreePro,
    Filed_of_study:this.FieldofStudyPro,
    Country:this.SelectedCountryIdPro,
    from_Date:FromDatePro,
    to_Date:ToDatePro,
  }

  

  this.nivishservice.educationhcpUpdate(this.updateFormEductaionId, providerEducationDescpUpdate).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
       this.providerDocumentEduUpdate();
      }
      // console.log(data, "education data");
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
}
onKeyPress(event: KeyboardEvent) {
  // Allow only numeric input
  const allowedChars = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!allowedChars.test(inputChar)) {
    event.preventDefault();
  }
}
providerDocumentEduUpdate(){
  if (this.providerEductaionUpload === 'null' || this.providerEductaionUpload === undefined) {
    console.log("Image not provided, using filename:", this.providerEductaionUploadName);
  
    if (!this.providerEductaionUploadName || this.providerEductaionUploadName === '') {
      // this.picerror = 'Pls choose the Image';
     
    } else {
      this.message = 'Updated education';
      this.showEducationupdForm = false;
      this.getEducationById();
      this.providerEductaionUploadDoc=null;
      this.providerEductaionUpload=null;
      this.providerlicenseupload=null;
      this.providerlicenseDoc=null;
    }
  }else {
    const formData = new FormData();

    if (this.providerEductaionUpload) {
    const uploadCertificate = this.providerEductaionUpload;
    formData.append('Upload_certificate', uploadCertificate, 'certificate.pdf');
  }
  this.nivishservice.hcpEductaionDocumentUpdate(this.updateFormEductaionId, formData).subscribe(
    (data: any) => {
      if (data['Status'] === 200) {
        this.message = 'Updated education';
        this.showEducationupdForm = false;
        this.getEducationById();
        this.providerEductaionUploadDoc=null;
        this.providerEductaionUpload=null;
        this.providerlicenseupload=null;
        this.providerlicenseDoc=null;
      }
      // console.log(data, "education data");
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
}
}
getFormattedMaxDate(): string {
  const currentDate = new Date();
  const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
  return formattedDate.toISOString().split('T')[0];
}


onProfilePictureSelected(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    this.Upload_Your_Sign=file
    this.selectedUserProfile = file;
    this.fileTypeError = false;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
      // Update digitalSignImageUrl with the selected image URL
      this.digitalSignImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    this.selectedImage = '/assets/images/profilepicture.png';
    // Set digitalSignImageUrl to a default image URL
    this.digitalSignImageUrl = '/assets/images/profilepicture.png';
  }
}



// onStudentPhotoSelected(event: any) {
//   const file: File = event.target.files[0];

//   if (file) {
//     this.studentPhoto = file;
//     this.fileTypeError = false;

//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.selectedImage = e.target.result;

//       this.studentPhotoImageUrl = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   } else {
//     this.fileTypeError = true;
//     this.selectedImage = '/assets/images/profilepicture.png';

//     this.studentPhotoImageUrl = '/assets/images/profilepicture.png';
//   }
// }
onStudentPhotoSelected(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    this.studentPhoto = file;
    this.fileTypeError = false;

    // Set the selected file name
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
      this.studentPhotoImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    this.selectedFileName = '';
    this.selectedImage = '/assets/images/profilepicture.png';
    this.studentPhotoImageUrl = '/assets/images/profilepicture.png';
  }
}
isPDF(url: string | null | undefined): boolean {
  if (!url) {
    return false; // If the URL is null or undefined, return false
  }
  
  const extension = url.split('?')[0].split('.').pop();
  return extension?.toLowerCase() === 'pdf';
}
// onStudentPhotoSelected(event: any) {
//   const files: FileList = event.target.files;

//   if (files && files.length > 0) {
//     // Extract filename and display it
//     this.studentPhoto = files[0].name;

//     // Extract full path and display it (optional, using webkitRelativePath for browser compatibility)
//     this.fullprofilePath = files[0].webkitRelativePath || '';

//     // Handle file upload logic here

//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.selectedImage = e.target.result;
//       this.studentPhotoImageUrl = e.target.result;
//     };
//     reader.readAsDataURL(files[0]);
//   } else {
//     // Reset properties if no file is selected
//     this.studentPhoto = '';
//     this.fullprofilePath = '';
//     this.selectedImage = '/assets/images/profilepicture.png';
//   }
// }
// onDigitalSignSelected(event: any) {
//   const selectedFile = event.target.files[0];
//   if (selectedFile) {
//     // Handle the digital sign file selection
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.digitalSignImageUrl = e.target.result;
//     };
//     reader.readAsDataURL(selectedFile);
//   }
// }

hcpnotesubmit(form:NgForm){
  this.consentForm = form;
  
 

  if (form.invalid) {
    this.errorConsent = 'Please fill in the required Details.';
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  } else {
    this.errorConsent = ''; 
  }

  if (form.valid) {
    this.notediscription(form.value);

  }


}
onDateChange(event: any): void {
  const inputDate = event.target.value;
  this.submittedDt = this.formatDateString(inputDate);
}
notediscription(noteData:any){
const verId = localStorage.getItem('verid');
const updRegId= localStorage.getItem('updRegId');

const hcpproId=localStorage.getItem('hcpproId');
const providerId = localStorage.getItem('selctedproviderId');
const note={
  HCPID:updRegId,
  ProviderID:providerId,
  // Last_date_signed_copy_of_form:this.lstDtofSignCopy,
  Full_Name:this.typurName,
 
  Signature:this.signofformFilledby,
  Submitted_date:this.submittedDt,
  Place:this.placeof,
  Accepted:this.terms,
  // Terms_and_conditions:this.terms,
}
// console.log(note,"note");
this.nivishservice.hcpnote(note).subscribe(
  (data: any) => {
    if (data && data.Result) {
     
       this.picId = data.Result.id;
      // console.log(this.picId,"picid")
      this.note();
    } else {
    }
  },
  (error) => {
    
    console.error('Error occurred:', error);
    if (error instanceof HttpErrorResponse) {
      this.noteError = error.error.Message || 'An error occurred'; 
    } else {
      this.noteError = 'An error occurred'; 
    }  });
}
note() {
const picIdnote =this.picId;
// console.log(picIdnote,"idssss");
if(!this.Upload_Your_Sign){
  this.errorNoteImage='Upload sign is required.';
  return;
}

const digitalSignFormData = new FormData();
digitalSignFormData.append('id', picIdnote);
digitalSignFormData.append('Upload_Your_Sign', this.Upload_Your_Sign);
// digitalSignFormData.append('Upload_Your_Photo', this.studentPhoto);
// console.log(digitalSignFormData, "narayansss");

this.nivishservice.updateProviderNote(picIdnote, digitalSignFormData).subscribe(
  (data
    : any) => {
    console.log(data,"sdfghjnkesdfghjk");
    if (data.body && data.body.Status === 200) {
      this.message = 'note';  
      console.log(data,"swaroop");
      
this.routes.navigate(['/idcard']); 
 

    
     
    
    }
    // console.log(this.message,'mmmmmmmmm');
    // console.log(data,'dddddddddddd');
  },
  (error: any) => {
    console.error('Error:', error);
    // Handle the error here (e.g., show an error message to the user)
  }
);
}
identification(){
  this.displayName='Identification';
  this.sectionCompletion.identification = true;

}

providerstudentpicUpd() {
  const updRegId = localStorage.getItem('updRegId');
  if (!updRegId) {
    console.log('userId not found in local storage.');
    return;
  }
  if (this.studentPhoto === 'null' || this.studentPhoto === undefined || this.studentPhoto===null) {
    console.log("Image not provided, using filename:", this.personalPic);
  
    if (!this.personalPic || this.personalPic === '') {
      this.picerror = 'Pls choose the Image';
    } else {
      // Redirect to sectionB
      this.identification();
    }
  }else {
     const photonoteFormData = new FormData();
  photonoteFormData.append('ProviderID', updRegId);
  
  photonoteFormData.append('Upload_Your_Photo', this.studentPhoto);
  console.log(photonoteFormData, "narayansss",this.studentPhoto);
  

  this.nivishservice.hcpupdateNote(updRegId, photonoteFormData).subscribe(
    (data: any) => {
      if (data['Status'] === 200)  {
        this.message = 'note';
        this.identification();
   
      } else {
        console.error('Error updating note:', data);
        if (data['HasError'] && data['Message']) {
          console.error('Server error message:', data['Message']);
        }
      }
      console.log(this.message,'mmmmmmmmm');
      console.log(data,'dddddddddddd');
    },
    (error: any) => {
      console.error('Error updating note:', error);
      if (error.status === 400) {
        console.error('Record not found. The specified ID might be incorrect.');
      }
      // Handle the error here (e.g., show an error message to the user)
    }
  );
}
}


providerpostpicture() {
  const updRegId= localStorage.getItem('updRegId');

  if (!updRegId) {
    console.log('userId not found in local storage.');
    return;
  }

  if (this.studentPhoto === 'null' || this.studentPhoto === undefined) {
    console.log("Image not provided, using filename:", this.personalPic);
    this.personpicError='Provide image'
   } else {
      // Redirect to sectionB
      
    

  const photonoteFormData = new FormData();

  photonoteFormData.append('HCPID', updRegId);
  
  
  
  photonoteFormData.append('Upload_Your_Photo', this.studentPhoto);
  console.log(photonoteFormData, "narayansss",this.studentPhoto);
  

  this.nivishservice.hcpupdateNote(updRegId, photonoteFormData).subscribe(
    (data: any) => {
      if (data['Status'] === 200)  {
        this.message = 'note';
        this.identification();
   
      } else {
        console.error('Error updating note:', data);
        if (data['HasError'] && data['Message']) {
          console.error('Server error message:', data['Message']);
        }
      }
      console.log(this.message,'mmmmmmmmm');
      console.log(data,'dddddddddddd');
    },
    (error: any) => {
      console.error('Error updating note:', error);
      if (error.status === 400) {
        console.error('Record not found. The specified ID might be incorrect.');
      }
      // Handle the error here (e.g., show an error message to the user)
    }
  );
}
  }


// onDigitalSignSelected(event: any) {
//   const selectedFile = event.target.files[0];
//   if (selectedFile) {
  
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.digitalSignImageUrl = e.target.result;
//     };
//     reader.readAsDataURL(selectedFile);
//   }
// }



onLifeLongValidityChange() {
  if (this.lifelongvaliditylic) {
    // If lifelongvalidity is selected, set validatetilllic to null and disable the input
    this.validatetilllic = null;
  } else {
    // If lifelongvalidity is not selected, enable the input
    // You can also set a default date value if needed
  }
}


// hasDataInDateFields(): boolean {
//   // Implement this method to check if there is data in the date fields and return true/false accordingly
//   // You can use this method to disable the checkbox if needed
//   // For example, return true if validatetilllic has a value, indicating data is present
//   return this.validatetilllic !== null && this.validatetilllic !== undefined;
// }



onValidityChange() {
  if (this.lifelongvalidity) {
    // If lifelong validity is selected, disable the "Valid till" input
    this.validatetill = null; 
   
    console.log(this.validatetill,this.lifelongvaliditylic)
  }
  if(this.lifelongvaliditylic){
    this.validatetilllic=null;// Optionally, reset the value
    console.log(this.validatetill,this.lifelongvaliditylic)
  }
}


formatDateString(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = this.datePipe.transform(date, 'dd-MMM-yyyy');
  return formattedDate ? formattedDate : ''; // Provide a default value if null
}


getsFormattedMaxDate(): string {
  const currentDate = new Date();
  return currentDate.toISOString().split('T')[0];
}
getMinlicDate():string|undefined{
  return this.issueddate;

}
getminlicupdDate(){
  return this.issueddatelic;
}
geteduDate(){
  return this.FromDate;
}
geteduUpdDate(){
  return this.FromDatePro;
}

}
