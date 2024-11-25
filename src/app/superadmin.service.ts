import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private sharedData: any;
  private callFunctionSource = new Subject<void>();
  private providerSelectedOptions: { [category: string]: string[] } = {};
  private enterpriseSelectedOptions: { [category: string]: string[] } = {};
  private selectedOptions: { [key: string]: any[] } = {};
  callFunction$ = this.callFunctionSource.asObservable();
  getUserData: any;
  // login: any;
  getDateOfBirth: any;
  getCitiesByCountryId: any;
  triggerRefresh: any;
  private loggedInKey = 'isLoggedIn';
  setData: any;
  public href: string ='';
  baseUrl = window.location.origin;
  url:any;
  token=''

  callFunction(){
    this.callFunctionSource.next();
  }
  //url = "http://nivish-staging.sumedhasahni.com:8000/" //URL without HTTPS
  // url = "https://nivish-staging-api.sumedhasahni.com/" staging url


  loginValue= false;

  httpHeaders=new HttpHeaders({'Accept': 'application/json,  */*, text/html' ,

  'Authorization': `Bearer ${this.token}`

  })
  constructor(private http:HttpClient,private routes:Router) {
    this.href = this.routes.url
    //console.log("urlget",this.routes.url)
    console.log("Current baseUrl:", this.baseUrl);

    // if (this.baseUrl === "http://65.1.50.165:4201 || https://nivish-staging-work.sumedhasahni.com") {
    //   console.log("Current baseUrl:", this.baseUrl);
    //   this.url = "https://nivish-staging-api.sumedhasahni.com/";
    //   this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2MTA4LCJpYXQiOjE3MjE2NDAxMDgsImp0aSI6IjYwZGRmYmZkNWI1YTQwMWE4ZmMxOTA4YTA5NmM2OTYzIiwidXNlcl9pZCI6MTJ9.9rpUHgtrGDPBa-m_lu8Yv_EqhwOR5z_n3dAGJ3-iq9Y";
    // }
    // if (this.baseUrl === "https://nivish-staging-work.sumedhasahni.com") {
    //   console.log("Current baseUrl:", this.baseUrl);
    //   this.url = "https://nivish-staging-api.sumedhasahni.com/";
    //   this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2MTA4LCJpYXQiOjE3MjE2NDAxMDgsImp0aSI6IjYwZGRmYmZkNWI1YTQwMWE4ZmMxOTA4YTA5NmM2OTYzIiwidXNlcl9pZCI6MTJ9.9rpUHgtrGDPBa-m_lu8Yv_EqhwOR5z_n3dAGJ3-iq9Y";
    // }
    // if (this.baseUrl === "http://localhost:4201") {
    //   console.log("localhost baseUrl:", this.baseUrl);
    //   this.url = "http://65.1.50.165:8002/";
    //   this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyOTUxMjUwMSwiaWF0IjoxNzIxNzM2NTAxLCJqdGkiOiI1ZTg0NTk0NWZhOWM0MTY0YjQzYWQ5YjNkMjU2ODhhYSIsInVzZXJfaWQiOjF9.jn2lJbd-N9j7Emcgwfh_w8wE1AlLN68uhuDDirqTDeE";
    // } else {
    //   console.log("No matching baseUrl found");
    // }   
    
    // if (this.baseUrl === "http://65.1.50.165:4201" || "https://nivish-staging-work.sumedhasahni.com") {
    //   this.url = "https://nivish-staging-api.sumedhasahni.com/";
    //   this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2MTA4LCJpYXQiOjE3MjE2NDAxMDgsImp0aSI6IjYwZGRmYmZkNWI1YTQwMWE4ZmMxOTA4YTA5NmM2OTYzIiwidXNlcl9pZCI6MTJ9.9rpUHgtrGDPBa-m_lu8Yv_EqhwOR5z_n3dAGJ3-iq9Y";
    // }
    // if (this.baseUrl === "http://localhost:4201") {
    //   this.url = "https://nivish-dev-api.sumedhasahni.com/";
    //   this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyOTUxMjUwMSwiaWF0IjoxNzIxNzM2NTAxLCJqdGkiOiI1ZTg0NTk0NWZhOWM0MTY0YjQzYWQ5YjNkMjU2ODhhYSIsInVzZXJfaWQiOjF9.jn2lJbd-N9j7Emcgwfh_w8wE1AlLN68uhuDDirqTDeE";
    // }


    

    if ( this.baseUrl === "https://216.48.180.28:4201" || this.baseUrl === "https://nivish-staging-work.sumedhasahni.com" )
      {
        this.url = "https://nivish-staging-api.sumedhasahni.com/";
        this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2MTA4LCJpYXQiOjE3MjE2NDAxMDgsImp0aSI6IjYwZGRmYmZkNWI1YTQwMWE4ZmMxOTA4YTA5NmM2OTYzIiwidXNlcl9pZCI6MTJ9.9rpUHgtrGDPBa-m_lu8Yv_EqhwOR5z_n3dAGJ3-iq9Y";
        console.log(this.baseUrl, "dev url");
        console.log(this.url, "devAPI url");
      }
         if ( this.baseUrl === "https://216.48.180.28:4207" || this.baseUrl === "https://nivish-dev-work.sumedhasahni.com" )
      {
        this.url = "https://nivish-dev-api.sumedhasahni.com/";
        this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NDE2MTA4LCJpYXQiOjE3MjE2NDAxMDgsImp0aSI6IjYwZGRmYmZkNWI1YTQwMWE4ZmMxOTA4YTA5NmM2OTYzIiwidXNlcl9pZCI6MTJ9.9rpUHgtrGDPBa-m_lu8Yv_EqhwOR5z_n3dAGJ3-iq9Y";
        console.log(this.baseUrl, "Staging url");
        console.log(this.url, "Staging url");
      }
      if (this.baseUrl === "http://localhost:4201")
      { this.url = "https://nivish-dev-api.sumedhasahni.com/";
        this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyOTUxMjUwMSwiaWF0IjoxNzIxNzM2NTAxLCJqdGkiOiI1ZTg0NTk0NWZhOWM0MTY0YjQzYWQ5YjNkMjU2ODhhYSIsInVzZXJfaWQiOjF9.jn2lJbd-N9j7Emcgwfh_w8wE1AlLN68uhuDDirqTDeE";
         console.log(this.baseUrl, "local url");
        console.log(this.url, "local url");
       }
    }
    


  requestOptions = {headers:this.httpHeaders};
  requestMultiPartOptions = {headers:new HttpHeaders({'Accept': 'multipart/form-data,  */*, text/html' ,

  'Authorization': `Bearer ${this.token}`

  })};

  getProviderSelectedOptions(): { [category: string]: string[] } {
    return this.providerSelectedOptions;
  }

  setProviderSelectedOptions(category: string, options: string[]): void {
    this.providerSelectedOptions[category] = options;
    this.saveSelectedOptions('provider', this.providerSelectedOptions);
  }

  // Enterprise Filter Methods
  getEnterpriseSelectedOptions(): { [category: string]: string[] } {
    return this.enterpriseSelectedOptions;
  }

  setEnterpriseSelectedOptions(category: string, options: string[]): void {
    this.enterpriseSelectedOptions[category] = options;
    this.saveSelectedOptions('enterprise', this.enterpriseSelectedOptions);
  }

  // General save/load for specific keys
  private saveSelectedOptions(key: string, options: { [category: string]: string[] }): void {
    sessionStorage.setItem(`${key}SelectedOptions`, JSON.stringify(options));
  }

  private loadSelectedOptions(key: string): { [category: string]: string[] } {
    const storedOptions = sessionStorage.getItem(`${key}SelectedOptions`);
    return storedOptions ? JSON.parse(storedOptions) : {};
  }

  setSelectedOptions(category: string, options: any[]) {
    this.selectedOptions[category] = options;
  }

  getSelectedOptions(): { [key: string]: any[] } {
    return this.selectedOptions;
  }

  clearSelectedOptions() {
    this.selectedOptions = {};
  }

  setLoggedIn(value: boolean) {
    sessionStorage.setItem(this.loggedInKey, value ? 'true' : 'false');
    }

    isLoggedIn(): boolean {
    return sessionStorage.getItem(this.loggedInKey) === 'true';
    }
  login(loginObj:any){
    return this.http.post(this.url+"SuperAdmin/Login/System-User/",loginObj,this.requestOptions);
  }
  otpGeneration(otpObj:any){
    return this.http.post(this.url+"SuperAdmin/SAOtpGeneration/",otpObj,this.requestOptions)
  }
  otpVerification(subObj: any) {
    return this.http.post(this.url + "SuperAdmin/SAOtpVerfication/",subObj, this.requestOptions);
  }
  enterpriseGroupPost(egObj:any){
    return this.http.post(this.url+"SuperAdmin/EnterpriseGroupPost/",egObj,this.requestOptions);
  }
  enterpriseName(nameObj:any){
    return this.http.post(this.url+"SuperAdmin/EnterpriserNamePost/",nameObj,this.requestOptions);
  }
  healthcamplist(){
    return this.http.get(this.url+"SuperAdmin/HealthCampandEnterpriseNamesGetIn/",this.requestOptions);
  }
  getStudentMaster(masterObj:any){
    return this.http.post(this.url+"SuperAdmin/EnterpriseInfoseekDetailsIn/",masterObj,this.requestOptions);
  }


  enterprisegroup(){
    return this.http.get(this.url+"SuperAdmin/GetEnterpriseGroup/",this.requestOptions);
  }
  emterprisegroupgetbyid(id:any){
    return this.http.get(this.url+"SuperAdmin/GetEnterpriseGroupById/"+id,this.requestOptions)
  }
  enterpriseGroupupdate(id:any,egObj:any){
    return this.http.put(this.url+"SuperAdmin/EnterpriseGroupUpdate/"+id+'/',egObj,this.requestOptions);
  }
  healthcampadd(egObj:any){
    return this.http.post(this.url+"SuperAdmin/CampRegPost/",egObj,this.requestOptions);
  }
  emterprisenamedelatebyid(id:any){
    return this.http.delete(this.url+"SuperAdmin/EnterpriseGroupDelete/"+id,this.requestOptions)
  }
  providerentitygetall(obj:any){
    return this.http.get(this.url+"SuperAdmin/ProviderDetailsGetIn/"+obj+'/',this.requestOptions)
  }
  providergetall(){
    return this.http.get(this.url+"Hcp/GetProvider/",this.requestOptions)
  }
  hcpget(obj: any): Observable<any> {

    return this.http.post(this.url+"SuperAdmin/GetHcpDetailsIn/",obj,this.requestOptions);
  }
  enterprisenamesget(nameObj:any){
    return this.http.post(this.url+"SuperAdmin/GetEnterpriseDetailList/",nameObj,this.requestOptions);
  }

  enterprisenameUpd(id:any,updObj:any){
    return this.http.put(this.url+"SuperAdmin/EnterpriseNamesUpdate/"+id+'/',updObj,this.requestOptions);
  }
  countrysget(){
    return this.http.get(this.url+"Infoseek/CountryGet/",this.requestOptions);
  }
  classandsectionpost(nameObj:any){
    return this.http.post(this.url+"SuperAdmin/InfooseekClassAndSection/",nameObj,this.requestOptions);
  }
  healthcampgetbyid(id:any){
    return this.http.get(this.url+"SuperAdmin/CampRegGetById/"+id,this.requestOptions)
  }

   timeslotsget(id:any){
    return this.http.get(this.url+"SuperAdmin/TimeSlotsGetByHcid/"+id,this.requestOptions)
  }

  healthcampupd(id:any,updObj:any){
    return this.http.put(this.url+"SuperAdmin/CampRegUpdate/"+id+'/',updObj,this.requestOptions);
  }

  addStudentMaster(stdObj:any){
    return this.http.post(this.url+'Infoseek/InfoseekMaster/',stdObj, this.requestOptions);
  }
  getEnterpriseNameDetails(id:any){
    return this.http.get(this.url+"SuperAdmin/EnterpriseNamesGet/"+id+"/",this.requestOptions);
  }
  smlUpdate(id:any,updObj:any){
    return this.http.put(this.url+"Infoseek/InfoseekUpdate/"+id+'/',updObj,this.requestOptions);
  }
  enterpriseNameDelete(id:any){
    return this.http.delete(this.url+"SuperAdmin/EnterpriseNamesDelete/"+id+'/',this.requestOptions);
  }
  multipletimepost(updObj:any){
    return this.http.post(this.url+"SuperAdmin/DateTimeMultiplePost/",updObj,this.requestOptions);
  }
  providerget(id:any){
    return this.http.get(this.url+"Hcp/HcpRegistrationGetById/"+id,this.requestOptions);
  }
  tempUinPost(obj:any){
    return this.http.post(this.url+"SuperAdmin/GenreateTempUINPost/",obj,this.requestOptions);
  }
  addprovider(stdObj:any){
    return this.http.post(this.url+'/Hcp/ProviderPost/',stdObj,this.requestOptions);
  }

  notifypost(notObj:any){
    return this.http.post(this.url+'SuperAdmin/NotifyEmailPost/',notObj,this.requestOptions);
  }
  UpdateCoordinator(id:any,updObj:any){
    return this.http.put(this.url+"SuperAdmin/CoordinateDetailsUpdate/"+id+'/',updObj,this.requestOptions)
  }
  studentidcard(id: any){
    return this.http.get(this.url+"Infoseek/InfoseekIdCardGet/"+id+'/', this.requestOptions);
  }

  userVerification(userData:any){
    return this.http.post(this.url+"Infoseek/InfoseekOtpGeneration/",userData,this.requestOptions)
  }
  provideremail(userData:any){
    return this.http.post(this.url+"Hcp/ProviderOtpGeneration/",userData,this.requestOptions)
  }

  provideotp(email:any){
    return this.http.post(this.url+"/Hcp/ProviderOtpVerfication/",email,this.requestOptions)
  }
  otpVerfication(email:any){
    return this.http.post(this.url+"Infoseek/InfoseekOtpVerification/",email,this.requestOptions)
  }
  updateUserRegA(id:any,sections:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S2_Verification/"+id,sections,this.requestOptions)
  }
  updateUserRegB(id:any,health:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S3_Verification/"+id,health,this.requestOptions)
  }
  updateUserRegC(id:any,secC:any){
    return this.http.put(this.url+"/Infoseek/Infoseek_S4_Verification/"+id,secC,this.requestOptions)
  }
  updateUserRegD(id:any,secD:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S5_Verification/"+id,secD,this.requestOptions)
  }
  updateUserRegE(id:any,secE:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S6_Verification/"+id,secE,this.requestOptions)
  }
  updateUserRegF(id:any,secF:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S7_Verification/"+id,secF,this.requestOptions)
  }
  updateUserRegG(id:any,secG:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S8_Verification/"+id,secG,this.requestOptions)
  }
  updateUserRegl(id:any,secL:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S13_Verification/"+id,secL,this.requestOptions)
  }
  updateUserRegI(id:any,secI:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S10_Verification/"+id,secI,this.requestOptions)
  }
  updateUserRegJ(id:any,secJ:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S11_Verification/"+id,secJ,this.requestOptions)
  }
  updateUserRegH(id:any,secH:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S9_Verification/"+id,secH,this.requestOptions)
  }
  updateUserRegK(id:any,seck:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S12_Verification/"+id,seck,this.requestOptions)
  }


  updateUserRegM(id:any,secM:any){
    return this.http.put(this.url+"Infoseek/Infoseek_S14_Verification/"+id,secM,this.requestOptions)
  }
  ///////////////////
  providerEducation(educationData:any){
    return this.http.post(this.url+"/Hcp/HcpEducationPost/",educationData, this.requestOptions)
  }
  providerLicense(LicenseData:any){
    return this.http.post(this.url+"Hcp/HcpLicenseDetailsPost/",LicenseData,this.requestOptions)
  }
  getstate(id:any){
    return this.http.get<ApiResponse>(this.url+"Infoseek/StatesGet/"+id,this.requestOptions)
  }
  getallcountry(){
    return this.http.get<ApiResponse>(this.url+"Infoseek/CountryGet/",this.requestOptions)
  }
  getallcitys(id:any){
    return this.http.get<ApisResponse>(this.url+"Infoseek/GetCity/"+id,this.requestOptions)
  }
  hcpVerify(person:any){
    return this.http.post(this.url+"Hcp/HcpOtpGeneration/",person,this.requestOptions)
  }
  hcponeTime(oneCode:any){
    return this.http.post(this.url+"Hcp/HcpOtpVerfication/",oneCode,this.requestOptions)
  }
  licenseUpload(upload:any){
    return this.http.post(this.url+"Hcp/HcpLicenseDetailsPost/",upload,this.requestOptions)
  }
  educationUpload(edu:any){
    return this.http.post(this.url+"Hcp/HcpEducationPost/",edu,this.requestOptions)
  }
  provideallget(filter:any){
    return this.http.get(this.url+"Hcp/HcpMasterGetByType/"+filter+'/',this.requestOptions)
  }
  licensehcpget(){
    return this.http.get(this.url+"Hcp/GetHcpLicenseDetails/",this.requestOptions)
  }
  educationHcpGet(){
    return this.http.get(this.url+"/Hcp/GetHcpEducation/",this.requestOptions)
  }
  personalhcpgetbyid(id:any){
    return this.http.get(this.url+"Hcp/HcpRegistrationGetById/"+id,this.requestOptions)
  }
  personalhcpUpdate(id:any,hcpPerson:any){
    return this.http.put(this.url+"Hcp/HcpRegistrationUpdate/"+id+"/",hcpPerson,this.requestOptions)
  }
  hcpLicenseExpPost(licenseExp:any){
    return this.http.post(this.url+"Hcp/HcpLicenseDetailsExperiencePost/",licenseExp,this.requestOptions)
  }
  hcplicenseget(id:any){
    return this.http.get(this.url+"Hcp/GetHcpLicenseDetails/"+id,this.requestOptions)
  }
  hcpEducationGet(id:any){
    return this.http.get(this.url+"Hcp/GetHcpEducation/"+id,this.requestOptions)
  }
  getbyid(id:any){
    return this.http.get(this.url+"Hcp/HcpMasterGetById/"+id,this.requestOptions)
  }
  personamaster(userspost:any){
    return this.http.post(this.url+"Hcp/HcpRegistrationPost/",userspost, this.requestOptions)
  }
  hcpProviderExpupd(id:any,licenseExp:any){
    return this.http.put(this.url+"/Hcp/HcpExperienceUpdate/"+id+'/',licenseExp,this.requestOptions)
  }
  hcplicenseExpGet(id:any){
    return this.http.get(this.url+"/Hcp/GetHcpExperience/"+id+'/',this.requestOptions)

  }
  InfoseekMasterId(id:any){
    return this.http.get(this.url+"Infoseek/InfoseekVerificationDetails/"+id,this.requestOptions)
  }
  updateterms(id:any,terms:any){
  return this.http.put(this.url+"Infoseek/InfoseekTermsUpdate/"+id,terms,this.requestOptions)
}
hcpterms(id:any,terms:any){
  return this.http.put(this.url+"Hcp/HcpNoteTermsUpdate/"+id+"/",terms,this.requestOptions)
}
providerterms(id:any,terms:any){
  return this.http.put(this.url+"Hcp/ProviderTermsUpdate/"+id,terms,this.requestOptions)
}


 infosekpost(note:any){
   return this.http.post(this.url+"/Infoseek/InfoseekNote/",note,this.requestOptions)
 }
 hcpnote(noteObj:any){
  return this.http.post(this.url+"Hcp/HcpNote/",noteObj,this.requestOptions)
}
gethcplicence(id:any){
return this.http.get(this.url+"Hcp/GetHcpLicenseDetailsId/"+id,this.requestOptions)
}
updatehcplicence(id:any,license:any){
  return this.http.put(this.url+"Hcp/HcpLicenseDetailsUpdate/"+id+"/",license,this.requestOptions)
}

