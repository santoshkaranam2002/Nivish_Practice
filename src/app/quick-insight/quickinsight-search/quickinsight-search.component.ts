import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { FilterComponent } from 'src/app/filter/filter.component';
import { IvinService } from 'src/app/ivin.service';
import { CastData, GetPostsByUsername, Getunique, Getuniquepollingstations, Getuniquesectionname, } from '../graphql_insight';

@Component({
  selector: 'app-quickinsight-search',
  templateUrl: './quickinsight-search.component.html',
  styleUrls: ['./quickinsight-search.component.scss']
})
export class QuickinsightSearchComponent {
  constituencyformControl = new FormControl('', [Validators.required]);
  mandalformControl = new FormControl('', [Validators.required]);
  pollingstationformControl = new FormControl('', [Validators.required]);
  sectionnumberandnameformControl = new FormControl('', [Validators.required]);
  genderformControl = new FormControl();
  nameformControl = new FormControl();
  lastnameformControl = new FormControl();
  housenumberformControl = new FormControl();
  lastnamelikeformControl = new FormControl();
  serialnumberformControl = new FormControl();
  quickinsightformcontrol = new FormControl();
  descripationformcontrol = new FormControl();
  isFilterButtonDisabled: boolean = true;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  mandalnames: any;
  pollingstationnames: any;
  sectionnoandnames: any;
  // displayeColumns = ['position','VoterID', 'Name', 'Dependent', 'House', 'Age', 'Gender', 'Action'];
  displayeColumns = ['Voter_SerialNumber', 'VoterId', 'Name','Guardian', 'Home', 'Age', 'Gender'];
  isLoadingsearch: boolean = false;
  campaigncaste = new FormControl();
  multipleivinids: any;
  error: any;
  pollingstation: any;
  posts: any;
  pollingsectionname: any;
  quickInsightsName: string = '';
  isAccordionOpened: boolean = false;
  accordionOpened: boolean = false;
  myloginId: any;
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
  quickeinsightstid: any;
  editdetails:any;
  dialogRef!: MatDialogRef<any>;
  quickinsightCopyId: any;
  castnames: any;

  constructor(private ivinservice:IvinService, private dialog:MatDialog, private snackBar:MatSnackBar,private apollo:Apollo,){}

