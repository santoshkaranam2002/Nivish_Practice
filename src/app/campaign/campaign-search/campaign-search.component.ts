import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { FilterComponent } from 'src/app/filter/filter.component';
import { IvinService } from 'src/app/ivin.service';
import { CastData, CountData, Mandals, PollingStationsNameadNumber, SectionNameandNumber } from '../graphql.communication';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-campaign-search',
  templateUrl: './campaign-search.component.html',
  styleUrls: ['./campaign-search.component.scss']
})

export class CampaignSearchComponent implements OnInit {
  constituencyformControl = new FormControl('', [Validators.required]);
  mandalformControl = new FormControl('', [Validators.required]);
  pollingstationformControl = new FormControl('', [Validators.required]);
  sectionnumberandnameformControl = new FormControl('', [Validators.required]);
  genderformControl = new FormControl();
  nameformControl = new FormControl();
  lastnameformControl = new FormControl();
  housenumberformControl = new FormControl();
  voterIdformControl = new FormControl();
  @ViewChild('BuildCommunicationpopup', { static: true })
  BuildCommunicationpopup!: TemplateRef<any>;
  buildCommunicationName = new FormControl();
  buildDescripation = new FormControl();
  buildTelegramcheck: boolean = false;
  buildWhatsAppcheck: boolean = false;
  buildInstagramcheck: boolean = false;
  buildemailcheck: boolean = false;
  emailSubjectLine: any;
  emailMessage: any;
  buildSMScheck: boolean = false;
  SMSSubjectLine: any;
  SMSMessage: any;
  mandalnames: any;
  pollingstationnames: any;
  sectionnoandnames: any;
  searchCount: number = 0;
  apidata: any;
  isFilterButtonDisabled: boolean = true;
  ivinids: any;
  filterValues: any;
  castValues: any;
  numberValues: any;
  partyidValues: any;
  professionValues: any;
  contactmodeValues: any;
  nonlocalValues: any;
  dissidentValues: any;
  joinpartyValues: any;
  physicallyValues: any;
  habitationValues: any;
  fromageValues: any;
  toageValues: any;
  buttonstatus: any;
  CountData: any;
  selectedFilterCount: number = 0;
  dialogRef!: MatDialogRef<any>;
  editviewid: any;
  editdetails: any;
  copyeditid: any;
  communicationfortype: string = 'communication';
  castnames: any;
  communicationquickname: any;
  quickdata: any;

  constructor(
    private ivinservice:IvinService, 
    private dialog:MatDialog, 
    private apollo:Apollo,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.communicationquickname = history.state.quickcom;
    console.log('communicationquickname', this.communicationquickname);
    this.EditViewGet();
    this.quickinsightsget();
  }

  // Based on the Constituency values the mandalnames data get
  ConstituencyChange(event:any) {
    // this.ivinservice.GetMandals(event).subscribe((response:any) => {
    //   this.mandalnames = response.Result;
    // });
    const constituencyvariable = {
      constituency: this.constituencyformControl.value
    };
    this.apollo.use('userivin').query({
      query: Mandals,
      variables: constituencyvariable
    }).subscribe(({data}:any) => {
      this.mandalnames = data.uniqueMandals;
    });

    this.apollo.use('userivin').query({
      query: CastData,
      variables: constituencyvariable
    }).subscribe(({data}:any) => {
      this.castnames = data.uniqueCaste;
    });
  }

  // Based on the mandal values the pollingstationnames data get
  MandalChange(event:any) {
    // this.ivinservice.GetPollingstations(event).subscribe((response:any) => {
    //   this.pollingstationnames = response.Result;
    // });
    const mandalvariable = {
      constituency: this.constituencyformControl.value,
      mandal: this.mandalformControl.value
    };
    this.apollo.use('userivin').query({
      query: PollingStationsNameadNumber,
      variables: mandalvariable
    }).subscribe(({data}:any) => {
      this.pollingstationnames = data.uniquePollingstationCombinations;
    });
  }