campreview(loginpost:any){
  return this.http.post(this.url+"Hcp/HCPLogin/",loginpost, this.requestOptions)
}
updateNote(id: any, formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  console.log(formData, "hi");

  const url = `${this.url}Infoseek/InfoseekPhotoUploadUpdate/${id}`;
  return this.http.put(url, formData, { headers });
}

hcpupdateNote(id: any, formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  console.log(formData, "hi");

  const url = `${this.url}Hcp/HcpPhotoUploadUpdate/${id}/`;
  return this.http.put(url, formData, { headers });
}

getidcard(id:any){
  return this.http.get(this.url+"Infoseek/InfoseekIdCardGet/"+id,this.requestOptions)
}
updateProviderNote(id: any, formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  console.log(formData, "pavan");

  const url = `${this.url}Hcp/HcpNoteUpdate/${id}/`;
  return this.http.put(url, formData, { headers, reportProgress: true, observe: 'events' });
}
providerIdCardGetById(id:any){
  return this.http.get(this.url+"Hcp/HcpRegistrationGetById/"+id,this.requestOptions)
}
eductaiongethcp(id:any){
  return this.http.get(this.url+"Hcp/GetHcpEducationId/"+id,this.requestOptions)
}
educationhcpUpdate(id:any,eduObj:any){
  return this.http.put(this.url+"Hcp/HcpEducationUpdate/"+id+'/',eduObj,this.requestOptions)
}
hcpmasterUpdate(id:any,masObj:any){
  return this.http.put(this.url+"/Hcp/HcpMasterUpdate/"+id+'/',masObj,this.requestOptions)
}
hcpIdentificationUpdate(id:any,idObj:any){
  return this.http.put(this.url+'Hcp/HcpIdentificationUpdate/'+id+'/',idObj,this.requestOptions);
}
mutipleDocPostSchools(docObj:any){
  return this.http.post(this.url+'SuperAdmin/PostDocEnterpriseName/',docObj,this.requestOptions);
}
getMUltipleDocuments(id:any){
  return this.http.get(this.url+'SuperAdmin/EnterpriseNameGetDocs/'+id+"/",this.requestOptions);
}
deleteMultipleSchoolDocuments(id:any){
  return this.http.delete(this.url+"SuperAdmin/EnterpriseNameDocsDelete/"+id+"/",this.requestOptions);
}