  ngOnInit(): void { 
    this.myloginId = localStorage.getItem('loginId');
    this.EditandviewGet();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSourcepopup.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onAccordionOpened(): void {
    this.accordionOpened = true;
  }

   // Based on the Constituency values the mandalnames data get
   Constituency(event:any) {
    // this.ivinservice.GetMandals(event).subscribe((response:any) => {
    //   this.mandalnames = response.Result;
    // });
    const uniqueMandals = {
      constituency:this.constituencyformControl.value
    }
     console.log('constituency',uniqueMandals)
    this.apollo.use('userivin').watchQuery({
      query: Getunique,
      variables: uniqueMandals
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.mandalnames = data.uniqueMandals;
      console.log('data',this.mandalnames)
      this.error = error;

    })
    this.apollo.use('userivin').query({
      query: CastData,
      variables: uniqueMandals
    }).subscribe(({data}:any) => {
      this.castnames = data.uniqueCaste;
    });
  }
  // Based on the mandal values the pollingstationnames data get
  Mandal(event:any) {
    // this.ivinservice.GetPollingstations(event).subscribe((response:any) => {
    //   this.pollingstationnames = response.Result;
    // });
    const uniquePollingstationnumbers = {
      constituency: this.constituencyformControl.value,
      mandal:this.mandalformControl.value      
    };
    console.log('mandal',uniquePollingstationnumbers)
    this.apollo.use('userivin').watchQuery<any>({
      query:Getuniquepollingstations,
      variables:uniquePollingstationnumbers
    }).valueChanges.subscribe(({data,error}:any) =>{
      this.pollingstationnames = data.uniquePollingstationCombinations
      console.log('data',this.pollingstationnames)
      this.error = error;
    })
  }

  // Based on the pollingstation values the sectionnoandname data get
  Section(event:any) {
    // this.ivinservice.GetSectionNames(event).subscribe((response:any) => {
    //   this.sectionnoandnames = response.Result;
    // });

    const uniquesectionname = {
      pollingstationnameandnumber: this.pollingstationformControl.value,
    };
    console.log('sectionname',uniquesectionname);
      this.apollo.use('userivin').watchQuery<any>({
        query:Getuniquesectionname,
        variables:uniquesectionname,
      }).valueChanges.subscribe(({ data,error }: any) =>{
        this.sectionnoandnames = data.uniqueSectionname;
        console.log('data',this.sectionnoandnames)
        this.error = error;
      })
    
  }


  // Using this method get the data in table
  // OnSearch(){
  //   this.constituencyformControl.markAsTouched();
  //   this.mandalformControl.markAsTouched();
  //   this.pollingstationformControl.markAsTouched();

  //   this.isLoadingsearch = true;
  //   const constituencyValue = this.constituencyformControl.value || null;
  //   const pollingstationValue = this.pollingstationformControl.value || null;
  //   const genderValue = this.genderformControl.value || null;
  //   const nameValue = this.nameformControl.value || null;
  //   const sectionValue = this.sectionnumberandnameformControl.value || null;
  //   const lastnameValue = this.lastnameformControl.value || null;
  //   const housenumberValue = this.housenumberformControl.value || null;
  //   const mandalValue = this.mandalformControl.value || null;
  //   const casteValue = this.campaigncaste.value || null;
  //   const serialnumberValue = this.serialnumberformControl.value || null;
  //   const voterIdValue = this.voterIdformControl.value || null;

  //   this.ivinservice.GetTableData(constituencyValue, pollingstationValue, genderValue, nameValue, sectionValue, lastnameValue, housenumberValue, mandalValue, casteValue, serialnumberValue, voterIdValue)
  //   .subscribe((data: any) => {
  //     this.dataSource.data = data.Result;
  //     console.log('Table Data', this.dataSource.data);
  //     this.isFilterButtonDisabled = false;
  //     this.multipleivinids = data.Result.map((item:any) => item.ivin_id).join(",");
  //     this.ivinservice.IvinId = this.multipleivinids;
  //   },
  //   error => {
  //     console.error('Error fetching table data', error);
  //   })
  //   .add(() => {
  //     this.isLoadingsearch = false;
  //   });
  // }

  OnSearch(){
    this.isLoadingsearch = true;
    const readContact = {
      constituency: this.constituencyformControl.value || null,
      mandal:this.mandalformControl.value || null,
      pollingstationcombination:this.pollingstationformControl.value || null,
      sectionnoandame:this.sectionnumberandnameformControl.value || null,
      gender:this.genderformControl.value || null,
      name:this.nameformControl.value || null,
      lastname:this.lastnameformControl.value || null,
      lastnamelyk:this.lastnamelikeformControl.value || null,
      caste:this.castValues, 
      contactNumber:this.numberValues,
      profession:this.professionValues,
      partyInclination:this.partyidValues,
      contactMode:this.contactmodeValues,
      nonLocalAddress:this.nonlocalValues,
      dissident:this.dissidentValues,
      interestToJoinParty:this.joinpartyValues,
      physicallyChallenged:this.physicallyValues,
      habitations:this.habitationValues,
    };
    console.log("readContact",readContact)
    this.apollo.use('userivin').watchQuery<any>({
      query: GetPostsByUsername,
      variables: readContact
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.dataSource.data = data.readContact;
      console.log('data',this.dataSource.data);
      this.isLoadingsearch = false;
      this.isFilterButtonDisabled = false;
      this.multipleivinids = this.dataSource.data.map((item:any) => item.ivinid).join(',');
      console.log('multipleivinids', this.multipleivinids);
      this.error = error;
    })

    .add(() => {
          this.isLoadingsearch = false;
        });
  }


  OnReset(){
    this.constituencyformControl.setValue('');
    this.mandalformControl.setValue('');
    this.pollingstationformControl.setValue('');
    this.sectionnumberandnameformControl.setValue('');
    this.genderformControl.setValue('');
    this.nameformControl.setValue('');
    this.lastnameformControl.setValue('');
    this.housenumberformControl.setValue('');
    this.lastnamelikeformControl.setValue('');
    this.serialnumberformControl.setValue('');
    this.isFilterButtonDisabled = true;
    this.dataSource.data = [];
  }

  // Filter Popup component
  FilterPopUp() {
    const dialogRef = this.dialog.open(FilterComponent,{
      data: { filterValues: this.filterValues, editValues: this.editdetails, castdata: this.castnames }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result ) {
        this.filterValues = result;
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
        this.OnSearch()
      }
    });
  }

