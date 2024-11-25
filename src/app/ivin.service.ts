import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IvinService {
  portprofileid: any;
  getcandiatureprofile(myloginId: any) {
    throw new Error('Method not implemented.');
  }
  private isAuthenticatedValue  = false;
  SelectPollingStation: string | null = null;
  SelectPollingStationNumber: any;
  eventDetails:any;
  eventupdateid:any;
  IvinId:any
  filterdata: any;
  titleevent: any;
  eventcategoryid: any;
  eventdetid:any;
  stateselected: any;
  electionselected: any;
  yearselected: any;
  constituencyselected: any;
  genderselected: any;
  partyselected: any;
  categoryselected: any;
  startvalue: any;
  endvalue: any;
  updateOn:any;
  token : any;
  states: any;
  electiontypes: any;
  years: any;
  constituencies: any;
  totalelectiontype: string[]= [];
  allyears: string[]=[];
  allconstituencies : string[]=[];
  

  polling(email: any) {
    throw new Error('Method not implemented.');
  }

  private callFunctionSource = new Subject<void>();
  callFunction$ = this.callFunctionSource.asObservable();

  constructor(private http: HttpClient) {
    // this.token = sessionStorage.getItem('bearer_token');
    // console.log(this.token,"token after login ivin");
  }

  callFunction() {
    this.callFunctionSource.next();
  }

  private getToken(): string | null {
    return sessionStorage.getItem('bearer_token');
  }

  private get httpHeaders(): HttpHeaders {
    this.token = this.getToken();
    // console.log('this.token serv',this.token);
    return new HttpHeaders({
      'Accept': 'application/json, */*, text/html',
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }


  url = "https://staging-api.ivinstrategies.com/" //Production IP
  // url = "http://45.79.121.132:8002/" //Staging IP
  // url = "http://127.0.0.1:8000/" //Local IP

  loginValue= false;
  requestOptions = {headers:this.httpHeaders};

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedValue  = status;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  LoginValue(){
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  }

  checkLogin(data:any){
    this.loginValue = data;
    localStorage.setItem('isLoggedIn', String(data));
  }

  loginservice(logindata:any){
    return this.http.post(this.url + "UserIvin-API/login_mobile/",logindata)
  }

  authenticationlogin(email:any){
    return this.http.post(this.url + "UserIvin-API/login_email/",email)
  }

  // Dashboard

  issuesdata(){
    return this.http.get(this.url + "Raise-Issue/GetallRaiseIssue/",this.requestOptions);
  }
  
// This is the endpoints for pollingday component

  PollingStationGet(byemail:any){
    return this.http.get(this.url+ "Ivin_1/Getvotercountloadtime/"+byemail+"/", this.requestOptions)
  }

  serialnumbers(serialobj:any){
      return this.http.post(this.url+ "Ivin_1/GetVoterSerialNumberV3/",serialobj,this.requestOptions)
  }

  updateserialnumber(PollingStationNumber:any,Voter_SerialNumber:any, updateobj:any){
    return this.http.put(this.url + "Ivin_1/OutsideVoterUpdateVoter2024V2/"+PollingStationNumber+"/"+Voter_SerialNumber+"/",updateobj,this.requestOptions)
  }

  Getvotercount(byemail:any){
    return this.http.get(this.url+ "Ivin_1/GetUpdateVoterdataCount/"+byemail+"/", this.requestOptions)
  }   

  GetTotalVoters(PollingStationName: any){
    return this.http.get(this.url+ "Ivin_1/GetNoOfVoter/" +PollingStationName+"/", this.requestOptions)
  }

  hoverdetails(serialobj:any){
    return this.http.post(this.url + "Ivin_1/GetPdfVotersData/" ,serialobj ,this.requestOptions);
  }

  pollingdaydowmload(PollingStationName:any){
    return this.http.get(this.url + "Ivin_1/GetdownloadbyPollingStationNameAndNum/" + PollingStationName + "/",this.requestOptions)
  }

  DownloadSummary(email:any){
    return this.http.get(this.url + "Ivin_1/SummaryDownload/" +email+"/", this.requestOptions)
  }
// End for pollingday component


  // Data-Analytics Component
  GetMandals(Constituency:any){
    return this.http.get(this.url + "UserIvin-API/GetAllMandalNames/" + Constituency+"/", this.requestOptions)
  }

  GetPollingstations(Mandal:any){
    return this.http.get(this.url + "UserIvin-API/PollingStationNameAndNum/" + Mandal+"/", this.requestOptions)
  }

  GetSectionNames(PollingStationNameandnumber:any){
    return this.http.get(this.url +"UserIvin-API/getallsectionnumberandname/" +PollingStationNameandnumber+"/", this.requestOptions)
  }

  GetTableData(constituency:any,pollingStationName:any,gender:any,Name:any,section_No_and_Name:any,lastName:any,home:any,mandal:any,caste:any,mobilenumber:any,voterId:any){
    return this.http.get(this.url+ "UserIvin-API/DataAnalyticsGetByFields/" +constituency+"/"+pollingStationName+"/"+gender+"/"+Name+"/"+section_No_and_Name+"/"+lastName+"/"+home+"/"+mandal+"/"+caste+"/"+mobilenumber+"/"+voterId+"/", this.requestOptions)
  }

  RelationTableData(constituency:any){
    return this.http.get(this.url+ "UserIvin-API/DataAnalyticsGetByFields/" +constituency+"/", this.requestOptions)
  }

  GetDistrict(State:any){
    return this.http.get(this.url +"UserIvin-API/GetAllDistrictNames/"+ State+"/", this.requestOptions)
  }

  GetMadugula(District:any){
    return this.http.get(this.url +"UserIvin-API/GetAllConstituencyNames/" +District+"/", this.requestOptions)
  }

  GetPollingNames(Mandal:any){
    return this.http.get(this.url +"UserIvin-API/GetAlllPollingStationNames/" +Mandal+"/", this.requestOptions)
  }

  GetPollingNumbers(PollingName:any){
    return this.http.get(this.url +"UserIvin-API/GetAllPollingStationNumbers/" +PollingName+"/", this.requestOptions)
  }

  GetPollingLocations(PollingStationNumber:any){
    return this.http.get(this.url +"UserIvin-API/GetAllpollingstationlocation/" +PollingStationNumber+"/", this.requestOptions)
  }

  GetSectionsnoandnames(PollingStationNameandnumber:any){
    return this.http.get(this.url +"UserIvin-API/getallsectionnumberandname/" +PollingStationNameandnumber+"/", this.requestOptions)
  }

  UpdateVoterData(IvinId:any, voterupdateobj:any){
    return this.http.put(this.url +"UserIvin-API/GetByVoterIdDataAnalytics/" +IvinId,voterupdateobj, this.requestOptions)
  }

  PartyNames(){
    return this.http.get(this.url +"settings/GetAllPartyMasterList", this.requestOptions)
  }

  HabitationNames(){
    return this.http.get(this.url +"UserIvin-API/GetAllHabitations_v2/", this.requestOptions)
  }

  SchemeName(){
    return this.http.get(this.url +"UserIvin-API/GetAllSchemes_v2/", this.requestOptions)
  }

  GetCampaignData(ivin_id:any){
    return this.http.get(this.url +"UserIvin-API/Ivin1_Campaign/" +ivin_id, this.requestOptions)
  }

  UpdateCampaign(campaignupdateobj:any){
    return this.http.put(this.url +"UserIvin-API/Ivin1_CampaignUpdate/",campaignupdateobj, this.requestOptions)
  }

  // FilterData(IvinIds:any,Caste:any){
  //   return this.http.get(this.url +"communicationmodule/IncludedatInCommunicationModule/"+IvinIds+"/"+Caste+"/")
  // }

  IncludeFilterGet(filterobj:any){
    return this.http.post(this.url +"communicationmodule/Includedata_v2/",filterobj, this.requestOptions)
  }
  // End of Data-Analytics Component

  // Communication Component
  SearchCount(Constituency:any,PollingStationName:any,Gender:any,Name:any,Section_No_and_Name:any,LastName:any,Home:any,Mandal:any,VoterId:any){
    return this.http.get(this.url +"communicationmodule/SearchDataAnalytics/"+Constituency+"/"+PollingStationName+"/"+Gender+"/"+Name+"/"+Section_No_and_Name+"/"+LastName+"/"+Home+"/"+Mandal+"/"+VoterId+"/")
  }

  TableGet(page:any, page_size:any){
    return this.http.get(this.url +"communicationmodule/GetAllCommunicationModule/"+page+"/"+page_size+"/", this.requestOptions)
  }

  PostCommuication(build:any){
    return this.http.post(this.url +"communicationmodule/CommunicationModulePost/",build, this.requestOptions)
  }

  Geteditview(id:any){
    return this.http.get(this.url +"communicationmodule/GetCommunicationModuleByid/"+id+"/", this.requestOptions)
  }

  UpdateCommunication(id:any, updobj:any){
    return this.http.put(this.url +"communicationmodule/UpdateCommunicationModule/"+id+"/", updobj, this.requestOptions)
  }
  // End of Communication Component

  // This is for Profile

  MultiImages(multiimgObj:any, file:File){
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.token}`});
    headers.set('Content-Type', 'multipart/form-data');
    const formData = new FormData();
    formData.append('multipleImages', file);
    Object.keys(multiimgObj).forEach((key) => {
      formData.append(key, multiimgObj[key]);
    });
    return this.http.post(this.url+"candidate_profile/MultipleImageApiView/", formData,{headers})
  }


  About( formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    const url = `${this.url}candidate_profile/UserProfileAPI/`;
    return this.http.post(url, formData);
  }

  singnup(){
    
  }

  getUserProfile(userid:any){
    return this.http.get(this.url+"candidate_profile/GetUserProfile/"+userid+"/")
  }

  updateUserProfile(id:any,formData:any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    const url = `${this.url}candidate_profile/UserProfileDataUpdateV2/`+id+"/";
    return this.http.put(url, formData, { headers });
  }

  Candidature( formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
  
    console.log(formData, "hi");
  
    const url = `${this.url}candidate_profile/CandidatureInformationView/`;
    return this.http.post(url, formData, { headers });
  }


  partynames(){
    return this.http.get(this.url +"UserIvin-API/GetAllPartynames_v2", this.requestOptions)
  }

  Ecstatus( formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
  
    const url = `${this.url}candidate_profile/ECStatusView/`;
    return this.http.post(url, formData, { headers });
  }

  // politicalhistory( formData: FormData) {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.token}`,
  //   });
  //   console.log(formData, "hi");
  //   const url = `${this.url}candidate_profile/PoliticalHistoryView/`;
  //   return this.http.post(url, formData, { headers });
  // }
  
  politicalhistory(political:any){
    return this.http.post(this.url + "candidate_profile/PoliticalHistoryView/",political,this.requestOptions);
  }


  getCandiatureInfo(userid:any){
    return this.http.get(this.url+"candidate_profile/GetCandidatureInformationByUserId/"+userid+"/",this.requestOptions)
  }

  getPoliticalHistory(candid:any){
    return this.http.get(this.url+"candidate_profile/GetPoliticalHistoryByCandidatureInformationId/"+candid+"/",this.requestOptions)
  }

  getEcStatus(userid:any){
    return this.http.get(this.url+"candidate_profile/GetECStatusByUserId/"+userid+"/",this.requestOptions)
  }
  

  deleteecstatus(Ecid:any){
    return this.http.delete(this.url+"candidate_profile/ECStatusDeleteByid/"+Ecid+"/",this.requestOptions)
  
  }

  updatecanditedata(id:any,formData:any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
  
    console.log(formData, "hi");
  
    const url = `${this.url}candidate_profile/UpdateCandidatureInformation/`+id+"/";
    return this.http.put(url, formData, { headers });
  }


  updateecstatusdata(id:any,formData:any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
  
    console.log(formData, "hi");
  
    const url = `${this.url}candidate_profile/UpdateECStatus/`+id+"/";
    return this.http.put(url, formData, { headers });
  }

  updatepoliticaldata(id:any, polidata:any){
    return this.http.put(this.url +"candidate_profile/UpdatePoliticalHistory/"+id+"/",polidata, this.requestOptions)
  }

  partyinclinationgetbyid(id:any){
    return this.http.get(this.url+"settings/GetPartyNamesV2/"+id,this.requestOptions)
  }

  deletepolitical(politicalid:any){
    return this.http.delete(this.url+"candidate_profile/DeletePoliticalHistory/"+politicalid+"/",this.requestOptions)
  
  }

  multiimageuploadprofile( formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
  
    console.log(formData, "hi");
  
    const url = `${this.url}candidate_profile/MultipleImageApiView/`;
    return this.http.post(url, formData, { headers });
  }

  getallmultiimageprofile(userid:any){
    return this.http.get(this.url+"candidate_profile/GetMultipleImageByUserid/"+userid+"/",this.requestOptions)
  }

  deleteimagesprofile(id:any){
    return this.http.delete(this.url+"candidate_profile/MultipleDeleteImage/"+id+"/",this.requestOptions)
  }

  getProfileData(userid:any){
    return this.http.get(this.url+"candidate_profile/GetSummaryUserProfile/"+userid+"/",this.requestOptions)
  }

  socialmediapost(postobj:any){
    return this.http.post(this.url+"candidate_profile/SocialmediaView/",postobj,this.requestOptions)
  }

  getsocialmedia(userid:any){
    return this.http.get(this.url+"candidate_profile/GetSocialmediaByUserId/"+userid+"/",this.requestOptions)
  }

  deleteSocialMedia(id: any){
    console.log('delte id', id);
    return this.http.delete(this.url +"candidate_profile/DeleteSocialmedia/"+id+"/", this.requestOptions);
  }

  updateSocialMedia(id:any,updatesocialdata:any){
    return this.http.put(this.url+"candidate_profile/UpdateSocialmedia/"+id+"/",updatesocialdata,this.requestOptions)
  }

  getallstates(){
    return this.http.get(this.url+"Raise-Issue/GetallStates");
  }

  // Profile module end


// This is for Events

getallcategory(){
  return this.http.get(this.url+"Events/GetAllEventCategoryMaster/",this.requestOptions)
}

eventdetailspost( eventdetails:any) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}Events/EventPostView/`;
  return this.http.post(url, eventdetails, { headers });
}

multiimageuploadevents( formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}Events/EventMultipleImageApiView/`;
  return this.http.post(url, formData, { headers });
}

getallmultiimage(userid:any,eventid:any){
  return this.http.get(this.url+"Events/GetEventsMultipleImageByUserid/"+userid+"/" + eventid + "/",this.requestOptions)
}

deleteimages(id:any){
  return this.http.delete(this.url+"Events/EventDeleteImage/"+id+"/",this.requestOptions)
}


updateimages(id:any,updObj:any) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}Events/UpdateEventMultipleImage/`+id+'/';
  return this.http.put(url,updObj,{ headers });
}

Geteventdetails(id:any){
  return this.http.get(this.url+"Events/GetEvents/"+id+"/",this.requestOptions)
}

Updateeventdetails(id:any,updObj:any) {
  return this.http.put(this.url+"Events/EventsUpdate/"+id+'/',updObj,this.requestOptions);
}

evendatepost(DatePost:any) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}Events/ScheduleTimeForDatesPost/`;
  return this.http.post(url, DatePost, { headers });
}