  // Based on the pollingstation values the sectionnoandname data get
  SectionChange(event:any) {
    // this.ivinservice.GetSectionNames(event).subscribe((response:any) => {
    //   this.sectionnoandnames = response.Result;
    // });
    const sectionvariables = {
      pollingstationnameandnumber: this.pollingstationformControl.value
    };
    this.apollo.use('userivin').watchQuery({
      query: SectionNameandNumber,
      variables: sectionvariables
    }).valueChanges.subscribe(({data}:any) => {
      this.sectionnoandnames = data.uniqueSectionname;
    });
  }

  // Using this method get the data in table
  OnSearch() {
    this.constituencyformControl.markAsTouched();
    this.mandalformControl.markAsTouched();
    this.pollingstationformControl.markAllAsTouched();
    
    // const constituencyValue = this.constituencyformControl.value || null;
    // const mandalValue = this.mandalformControl.value || null;
    // const pollingStationValue = this.pollingstationformControl.value || null;
    // const genderValue = this.genderformControl.value || null;
    // const nameValue = this.nameformControl.value || null;
    // const sectionValue = this.sectionnumberandnameformControl.value || null;
    // const lastNameValue = this.lastnameformControl.value || null;
    // const houseNumberValue = this.housenumberformControl.value || null;
    // const voterIdValue = this.voterIdformControl.value || null;

    // this.ivinservice.SearchCount(constituencyValue,pollingStationValue,genderValue,nameValue,sectionValue,lastNameValue,houseNumberValue,mandalValue,voterIdValue)
    // .subscribe((response:any) => {
    //   this.apidata = response.Result;
    //   this.isFilterButtonDisabled = false;
    //   this.searchCount = response.Result.Count;
    //   console.log('searchCount', this.searchCount);
    //   this.ivinids = response.Result.IvinIds.join(",");
    //   console.log('ivinids', this.ivinids);
    // });
    const searchvariables = {
      constituency: this.constituencyformControl.value || null, 
      mandal: this.mandalformControl.value || null,
      pollingstationnameandnumber: this.pollingstationformControl.value || null,
      sectionnameandnumber: this.sectionnumberandnameformControl.value || null,
      gender: this.genderformControl.value || null,
      name: this.nameformControl.value || null,
      lastname: this.lastnameformControl.value || null,
      home: this.housenumberformControl.value || null,
      caste: this.castValues,
      contactmode: this.contactmodeValues,
      contactnumber: this.numberValues,
      dissident: this.dissidentValues,
      habitations: this.habitationValues,
      interestToJoinparty: this.joinpartyValues,
      nonlocaladdress: this.nonlocalValues,
      partyincination: this.partyidValues,
      physicallychallenged: this.physicallyValues,
      profession: this.professionValues,
      fromage: this.fromageValues ? this.fromageValues.toString() : null,
      toage: this.toageValues ? this.toageValues.toString() : null
    };
    console.log('searchvariables', searchvariables);
    this.apollo.use('userivin').watchQuery({
      query: CountData,
      variables: searchvariables,
    }).valueChanges.subscribe(({data}:any) => {
      this.CountData = data.contactCount;
      this.isFilterButtonDisabled = false;
      this.searchCount = this.CountData.ivinidcount;
      this.ivinids = this.CountData.ivinidList.join(',');
    });
  }

  // Reset the values
  OnReset() {
    this.constituencyformControl.reset();
    this.mandalformControl.reset();
    this.pollingstationformControl.reset();
    this.sectionnumberandnameformControl.reset();
    this.genderformControl.reset();
    this.nameformControl.reset();
    this.lastnameformControl.reset();
    this.housenumberformControl.reset();
    this.voterIdformControl.reset();
    this.searchCount = 0;
    this.isFilterButtonDisabled = true;
  }

  // Build communication popup
  BuildOpen() {
    this.dialogRef = this.dialog.open(this.BuildCommunicationpopup);
  }