  post(){
    const savedata = {
      Constituency :this.constituencyformControl.value || null,
      PollingStationName :this.pollingstationformControl.value || null,
      Gender :this.genderformControl.value || null,
      Name : this.nameformControl.value || null,
      Section_No_and_Name :this.sectionnumberandnameformControl.value || null,
      LastName :this.lastnameformControl.value || null,
      Home :this.housenumberformControl.value || null,
      Mandal :this.mandalformControl.value || null,
      Lastname_like :this.lastnamelikeformControl.value || null,
      IvinIds :this.multipleivinids || null,
      Caste :this.castValues || null,
      ContactNumber :this.numberValues || null,
      PartyInclination_id :this.partyidValues || null,
      Profession :this.professionValues || null,
      ContactMode :this.contactmodeValues || null,
      Non_Local_Address :this.nonlocalValues || null,
      Dissident :this.dissidentValues || null,
      InterestToJoinParty :this.joinpartyValues || null,
      PhysicallyChallenged :this.physicallyValues || null,
      Habitations_id :this.habitationValues || null,
      from_age :null,
      to_age :null,
      Discription :this.descripationformcontrol.value || null,
      NameOfYourQuickInsights :this.quickInsightsName || null,
    }
    console.log('savedata',savedata)
    if(!this.quickeinsightstid){
    this.ivinservice.datapost(savedata).subscribe((data:any) => {
      if(data['Status'] === 200){
        console.log('posted data', data);
        this.snackBar.open('Data Posted Successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  } else {
    this.ivinservice.Updatequickinsights(this.quickeinsightstid,savedata).subscribe((data:any) => {
      if(data['Status'] === 200){
        console.log('updated data', data);
        this.snackBar.open('Data Update Successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }
}

  EditandviewGet(){
    this.quickeinsightstid = sessionStorage.getItem('quickinsightId');
    this.quickinsightCopyId = sessionStorage.getItem('quickinsightCopyId');
    this.ivinservice.EditandviewGet(this.quickeinsightstid || this.quickinsightCopyId ).subscribe((data:any) =>{
      // if(data && data.Result) {
      if(data['Status'] === 200) {
        this.editdetails = data.Result[0][0];
        console.log('details', this.editdetails)
        this.multipleivinids = this.editdetails.IvinIds;
        this.isFilterButtonDisabled = false;
        this.quickInsightsName = this.editdetails.NameOfYourQuickInsights;
        console.log('quickinsightsname',this.quickInsightsName)
        this.descripationformcontrol.setValue(this.editdetails.Discription);
        console.log('descripationformcontrol',this.descripationformcontrol)
        this.constituencyformControl.setValue(this.editdetails.Constituency);
        this.pollingstationformControl.setValue(this.editdetails.PollingStationName);
        this.genderformControl.setValue(this.editdetails.Gender);
        this.nameformControl.setValue(this.editdetails.Name);
        this.sectionnumberandnameformControl.setValue(this.editdetails.Section_No_and_Name);
        this.lastnameformControl.setValue(this.editdetails.LastName);
        this.housenumberformControl.setValue(this.editdetails.Home);
        this.mandalformControl.setValue(this.editdetails.Mandal);
        this.lastnamelikeformControl.setValue(this.editdetails.Lastname_like);
        //  this.dataSource.data =  this.details;
      }
    })
  }

}