stationsassign(names:any,updObj:any){
  return this.http.put(this.url+"Ivin_1/PollingstationAssignUser/"+names+'/',updObj,this.requestOptions);
}

eventdetailsgetall(userid:any){
  return this.http.get(this.url+"Events/GetEventsByUserId/"+userid+"/",this.requestOptions);
}


subscribepost(join:any) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}Events/EventSubscription/`;
  return this.http.post(url,join, { headers });
}


pdfdownload(ids:any){
  return this.http.get(this.url+"Events/GetEvents/"+ids+"/",this.requestOptions);
}


getscheduleall(userid:any){
  return this.http.get(this.url+"Events/GetEventDateAndTime/"+userid+"/",this.requestOptions);
}

scheduleupdate(names:any,updObj:any){
  return this.http.put(this.url+"Events/ScheduleTimeForDatesUpdate/"+names+'/',updObj,this.requestOptions);
}

schedulegetbyid(id:any){
  return this.http.get(this.url+"Events/GetEventDateTime/"+id+"/",this.requestOptions);
}


schedulegetall(date:any,id:any){
  return this.http.get(this.url+"Events/schedule-times/"+id+"/"+date+"/",this.requestOptions);
}

timesgetbydates(date:any,id:any){
  return this.http.get(this.url+"Events/schedule-times/"+id+"/"+date+"/",this.requestOptions);
}


organizerpost(orginfo: any) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  console.log(orginfo, "hi");
  const url = `${this.url}Events/OrganizerInfoPost/`;
  return this.http.post(url,orginfo, { headers });
}

organizerget(id:any){
  return this.http.get(this.url+"Events/GetOrganizerInfo/"+id+"/",this.requestOptions);
}

// End For events

// This is for Quickinsghts 

datapost(data:any){
  return this.http.post(this.url +"quickinsights/QuickInsightsForDataPost/",data, this.requestOptions);
}

TabledataGet(page:any, page_size:any){
  return this.http.get(this.url +"quickinsights/GetAllQuickInsightsData/"+page+"/"+page_size+"/", this.requestOptions);
}

EditandviewGet(id:any){
  return this.http.get(this.url +"quickinsights/GetByIdQuickInsights/"+id+"/", this.requestOptions);
}

Updatequickinsights(id:any, updobj:any){
  return this.http.put(this.url +"quickinsights/UpdateQuickInsightsForData/"+id+"/", updobj, this.requestOptions)
}

// This is for probite Quick Insights

probitesavepost(data:any){
  return this.http.post(this.url + "probite/ProbiteQuickInsightsPost/",data);
}

probitegetall(data:any){
  return this.http.post(this.url + "probite/GetProbiteData/",data);
}

probitesaveupdate(id:any,data:any){
  return this.http.put(this.url + "probite/probiteQuickinsightsUpdate/"+ id + "/",data,this.requestOptions);
}

downalodpdf(id:any){
  return this.http.get(this.url +"probite/ProbitesGetById/"+id+"/", this.requestOptions);
}

getallusertype(){
  return this.http.get(this.url + "UserIvin-API/UserTypeMasterDataGet/");
}

portfolioaboutyourself( formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/PortfolioProfilePost/`;
  return this.http.post(url, formData);
}

