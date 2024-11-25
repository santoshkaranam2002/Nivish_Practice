import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IvinService } from '../ivin.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterComponent } from '../filter/filter.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { RelationComponent } from './relation/relation.component';
import { Apollo } from 'apollo-angular';
import { CastData, Mandals, PollingStationsNameadNumber, SectionNameandNumber, TableData } from './graphql.analytics';

interface BulkData {
  ivinid?: string;
  Caste?: string;
  Profession?: string;
  ContactNumber?: string;
  PartyInclination?: string;
  Dissident?: any;
  InformedPersonForDissident?: string | null;
  CommentsForDissident?: string | null;
  ContactMode?: string;
  ContactedBy?: string | null;
  CommentsForTeamContacted?: string | null;
  InterestToJoinParty?: any;
  InformedPerson?: string | null;
  CommentsForJoinParty?: string | null;
  IsVoted?: any;
}

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DataAnalyticsComponent implements OnInit {
  constituencyformControl = new FormControl('', [Validators.required]);
  mandalformControl = new FormControl('', [Validators.required]);
  pollingstationformControl = new FormControl('', [Validators.required]);
  sectionnumberandnameformControl = new FormControl('', [Validators.required]);
  genderformControl = new FormControl();
  nameformControl = new FormControl();
  lastnamelikesearchformControl = new FormControl();
  housenumberformControl = new FormControl();
  voterIdformControl = new FormControl();
  lastnameformControl = new FormControl();
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = ['select','Voter_SerialNumber', 'VoterId', 'Name', 'LastName', 'Guardian', 'Home', 'Age', 'Gender', 'Action'];
  expandedElement: any | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  mandalnames: any;
  pollingstationnames: any;
  sectionnames: any;
  isLoadingsearch: boolean = false;
  casteform = new FormControl();
  @ViewChild('bulkeditpopup', { static: true })
  bulkeditpopup!: TemplateRef<any>;
  @ViewChild('VoterDetailspopup', { static: true })
  VoterDetailspopup!: TemplateRef<any>;
  @ViewChild('ViewCardpopup', { static: true })
  ViewCardpopup!: TemplateRef<any>;
  votername = new FormControl();
  voterlastname = new FormControl();
  voterDependent = new FormControl();
  voterRelationship = new FormControl();
  voterVoterID = new FormControl();
  voterHouseNumber = new FormControl();
  voterAge = new FormControl();
  votergender = new FormControl();
  voterSerialNumber = new FormControl();
  voterState = new FormControl();
  voterDistrict = new FormControl();
  voterConstituency = new FormControl();
  voterPollingStationNumber = new FormControl();
  voterPollingStationName = new FormControl();
  voterPollingStationLocation = new FormControl();
  voterSectionNumberandName = new FormControl();
  voterMandal = new FormControl();
  campaigncaste = new FormControl();
  campaignContactNumber = new FormControl();
  campaignProfession = new FormControl();
  campaignPartyInclination = new FormControl();
  campaignStrength = new FormControl();
  campaignWeakness = new FormControl();
  campaignContactMode = new FormControl();
  campaignContactBy: any;
  campaignContactedcomments: any;
  campaignContactedBy = new FormControl();
  campaignContactedComments = new FormControl();
  campaignDissident = new FormControl(false);
  campaignInformedPersonDissident: any;
  campaigncommentdissident: any;
  campaignHabitations = new FormControl();
  campaignSchemes = new FormControl();
  campaignnonLocalAddress = new FormControl();
  campaignCurrentAddress: any;
  campaignInfluencer = new FormControl();
  campaignvotersinfluencer: any;
  campaignInterestedparty = new FormControl(false);
  campaignInterestedperson: any;
  campaignInterestedcomments: any;
  campaignIsVoted = new FormControl();
  campaignDuplicated = new FormControl();
  campaiagnPhysicallyChallenged = new FormControl();
  campaignDeleted = new FormControl();
  bulkcaste = new FormControl();
  bulkProfession = new FormControl();
  bulkContactnumber = new FormControl();
  bulkPartyinclination = new FormControl();
  bulkInterestedJoinParty = new FormControl(false);
  bulkInterestedPerson: any;
  bulkCommentsParty: any;
  bulkPersonInformed: any;
  bulkDissidentComments: any;
  bulkContactmode = new FormControl();
  bulkLastName = new FormControl();
  bulkDissident = new FormControl(false);
  bulkisVoted = new FormControl(false);
  bulkContactBy: any;
  bulkContactComment: any;
  districtnames: any;
  constituencynames: any;
  pollingnames: any;
  pollingnumbers: any;
  pollinglocations: any;
  selectedvalues: any;
  sectionlocations: any;
  tbData: any;
  Mandalnames: any;
  AssemblyConstituencyNoandName: any;
  MainTownORVillage: any;
  PinCode: any;
  RevenueDivision: any;
  PoliceStation: any;
  ivinid: any;
  firstname: any;
  allParty: any;
  allhabitationnames: any;
  allSchemename: any;
  campaigndata: any;
  campaignivinid: any;
  userId: any;
  workerId: any;
  otherparty: any;
  expired: any;
  postelballot: any;
  campemail: any;
  selectedRows: any[] = [];
  selection = new SelectionModel<any>(true, []);
  selectedivinid: any;
  multipleivinids: any;
  filterValues: any;
  joinfilteroptions: any;
  filterdata: any;
  finalIvinDataAnalytics: any[] = [];
  isFilterButtonDisabled: boolean = true;
  housenumber: any;
  formData: any;
  isPersonAlive: boolean = true;
  dialogRef!: MatDialogRef<any>;
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
  bulkloading: boolean = false;
  selectedIds: number[] = [];
  selectedidslenght: any;
  error: any;
  castnames: any;

  constructor(private apollo:Apollo, private ivinservice:IvinService, private dialog:MatDialog, private snackbar:MatSnackBar){}

  ngOnInit(): void { 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Based on the Constituencys the mandals names get the data
  ConstituencyChange(event:any){
    // this.ivinservice.GetMandals(event).subscribe((data:any) => {
    //   this.mandalnames = data.Result;
    // })
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

  // Based on the mandal the pollingstations names get the data
  MandalChange(event:any){
    // this.ivinservice.GetPollingstations(event).subscribe((data:any) => {
    //   this.pollingstationnames = data.Result;
    // })
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

  // Based on the pollingstations the section names get the data
  SectionChange(event:any){
    // this.ivinservice.GetSectionNames(event).subscribe((data:any) => {
    //   this.sectionnames = data.Result;
    // })
    const sectionvariables = {
      pollingstationnameandnumber: this.pollingstationformControl.value
    };
    this.apollo.use('userivin').watchQuery({
      query: SectionNameandNumber,
      variables: sectionvariables
    }).valueChanges.subscribe(({data}:any) => {
      this.sectionnames = data.uniqueSectionname;
    });
  }

  // Using this method get the data in table
  OnSearch(){
    this.constituencyformControl.markAsTouched();
    this.mandalformControl.markAsTouched();
    this.pollingstationformControl.markAsTouched();

  //   this.isLoadingsearch = true;
  //   const constituencyValue = this.constituencyformControl.value || null;
  //   const pollingstationValue = this.pollingstationformControl.value || null;
  //   const genderValue = this.genderformControl.value || null;
  //   const nameValue = this.nameformControl.value || null;
  //   const sectionValue = this.sectionnumberandnameformControl.value || null;
  //   const lastnameValue = this.lastnamelikesearchformControl.value || null;
  //   const housenumberValue = this.housenumberformControl.value || null;
  //   const mandalValue = this.mandalformControl.value || null;
  //   const casteValue = this.campaigncaste.value || null;
  //   const serialnumberValue = this.lastnameformControl.value || null;
  //   const voterIdValue = this.voterIdformControl.value || null;

  //   this.ivinservice.GetTableData(constituencyValue, pollingstationValue, genderValue, nameValue, sectionValue, lastnameValue, housenumberValue, mandalValue, casteValue, serialnumberValue, voterIdValue)
  //   .subscribe((data: any) => {
  //     if (data['Status'] === 200) {
  //       this.dataSource.data = data.Result;
  //       console.log('Table Data', this.dataSource.data);
  //       this.isFilterButtonDisabled = false;
  //       this.multipleivinids = data.Result.map((item:any) => item.ivin_id).join(",");
  //       this.ivinservice.IvinId = this.multipleivinids;
  //     } else {
  //       console.error(data.message);
  //     }
  //   },
  //   (error: any) => {
  //     console.error(error);
  //     // Display specific error message to the user in an alert
  //     const errorMessage = error.error && error.error.Message ? error.error.Message 
  //     : 'An error occurred. Please try again.';
  //     alert(errorMessage);
  //   }
  // ).add(() => {
  //     this.isLoadingsearch = false;
  //   });
    this.isLoadingsearch = true;
    const searchvariables = {
      constituency: this.constituencyformControl.value || null,
      mandal: this.mandalformControl.value || null,
      pollingstationnameandnumber: this.pollingstationformControl.value || null,
      sectionnameandnumber: this.sectionnumberandnameformControl.value || null,
      gender: this.genderformControl.value || null,
      name: this.nameformControl.value || null,
      lastname: this.lastnameformControl.value || null,
      lastnamelikesearch: this.lastnamelikesearchformControl.value || null,
      home: this.housenumberformControl.value || null,
      voterid: this.voterIdformControl.value || null,
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
    this.apollo.use('userivin').query({
      query: TableData,
      variables: searchvariables,
      fetchPolicy: 'network-only',
    }).subscribe(({data, error}:any) => {
      this.dataSource.data = data.readContact;
      console.log('dataSource', this.dataSource.data);
      this.isFilterButtonDisabled = false;
      this.multipleivinids = this.dataSource.data.map(entry => entry.ivinid).join(',');
    }).add(() => {
      this.isLoadingsearch = false;
    });
  }

  // Reset the values with empty fields
  OnReset(){
    this.constituencyformControl.setValue('');
    this.mandalformControl.setValue('');
    this.pollingstationformControl.setValue('');
    this.sectionnumberandnameformControl.setValue('');
    this.genderformControl.setValue('');
    this.nameformControl.setValue('');
    this.lastnamelikesearchformControl.setValue('');
    this.housenumberformControl.setValue('');
    this.voterIdformControl.setValue('');
    this.lastnameformControl.setValue('');
    this.isFilterButtonDisabled = true;
    this.dataSource.data = [];
  }

  // Table checkboxes
  toggleAllCheckboxes(event: any) {
    if (event.checked) {
      this.dataSource.data.forEach((element: any) => {
        if (!this.selectedIds.includes(element.ivinid)) {
          this.selectedIds.push(element.ivinid);
        }
      });
    } else {
      this.selectedIds = [];
    }
    this.ngOnChanges();
  }

  ngOnChanges() {
    console.log('Selected IDs:', this.selectedIds);
    this.selectedidslenght = this.selectedIds.length;
  }

  toggleCheckbox(ivinid: number) {
    if (this.selectedIds.includes(ivinid)) {
      this.selectedIds = this.selectedIds.filter((item:any) => item !== ivinid);
    } else {
      this.selectedIds.push(ivinid);
    }
    this.ngOnChanges();
  }
  // End for Table checkboxes

  // filter popup component
  FilterPopup() {
    const dialogRef = this.dialog.open(FilterComponent,{
      data: { filterValues: this.filterValues, castdata: this.castnames }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterValues = result;
        console.log('filterValues', this.filterValues);
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
        this.OnSearch();
      }
    });
  }

  // open popup for Campaign Details
  BulkEdit(): void {
    if (this.selectedIds.length >= 2) {
      this.dialogRef = this.dialog.open(this.bulkeditpopup);
    } else {
      console.log("Select at least two items to perform bulk edit");
    }
    this.GetPartyMaster();
  }

  // Update Campaign Bulk Edit
  UpdateBulkEdit() {
    const bulkdata: BulkData = {};
    bulkdata.ivinid = this.selectedIds.join(',');
    if (this.bulkcaste.value !== null && this.bulkcaste.value !== undefined) {
      bulkdata.Caste = this.bulkcaste.value;
    }
    if (this.bulkProfession.value !== null && this.bulkProfession.value !== undefined) {
      bulkdata.Profession = this.bulkProfession.value;
    }
    if (this.bulkContactnumber.value !== null && this.bulkContactnumber.value !== undefined) {
      bulkdata.ContactNumber = this.bulkContactnumber.value;
    }
    if (this.bulkPartyinclination.value !== null && this.bulkPartyinclination.value !== undefined) {
      bulkdata.PartyInclination = this.bulkPartyinclination.value;
    }
    if (this.bulkDissident.value !== null && this.bulkDissident.value !== undefined) {
      bulkdata.Dissident = this.bulkDissident.value;
    }
    if (this.bulkPersonInformed !== null && this.bulkPersonInformed !== undefined) {
      bulkdata.InformedPersonForDissident = this.bulkPersonInformed;
    }
    if (this.bulkDissidentComments !== null && this.bulkDissidentComments !== undefined) {
      bulkdata.CommentsForDissident = this.bulkDissidentComments;
    }
    if (this.bulkContactmode.value !== null && this.bulkContactmode.value !== undefined) {
      bulkdata.ContactMode = this.bulkContactmode.value;
    }
    if (this.bulkContactBy !== null && this.bulkContactBy !== undefined) {
      bulkdata.ContactedBy = this.bulkContactBy;
    }
    if (this.bulkContactComment !== null && this.bulkContactComment !== undefined) {
      bulkdata.CommentsForTeamContacted = this.bulkContactComment;
    }
    if (this.bulkInterestedJoinParty.value !== null && this.bulkInterestedJoinParty.value !== undefined) {
      bulkdata.InterestToJoinParty = this.bulkInterestedJoinParty.value;
    }
    if (this.bulkInterestedPerson !== null && this.bulkInterestedPerson !== undefined) {
      bulkdata.InformedPerson = this.bulkInterestedPerson;
    }
    if (this.bulkCommentsParty !== null && this.bulkCommentsParty !== undefined) {
      bulkdata.CommentsForJoinParty = this.bulkCommentsParty;
    }
    if (this.bulkisVoted.value !== null && this.bulkisVoted.value !== undefined) {
      bulkdata.IsVoted = this.bulkisVoted.value;
    }
    console.log('bulkdata', bulkdata);
    this.bulkloading = true;
    this.ivinservice.UpdateCampaign(bulkdata).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          console.log('Update Success BulkEdit', data);
          this.snackbar.open('Bulk Data Updated Successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dialogRef.close();
          this.bulkloading = false;
        } else {
          this.snackbar.open('Failed to Update Bulk data', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      },
    );
  }

  // open popup for Voter Details
  VoterEdit(element:any){
    this.votername.setValue(element.Name);
    this.voterlastname.setValue(element.LastName);
    this.voterDependent.setValue(element.Guardian);
    this.voterRelationship.setValue(element.RelationType);
    this.voterVoterID.setValue(element.VoterId);
    this.voterHouseNumber.setValue(element.Home);
    this.voterAge.setValue(element.Age);
    this.votergender.setValue(element.Gender);
    this.voterSerialNumber.setValue(element.VoterSerialNumber);
    this.voterState.setValue(element.State);
    this.StateChange(element.State);
    this.voterDistrict.setValue(element.District);
    this.DistrictChange(element.District);
    this.voterConstituency.setValue(element.Constituency);
    this.MandalNames(element.Constituency);
    this.voterMandal.setValue(element.Mandal);
    this.VoterConstituencyChange(element.Mandal);
    this.voterPollingStationName.setValue(element.PollingStationName);
    this.PollingNameChange(element.PollingStationName);
    this.voterPollingStationNumber.setValue(element.PollingStationNumber);
    this.PollingLocationChange(element.PollingStationNumber);
    this.voterPollingStationLocation.setValue(element.PollingStationLocation);
    const pollingStationName = this.voterPollingStationName.value;
    const pollingStationNumber = this.voterPollingStationNumber.value;
    this.selectedvalues = `${pollingStationName}-${pollingStationNumber}`;
    this.SectionLocationChange(this.selectedvalues);
    this.voterSectionNumberandName.setValue(element.SectionNoandName);

    this.dialogRef = this.dialog.open(this.VoterDetailspopup);
    this.ivinid = element.ivinid;
    this.firstname = element.FirstName;
    this.AssemblyConstituencyNoandName = element.AssemblyConstituencyNoandName;
    this.MainTownORVillage = element.MainTownOrVillage;
    this.PinCode = element.PinCode;
    this.RevenueDivision = element.RevenueDivision;
    this.PoliceStation = element.PoliceStation;
  }

  // Update Voter Details Data
  UpdateVoterEdit(){
    const voterdata = {
      VoterId: this.voterVoterID.value,
      Name: this.votername.value,
      FirstName: this.firstname,
      LastName: this.voterlastname.value,
      RelationType: this.voterRelationship.value,
      Guardian: this.voterDependent.value,
      Home: this.voterHouseNumber.value,
      Age: this.voterAge.value,
      Gender: this.votergender.value,
      State: this.voterState.value,
      District: this.voterDistrict.value,
      Constituency: this.voterConstituency.value,
      PollingStationNumber: this.voterPollingStationNumber.value,
      PollingStationName: this.voterPollingStationName.value,
      PollingStationLocation: this.voterPollingStationLocation.value,
      VoterSerialNumber: this.voterSerialNumber.value,
      Mandal: this.voterMandal.value,
      SectionNoandName: this.voterSectionNumberandName.value,
      AssemblyConstituencyNoandName: this.AssemblyConstituencyNoandName,
      MainTownORVillage: this.MainTownORVillage,
      PinCode: this.PinCode,
      RevenueDivision: this.RevenueDivision,
      PoliceStation: this.PoliceStation
    };
    console.log('voterdata', voterdata);
    this.ivinservice.UpdateVoterData(this.ivinid, voterdata).subscribe(
      (data:any) => {
        if (data['Status'] === 200) {
          console.log('Update Success Voter', data);
          this.snackbar.open('Voter Data Updated Successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.OnSearch();
          this.dialogRef.close();
        } else {
          this.snackbar.open('Failed to Update voter data', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
        }
      },
    );
  }

  getSchemeNameById(schemeId: number): string {
    const scheme = this.allSchemename.find((s: any) => s.SchId === schemeId);
    return scheme ? scheme.SchemeName : '';
  }

  // campaign Details Get
  CampaignGet(element:any){
    if (this.expandedElement !== element) {
      this.campaignivinid = element.ivinid;
      this.CampaignDetailsGet();
    }
    this.expandedElement = this.expandedElement === element ? null : element;
    this.GetPartyMaster();
    this.GetHabitations();
    this.GetSchemeName();
  }

  // Campaign Details Get function
  CampaignDetailsGet(){
    this.ivinservice.GetCampaignData(this.campaignivinid).subscribe((data:any) => {
      this.campaigndata = data.Result[0];
      this.userId = this.campaigndata.UserId;
      this.workerId = this.campaigndata.WorkerId;
      this.otherparty = this.campaigndata.Otherparty;
      this.expired = this.campaigndata.Expired;
      this.postelballot = this.campaigndata.PostelBallot;
      this.campemail = this.campaigndata.Email;

      this.campaigncaste.setValue(this.campaigndata.Caste);
      this.campaignContactNumber.setValue(this.campaigndata.ContactNumber);
      this.campaignProfession.setValue(this.campaigndata.Profession);
      this.campaignPartyInclination.setValue(this.campaigndata.PartyInclination);
      this.campaignStrength.setValue(this.campaigndata.Strength);
      this.campaignWeakness.setValue(this.campaigndata.Weakness);
      this.campaignContactMode.setValue(this.campaigndata.ContactMode);
      this.campaignContactBy = this.campaigndata.ContactedBy;
      this.campaignContactedcomments = this.campaigndata.CommentsForTeamContacted;
      const nonLocalAddressValue = this.campaigndata.NonLocalAddress === "true";
      this.campaignnonLocalAddress.setValue(nonLocalAddressValue);
      this.campaignCurrentAddress = this.campaigndata.CurrentAddress;
      this.campaignInfluencer.setValue(this.campaigndata.IsInfluencer);
      this.campaignvotersinfluencer = this.campaigndata.influencedVoters;
      this.campaignDissident.setValue(this.campaigndata.Dissident);
      this.campaignInformedPersonDissident = this.campaigndata.InformedPersonForDissident;
      this.campaigncommentdissident = this.campaigndata.CommentsForDissident;
      this.campaiagnPhysicallyChallenged.setValue(this.campaigndata.PhysicallyChallenged);
      this.campaignDeleted.setValue(this.campaigndata.Deleted);
      this.campaignInterestedparty.setValue(this.campaigndata.InterestToJoinParty);
      this.campaignInterestedperson = this.campaigndata.InformedPerson;
      this.campaignInterestedcomments = this.campaigndata.CommentsForJoinParty;
      this.campaignIsVoted.setValue(this.campaigndata.IsVoted);
      this.campaignDuplicated.setValue(this.campaigndata.Duplicate);
      this.campaignHabitations.setValue(this.campaigndata.Habitations);
      this.campaignSchemes.setValue(this.campaigndata.Schemes);
    });
  }

  // Campaign Details Update
  CampaignEdit(){
    const campaigndata = {
      ivinid: this.campaignivinid.toString(),
      UserId: this.userId,
      WorkerId: this.workerId,
      Caste: this.campaigncaste.value,
      Profession: this.campaignProfession.value,
      ContactNumber: this.campaignContactNumber.value,
      PartyInclination: this.campaignPartyInclination.value,
      Habitations: this.campaignHabitations.value,
      Schemes: this.campaignSchemes.value,
      Otherparty: this.otherparty,
      IsInfluencer: this.campaignInfluencer.value,
      influencedVoters: this.campaignvotersinfluencer,
      PhysicallyChallenged: this.campaiagnPhysicallyChallenged.value,
      Deleted: this.campaignDeleted.value,
      Duplicate: this.campaignDuplicated.value,
      NonLocalAddress: this.campaignnonLocalAddress.value.toString(),
      CurrentAddress: this.campaignCurrentAddress,
      Expired: this.expired,
      Strength: this.campaignStrength.value,
      Weakness: this.campaignWeakness.value,
      Dissident: this.campaignDissident.value,
      PostelBallot: this.postelballot,
      InformedPersonForDissident: this.campaignInformedPersonDissident,
      CommentsForDissident: this.campaigncommentdissident,
      ContactMode: this.campaignContactMode.value,
      ContactedBy: this.campaignContactBy,
      Email: this.campemail,
      CommentsForTeamContacted: this.campaignContactedcomments,
      InterestToJoinParty: this.campaignInterestedparty.value,
      InformedPerson: this.campaignInterestedperson,
      CommentsForJoinParty: this.campaignInterestedcomments,
      IsVoted: this.campaignIsVoted.value
    };
    console.log('campaigndata', campaigndata);
    this.ivinservice.UpdateCampaign(campaigndata).subscribe(
      (data:any) => {
        if (data['Status'] === 200) {
          console.log('update success Campaign', data);
          this.snackbar.open('Campaign Data Updated Successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.CampaignDetailsGet();
        } else {
          this.snackbar.open('Failed to Update Campaign data', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    );
  }

  // Based on this function Partynames and PID data will get
  GetPartyMaster(){
    this.ivinservice.PartyNames().subscribe((data:any) => {
      this.allParty = data.Result;
    })
  }

  // Based on this function Habitationnames and hcid data will get
  GetHabitations(){
    this.ivinservice.HabitationNames().subscribe((data:any) => {
      this.allhabitationnames = data.Result;
    })
  }

  // Based on this function schemename and schId data will get
  GetSchemeName(){
    this.ivinservice.SchemeName().subscribe((data:any) => {
      this.allSchemename = data.Result;
    })
  }

  // cancel the chips
  removedchip(selectedScheme:any){
    const removevalue = this.campaignSchemes.value;
    this.removeFirst(removevalue, selectedScheme);
    this.campaignSchemes.setValue(removevalue);
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  // open popup for view card
  ViewCard(){
    this.dialogRef = this.dialog.open(this.ViewCardpopup, {
    });
  }

  // close popup for view card
  ViewCardClose() {
    this.dialogRef.close();
  }

  // open popup for relation table
  RelationPopUp(element:any){
    this.housenumber = element.Home;
    const constituencyValue = this.constituencyformControl.value || null;
    const pollingstationValue = this.pollingstationformControl.value || null;
    const genderValue = this.genderformControl.value || null;
    const nameValue = this.nameformControl.value || null;
    const sectionValue = this.sectionnumberandnameformControl.value || null;
    const lastnamelikesearchValue = this.lastnamelikesearchformControl.value || null;
    const housenumberValue = this.housenumber;
    const mandalValue = this.mandalformControl.value || null;
    const casteValue = this.campaigncaste.value || null;
    const lastnameValue = this.lastnameformControl.value || null;
    const voterIdValue = this.voterIdformControl.value || null;

    this.formData = {
      constituencyValue,
      pollingstationValue,
      genderValue,
      nameValue,
      sectionValue,
      lastnamelikesearchValue,
      housenumberValue,
      mandalValue,
      casteValue,
      lastnameValue,
      voterIdValue
    };
    const dialogRef = this.dialog.open(RelationComponent, {
      data: this.formData
    });
  }

  // Based on this function district data will get
  StateChange(event:any){
    this.ivinservice.GetDistrict(event).subscribe((data:any) => {
      this.districtnames = data.Result;
    })
  }

  // Based on this function Constituencys data will get
  DistrictChange(event:any){
    this.ivinservice.GetMadugula(event).subscribe((data:any) => {
      this.constituencynames = data.Result;
    })
  }

  // Based on this function mandal data will get
  MandalNames(event:any){
    this.ivinservice.GetMandals(event).subscribe((data:any) => {
      this.Mandalnames = data.Result;
    })
  }

  // Based on this function polling names data will get
  VoterConstituencyChange(event:any){
    // const uppercaseConstituency = event.toUpperCase(); // Swagger Mandal
    this.ivinservice.GetPollingNames(event).subscribe((data:any) => {
      this.pollingnames = data.Result;
    })
  }

  // Based on this function polling numbers data will get
  PollingNameChange(event:any){
    this.ivinservice.GetPollingNumbers(event).subscribe((data:any) => {
      this.pollingnumbers = data.Result;
    })
  }

  // Based on this function polling locations data will get
  PollingLocationChange(event:any){
    this.ivinservice.GetPollingLocations(event).subscribe((data:any) => {
      this.pollinglocations = data.Result;
      const pollingStationName = this.voterPollingStationName.value;
      const pollingStationNumber = this.voterPollingStationNumber.value;
      this.selectedvalues = `${pollingStationName}-${pollingStationNumber}`;
    })
  }

  // Based on this function section names and locations data will get
  SectionLocationChange(event:any){
    this.ivinservice.GetSectionsnoandnames(this.selectedvalues).subscribe((data:any) => {
      this.sectionlocations = data.Result;
    })
  }
}