  // Filter Popup component
  FilterPopUp() {
    const dialogRef = this.dialog.open(FilterComponent,{
      data: { filterValues: this.filterValues, editValues: this.editdetails, castdata: this.castnames }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result != null) {
        this.filterValues = result;
        console.log('filter result:', this.filterValues);
        this.castValues = this.filterValues.castFilterValue;
        this.numberValues = this.filterValues.numberFilterValue;
        this.partyidValues = this.filterValues.partyinclinationFilterValue;
        this.professionValues = this.filterValues.professionFilterValue;
        this.contactmodeValues = this.filterValues.contactmodeFilterValue;
        this.nonlocalValues = this.filterValues.nonlocalFilterValue;
        this.dissidentValues = this.filterValues.dissidentFilterValue;
        this.joinpartyValues = this.filterValues.joinpartyFilterValue;
        this.physicallyValues = this.filterValues.physicallyFilterValue;
        this.habitationValues = this.filterValues.habitationFilterValue;
        this.fromageValues = this.filterValues.startvalue;
        this.toageValues = this.filterValues.endvalue;
        this.updateFilterCount();
        this.OnSearch();
      }
    });
  }

  // Update the filter value count
  updateFilterCount() {
    let count = 0;
    if (this.castValues !== null) count++;
    if (this.numberValues !== null) count++;
    if (this.partyidValues !== null) count++;
    if (this.professionValues !== null) count++;
    if (this.contactmodeValues !== null) count++;
    if (this.nonlocalValues !== null) count++;
    if (this.dissidentValues !== null) count++;
    if (this.joinpartyValues !== null) count++;
    if (this.physicallyValues !== null) count++;
    if (this.habitationValues !== null) count++;
    if (this.fromageValues !== null) count++;
    if (this.toageValues !== null) count++;
    this.selectedFilterCount = count;
  }

  // Communication Post Method
  BuildPost() {
    let communicationTypes: string[] = [];
    if (this.buildemailcheck) {
      communicationTypes.push('Email');
    }
    if (this.buildSMScheck) {
      communicationTypes.push('SMS');
    }
    if (this.buildTelegramcheck) {
      communicationTypes.push('Telegram');
    }
    if (this.buildWhatsAppcheck) {
      communicationTypes.push('WhatsApp');
    }
    if (this.buildInstagramcheck) {
      communicationTypes.push('Instagram');
    }
    const communicationType = communicationTypes.join(',');
    
    let valueToSend;

    if (this.communicationquickname) {
        valueToSend = this.communicationquickname;
    } else {
        valueToSend = this.communicationfortype;
    }

    const builddata = {
      Constituency: this.constituencyformControl.value || null,
      PollingStationName: this.pollingstationformControl.value || null,
      Name: this.nameformControl.value || null,
      Section_No_and_Name: this.sectionnumberandnameformControl.value || null,
      LastName: this.lastnameformControl.value || null,
      Home: this.housenumberformControl.value || null,
      Mandal: this.mandalformControl.value || null,
      VoterId: this.voterIdformControl.value || null,
      IvinIds: this.ivinids || null,
      Caste: this.castValues || null,
      ContactNumber: this.numberValues || null,
      PartyInclination_id: this.partyidValues || null,
      Profession: this.professionValues || null,
      ContactMode: this.contactmodeValues || null,
      Non_Local_Address: this.nonlocalValues || null,
      Dissident: this.dissidentValues || null,
      InterestToJoinParty: this.joinpartyValues || null,
      PhysicallyChallenged: this.physicallyValues || null,
      Habitations_id: this.habitationValues || null,
      CommunicationFor: valueToSend,
      CommunicationName: this.buildCommunicationName.value || null,
      Discription: this.buildDescripation.value || null,
      CommunicationType: communicationType || null,
      SubjectLineForMessage: this.SMSSubjectLine || null,
      TextMessageForMessage: this.SMSMessage || null,
      SubjectLineForEmail: this.emailSubjectLine || null,
      TextMessageForEmail: this.emailMessage || null,
      Status: this.buttonstatus
    };
    console.log('builddata', builddata);
    if(!this.editviewid){
      this.ivinservice.PostCommuication(builddata).subscribe((data:any) => {
        if(data['Status'] === 200){
          console.log('posted data', data);
          this.snackBar.open('Data Posted Successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          if (this.dialogRef) {
            this.dialogRef.close();
            // this.ResetPopup();
          }
        }
      });
    } else {
      this.ivinservice.UpdateCommunication(this.editviewid,builddata).subscribe((data:any) => {
        if(data['Status'] === 200){
          console.log('updated data', data);
          this.snackBar.open('Data Update Successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          if (this.dialogRef) {
            this.dialogRef.close();
          }
        }
      });
    }
  }

  // Reset the Popup fields
  ResetPopup() {
    this.buildCommunicationName.reset();
    this.buildDescripation.reset();
    this.buildemailcheck = false;
    this.buildSMScheck = false;
    this.buildTelegramcheck = false;
    this.buildWhatsAppcheck = false;
    this.buildInstagramcheck = false;
    this.SMSSubjectLine = null;
    this.SMSMessage = null;
    this.emailSubjectLine = null;
    this.emailMessage = null;
  }

  // SendNow and SaveAsDraft Values
  ButtonClick(buttonValue:any){
    this.buttonstatus = buttonValue;
  }

  // Edit&View Get Method
  EditViewGet() {
    this.editviewid = sessionStorage.getItem('communicationeditId');
    this.copyeditid = sessionStorage.getItem('communicationCopyId');
    this.ivinservice.Geteditview(this.editviewid || this.copyeditid).subscribe((data:any) => {
      if(data['Status'] === 200){
        this.editdetails = data.Result[0];
        console.log("editdetails", this.editdetails);
        this.ivinids = this.editdetails.IvinIds;
        this.isFilterButtonDisabled = false;
        this.constituencyformControl.setValue(this.editdetails.Constituency);
        this.mandalformControl.setValue(this.editdetails.Mandal);
        this.pollingstationformControl.setValue(this.editdetails.PollingStationName);
        this.sectionnumberandnameformControl.setValue(this.editdetails.Section_No_and_Name);
        this.genderformControl.setValue(this.editdetails.Gender);
        this.nameformControl.setValue(this.editdetails.Name);
        this.lastnameformControl.setValue(this.editdetails.LastName);
        this.housenumberformControl.setValue(this.editdetails.Home);
        this.searchCount = this.editdetails.Count;
        this.buildCommunicationName.setValue(this.editdetails.CommunicationName);
        this.buildDescripation.setValue(this.editdetails.Discription);
        if (this.editdetails.CommunicationType && this.editdetails.CommunicationType.includes('Email')) {
          this.buildemailcheck = true;
        } else {
          this.buildemailcheck = false;
        }
        if (this.editdetails.CommunicationType && this.editdetails.CommunicationType.includes('SMS')) {
          this.buildSMScheck = true;
        } else {
          this.buildSMScheck = false;
        }
        this.SMSSubjectLine = this.editdetails.SubjectLineForMessage;
        this.SMSMessage = this.editdetails.TextMessageForMessage;
        this.emailSubjectLine = this.editdetails.SubjectLineForEmail;
        this.emailMessage = this.editdetails.TextMessageForEmail;
      }
    });
  }

quickinsightsget() {
  this.quickdata = history.state.rowData;
  console.log('quickdata', this.quickdata);
  this.constituencyformControl.setValue(this.quickdata.Constituency);
  this.ConstituencyChange(this.quickdata.Constituency);
  this.mandalformControl.setValue(this.quickdata.Mandal);
  this.MandalChange(this.quickdata.PollingStationName);
  this.pollingstationformControl.setValue(this.quickdata.PollingStationName);
  this.SectionChange(this.quickdata.Section_No_and_Name);
  this.sectionnumberandnameformControl.setValue(this.quickdata.Section_No_and_Name);
  this.genderformControl.setValue(this.quickdata.Gender);
  this.nameformControl.setValue(this.quickdata.Name);
  this.lastnameformControl.setValue(this.quickdata.LastName);
  this.housenumberformControl.setValue(this.quickdata.Home);
  this.searchCount = this.quickdata.Count;
  this.ivinids = this.quickdata.IvinIds;
}

}