portfolioaboutget(userid:any){
  return this.http.get(this.url+"candidate_profile/GetPortfolioData/"+userid+"/",this.requestOptions)
}

portfolioaboutupdate(id:any,formData:any){
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/PortfolioDataUpdate/`+id+"/";
  return this.http.put(url, formData, { headers });
}

getallportfoliousers(userid:any){
  return this.http.get(this.url + "candidate_profile/GetUserAndPortfolioProfileByUserid/" + userid + "/",this.requestOptions)
}

bannerpost(formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/PortfolioImageApiView/`;
  return this.http.post(url, formData);
}

bannerget(id:any){
  return this.http.get(this.url + "candidate_profile/GetPortfolioImage/" + id + "/",this.requestOptions)
}

bannerupdate(id:any,formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/UpdatePortfolioProfileImage/`+id+"/";
  return this.http.put(url, formData);
}

userbannerpost(formData: FormData){
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/UserProfileImageApiView/`;
  return this.http.post(url, formData);
}

userbannerget(id:any){
  return this.http.get(this.url + "candidate_profile/GetUserProfileImage/" + id + "/")
}

userbannerupdate(id:any,formData: FormData) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  });
  const url = `${this.url}candidate_profile/UpdateUserProfileImage/`+id+"/";
  return this.http.put(url, formData);
}