hcpEductaionDocumentUpdate(id:any,formData:FormData){
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  console.log(formData, "hi");

  const url = `${this.url}Hcp/HcpEducationUploadDoc/${id}/`;
  return this.http.put(url, formData, { headers });
}

hcpLIcenseDocumentUpdated(id:any,formData:FormData){
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });

  console.log(formData, "hi");

  const url = `${this.url}Hcp/HcpLicenseDetailsUploadDoc/${id}/`;
  return this.http.put(url, formData, { headers });
}

gethcpidcard(id:any){
  return this.http.get(this.url+"Hcp/GetHcpIDCard/"+id,this.requestOptions)
}

couminicationget(id: any): Observable<any> {
  return this.http.get(this.url + 'SuperAdmin/CommunicationGetByHcid/' + id, this.requestOptions);
}

studentresourcr(hcid:any){
  return this.http.get(this.url + 'SuperAdmin/HcpandstationsGetIn/' + hcid, this.requestOptions)
}


}

interface ApiResponse {
  Message: string;
  Result: { id: number; Country: string;CountryID:number ;State: string;}[];
  HasError: boolean;
  Status: number;
}
interface ApisResponse {
  Message: string;
  Result: { id: number; City:string}[];
  HasError: boolean;
  Status: number;
  // hcp ------------------------------------------------------------------------------------------------------------------------------
}