publicpagepagination(id:any){
  return this.http.get(this.url + "probite/ProbitesGetById/" + id + "/");
}

getbyname(name:any){
  return this.http.get(this.url + "candidate_profile/GetUserProfileByUserName/" + name + "/")
}

// End Quick insight probite 


// This is for login & signup
otpverfication(verfiobj:any){
  return this.http.post(this.url +"UserIvin-API/UserIvinOtpVerfication/",verfiobj);
}

OTPSend(otpobj:any) {
  return this.http.post(this.url+ "UserIvin-API/UserIvinOtpGeneration/",otpobj);
}

// signupotpverfication(signdata:any):Observable<any>{
//   console.log('sss',signdata)
//   return this.http.post(this.url +"UserIvin-API/SignUpUserIvinEmailOtpGeneration/",signdata,this.requestOptions);
// }
signupotpgeneration(signdata: any): Observable<any> {
  return this.http.post(this.url + "UserIvin-API/SignUpUserIvinEmailOtpGeneration/", signdata);
}

signupotpverification(signupotp:any){
  return this.http.post(this.url + "UserIvin-API/SignUpUserIvinEmailOtpVerfication/", signupotp);
}

usertypesignup(){
return this.http.get(this.url +"UserIvin-API/UserTypeMasterDataGet/");
}

Updatesignup(id: any, updobj: any) {
  console.log('updatedata', id, updobj);
  return this.http.put(this.url + "UserIvin-API/UserUpdate/" + id + "/", updobj);
}

usertypesignupgetid(id:any){
  return this.http.get(this.url +"UserIvin-API/UserTypeMasterDataGet/"+id+"/");
}

forgetpasswordpost(userdata:any){
  return this.http.post(this.url+"UserIvin-API/ResetPassword/" + userdata + "/",this.requestOptions);
}

}

