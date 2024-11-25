import { ChangeDetectorRef, Component,EventEmitter,Output,TemplateRef } from '@angular/core';
import { FormControl, Validators, } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { category, constituency, electiontype, gender, party, state, year } from '../probite.graphql';
import { IvinService } from 'src/app/ivin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { startWith, debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pro-bite-search',
  templateUrl: './pro-bite-search.component.html',
  styleUrls: ['./pro-bite-search.component.scss']
})
export class ProBiteSearchComponent {
  saveForm: FormGroup;
  filterpop : FormGroup;
  dialogRef!: MatDialogRef<any>;
  states: string[] = [];
  electiontypes: any;
  selectedstate: any;
  selectedelectiontype: any;
  years: any;
  selectedyear: any;
  constituencies: any;
  selectedconstituency: any;
  startvalue: number = 18;
  endvalue: number = 100;
  isViewData: boolean = false;
  selectedToggle: string = 'vizualizedata';
  chartcomponent = false;
  filterValues: any = { ageFilterValue: 'no' }; 
  genders: any;
  partyies: any;
  categories: any;
  selectedgender: any;
  selectedparty: any;
  selectedcategory: any;
  stateCtrl = new FormControl();
  electionCtrl = new FormControl();
  yearCtrl = new FormControl();
  partyCtrl = new FormControl();
  constituencyCtrl = new FormControl();
  filteredConstituencies!: Observable<string[]>;
  filteredYears! : Observable<string[]>;
  filteredElectiontype! : Observable<string[]>;
  filteredstates! : Observable<string[]>;
  filterparties! : Observable<string[]>;
  quickinsightid: any;
  quickinsightcopyid: any;
  userid: any;
  privatetooglechange: any;
  @Output() click = new EventEmitter<void>();
  disabled: boolean = false; // Add this property

  constructor(private dialog: MatDialog, private fb: FormBuilder, private apollo:Apollo,
    private cdr: ChangeDetectorRef, private ivinservice:IvinService,private snackbar:MatSnackBar){

    this.saveForm = this.fb.group({
      privatetoggle: ['Public'],
      quickinsightformcontrol : ['',Validators.required],
      descripationformcontrol : ['',Validators.required],
    });

    this.filterpop = this.fb.group({
      genderformcontrol : ['',Validators.required],
      partyformcontrol : ['',Validators.required],
      categoryformcontrol : ['',Validators.required]
    })
  }

    
  stateformControl = new FormControl('', [Validators.required]);
  electionformControl = new FormControl('', [Validators.required]);
  yearformControl = new FormControl('', [Validators.required]);
  constituencyformControl = new FormControl();

  ageFilter = new FormControl(false);


  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit(){
    this.quickinsightid = history.state.id;
    console.log('quickinsightid',this.quickinsightid);
    this.quickinsightcopyid = history.state.cpid
    console.log('quickinsightcopyid',this.quickinsightcopyid);
    this.editandviewdetails();
    this.statedropdown();
    this.ageFilter.setValue(this.filterValues.ageFilterValue === 'yes');
  }


  probitedetail(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
  }

  probitedetailclose(){
    this.dialogRef.close();
  }

  probitefilterpopup(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
  }

  probitefilterpopupclose(){
    this.dialogRef.close();
  }

  // cancelresetformcontrol(){
  //   if(!this.quickinsightid){
  //     this.filterpop.patchValue({
  //       ageFilter:false,
  //       startvalue : '',
  //       endvalue : '',
  //       genderformcontrol : '',
  //       partyformcontrol : '',
  //       categoryformcontrol : '',
  //     });
  //     this.ageFilter.setValue(false);
  //   }
  // }

  cancelresetformcontrol() {
    if (!this.quickinsightid) {      
      this.filterpop.patchValue({
        ageFilter: false,
        startvalue: 18,   
        endvalue: 100,  
        genderformcontrol: '',
        partyformcontrol: '',
        categoryformcontrol: ''
      });
      

      this.ageFilter.setValue(false);
      this.startvalue = 18;
      this.endvalue = 100;
    }
  }

  isFormValid(): boolean {
    return this.stateformControl.valid && this.electionformControl.valid && this.yearformControl.valid && this.constituencyformControl.valid;
  }

  onToggleChange(event: any) {
    this.selectedToggle = event.value;
    // Optionally, you can handle visibility of <app-probite-table> directly here
    if (this.selectedToggle === 'vizualizedata') {
      this.isViewData = false; // Hide the table when "Vizualize Data" is selected
    } else if (this.selectedToggle === 'viewdata') {
      this.isViewData = true; // Show the table when "View Data" is selected
    }
  }

  onSearch() :void {
    if (!this.isFormValid()) {
      alert('Please Select The State, Election Type, and Year.');
      return;
    }
    this.chartcomponent = false;
    this.cdr.detectChanges();
    this.chartcomponent = true;
    this.cdr.detectChanges();
  }

  onApply() {
    this.chartcomponent = false;
    this.cdr.detectChanges();
    this.chartcomponent = true;
    this.cdr.detectChanges();
    this.probitefilterpopupclose();
  }

  onreset(){
    this.stateformControl.reset();
    this.electionformControl.reset();
    this.yearformControl.reset();
    this.constituencyformControl.reset();
    this.selectedstate = '';
    this.selectedelectiontype = '';
    this.selectedyear = '';
    this.selectedconstituency = '';
    console.log("on reset",this.selectedstate);
    console.log("on reset",this.selectedelectiontype);
    console.log("on reset",this.selectedyear);
    console.log("on reset",this.selectedconstituency);
  }

  editandviewdetails(){
    this.ivinservice.downalodpdf(this.quickinsightid).subscribe((data:any)=>{
      if(data["Status"]===200){
        console.log("edit details get",data);
        // Extract values from the response
      const stateUTName = data.Result[0].StateUTName;
      const electionName = data.Result[0].ElectionName;
      const electionYear = data.Result[0].ElectionYear.toString();
      const acName = data.Result[0].ACName || '';

      const Gender = data.Result[0].Gender;
      const Party = data.Result[0].Party;
      const ACCategory = data.Result[0].ACCategory;
      const from_age = data.Result[0].from_age;
      const to_age = data.Result[0].to_age;

       // Check if age filter should be enabled
       const ageFilterEnabled = from_age !== null && to_age !== null;

       // Enable/disable age filter based on the presence of age values
       this.ageFilter.setValue(ageFilterEnabled);

       // If the age filter is enabled, set the slider values
       if (ageFilterEnabled) {
           this.startvalue = from_age;
           this.endvalue = to_age;
           this.logValues();

          // Manually trigger change detection to update the slider values
          this.cdr.detectChanges();

       }

      const QuickInsightsName = data.Result[0].QuickInsightsName;
      const QuickInsightsDescription = data.Result[0].QuickInsightsDescription;

      // Log the extracted values
      console.log("statename", stateUTName);
      console.log("ElectionName", electionName);
      console.log("ElectionYear", electionYear);
      console.log("ACName", acName);

      // Set the form control values
      this.stateformControl.setValue(stateUTName);
      this.onStateSelectionChange(stateUTName);
      this.electionformControl.setValue(electionName);
      this.onelectiontypechange(electionName);
      this.yearformControl.setValue(electionYear);
      this.onyearchange(electionYear);
      this.constituencyformControl.setValue(acName);
      this.onconstituencychange(acName);

      // Access controls within filterpop form group
      this.filterpop.get('genderformcontrol')?.setValue(Gender);
      this.filterpop.get('partyformcontrol')?.setValue(Party);
      this.filterpop.get('categoryformcontrol')?.setValue(ACCategory);

      // Access controls within filterpop form group
      this.saveForm.get('quickinsightformcontrol')?.setValue(QuickInsightsName);
      this.saveForm.get('descripationformcontrol')?.setValue(QuickInsightsDescription);
      this.onSearch();
      }else {
        console.error("Failed to get data", data);
    }
    })
  }


  statedropdown(){
    this.apollo.use('probite').watchQuery({
      query:state
    }).valueChanges.subscribe(({data}:any)=>{
      this.states = data.uniqueStateutnames;
      console.log("states",this.states);
       // Initialize filteredstates after data is fetched
       this.filteredstates = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterstates(value))
      );
    })
  }
  

  private _filterstates(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.states) {
      return [];
    }
    return this.states.filter((states: string) => states.toLowerCase().includes(filterValue));
  }

  onStateSelectionChange(event: any) {
    this.selectedstate = event.value || event;
    this.electionformControl.reset();
    this.yearformControl.reset();
    this.constituencyformControl.reset();
    this.electiontypes = null;
    this.years = null;
    this.constituencies = null;
    console.log("Selected state:", this.selectedstate);
    this.ivinservice.stateselected = this.selectedstate;
    console.log("on state change",this.electiontypes);
    console.log("on state change",this.years);
    console.log("on state change",this.constituencies);
    this.ivinservice.electionselected = '';
    this.ivinservice.yearselected = '';
    this.ivinservice.constituencyselected = '';
    this.selectedelectiontype = '';
    this.selectedyear = '';
    this.selectedconstituency = '';
    this.electiontypedropdown();
    this.genderget();
    this.partyget();
    this.categoryget();
  }


  electiontypedropdown(){
    const electionvariables = {
      statename : this.selectedstate,
    }
    // console.log("Variables being sent:", electionvariables);
    this.apollo.use('probite').watchQuery({
      query:electiontype,
      variables:electionvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.electiontypes = data.uniqueElectionname;
      console.log("electiontype",this.electiontypes);
      this.ivinservice.totalelectiontype = this.electiontypes;
      console.log("electiontype alll",this.ivinservice.totalelectiontype);
       // Initialize filteredelectiontype after data is fetched
       this.filteredElectiontype = this.electionCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterElectiontype(value))
      );
    })
  }
  

  private _filterElectiontype(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.electiontypes) {
      return [];
    }
    return this.electiontypes.filter((electiontypes: string) => electiontypes.toLowerCase().includes(filterValue));
  }

  onelectiontypechange(event:any){
    this.selectedelectiontype = event.value || event;
    console.log("selectedelectiontype",this.selectedelectiontype)
    this.ivinservice.electionselected = this.selectedelectiontype;
    this.yeardropdown();
  }


  yeardropdown(){
    const yearvariables = {
      statename : this.selectedstate,
      election : this.selectedelectiontype,
    }
    this.apollo.use('probite').watchQuery({
      query : year,
      variables : yearvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.years = data.uniqueElectionyear;
      console.log("years",this.years);
      this.ivinservice.allyears =  this.years;
      console.log("years all",this.ivinservice.allyears);
       // Initialize filteredyears after data is fetched
       this.filteredYears = this.yearCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterYears(value))
      );
    })
  }
  
  

  private _filterYears(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.years) {
      return [];
    }
    return this.years.filter((years: string) => years.toLowerCase().includes(filterValue));
  }

  onyearchange(event:any){
    this.selectedyear = event.value || event;
    console.log("selectedyear",this.selectedyear)
    this.ivinservice.yearselected = this.selectedyear;
    this.constituencydropdown();
  }

  constituencydropdown(){
    const constituencyvariables = {
      year : this.selectedyear,
      statename : this.selectedstate, 
      election : this.selectedelectiontype,
    }
    console.log("cons variables",constituencyvariables);
    this.apollo.use('probite').watchQuery({
      query : constituency,
      variables : constituencyvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.constituencies = data.uniqueAcnameno || [];
      console.log("constituencynames",this.constituencies);
      this.ivinservice.allconstituencies = this.constituencies;
      console.log("constituencynames alll",this.ivinservice.allconstituencies);

       // Initialize filteredConstituencies after data is fetched
      this.filteredConstituencies = this.constituencyCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterConstituencies(value))
      );
    });
  }

  private _filterConstituencies(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.constituencies) {
      return [];
    }
    return this.constituencies.filter((constituency: string) => constituency.toLowerCase().includes(filterValue));
  }

  onconstituencychange(event:any){
    this.selectedconstituency = event.value || event.value;
    console.log("selectedconstituency",this.selectedconstituency);
    this.ivinservice.constituencyselected = this.selectedconstituency;
  }
  
  genderget(){
    const gendervariables = {
      statename : this.selectedstate,
    }
    this.apollo.use('probite').watchQuery({
      query : gender,
      variables : gendervariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.genders = data.uniqueGender;
      console.log("genders",this.genders);
    })
  }

  ongenderchange(event:any){
    this.selectedgender = event.value;
    console.log("selectedgender",this.selectedgender)
    this.ivinservice.genderselected = this.selectedgender;
  }

  partyget(){
    const partyvariables = {
      statename : this.selectedstate,
    }
    this.apollo.use('probite').watchQuery({
      query : party,
      variables : partyvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.partyies = data.uniqueParty;
      console.log("partyies",this.partyies);

       // Initialize filteredConstituencies after data is fetched
       this.filterparties = this.partyCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterparties(value))
      );
    })
  }

  private _filterparties(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.partyies) {
      return [];
    }
    return this.partyies.filter((partyies: string) => partyies.toLowerCase().includes(filterValue));
  }
  

  onpartychange(event:any){
    this.selectedparty = event.value;
    console.log("selectedparty",this.selectedparty)
    this.ivinservice.partyselected = this.selectedparty;
  }

  categoryget(){
    const categoryvariables = {
      statename : this.selectedstate,
    }
    this.apollo.use('probite').watchQuery({
      query : category,
      variables : categoryvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.categories = data.uniqueCandidateCategory;
      console.log("categories",this.categories);
    })
  }

  oncategorychange(event:any){
    this.selectedcategory = event.value;
    console.log("selectedparty",this.selectedcategory)
    this.ivinservice.categoryselected = this.selectedcategory;
  }

  logValues() {
    console.log(`Start Value: ${this.startvalue}, End Value: ${this.endvalue}`);
    this.ivinservice.startvalue = this.startvalue;
    this.ivinservice.endvalue = this.endvalue;
  }

  saveData() {
    // Your form submission or save logic here
    console.log('Save button clicked');
    // Perform form submission or trigger data save logic
  }

  onClick() {
    if (!this.disabled) {
      this.click.emit(); // Emit the click event when the button is clicked
    }
  }

  savepost(){
    if(!this.quickinsightid){
    this.userid = sessionStorage.getItem('loginid');
    const savedata = {
      UserId : this.userid,
      ElectionName :  this.selectedelectiontype,
      ElectionYear : this.selectedyear,
      StateUTName : this.selectedstate,
      from_age : this.startvalue || null,
      to_age : this.endvalue || null,
      Gender : this.selectedgender || null,
      ACName : this.selectedconstituency || null,
      ACCategory : this.selectedcategory || null,
      Party : this.selectedparty || null,
      Status_Tag : this.saveForm.get('privatetoggle')?.value,
      QuickInsightsName : this.saveForm.get('quickinsightformcontrol')?.value,
      QuickInsightsDescription : this.saveForm.get('descripationformcontrol')?.value,
    }
    console.log("savedata",savedata);
    this.ivinservice.probitesavepost(savedata).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('save post data',data);
        this.probitedetailclose();
        this.snackbar.open('Probite has been saved successfully.', 'X', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'Snackbar-green'
        })
        
      }
    })
  }else{
    this.saveupdate();
  }
  }

  saveupdate(){
    this.userid = sessionStorage.getItem('loginid');
    const savedata = {
      UserId : this.userid,
      ElectionName :  this.selectedelectiontype,
      ElectionYear : this.selectedyear,
      StateUTName : this.selectedstate,
      from_age : this.startvalue || null,
      to_age : this.endvalue || null,
      Gender : this.selectedgender || null,
      ACName : this.selectedconstituency || null,
      ACCategory : this.selectedcategory || null,
      Party : this.selectedparty || null,
      Status_Tag : this.saveForm.get('privatetoggle')?.value,
      QuickInsightsName : this.saveForm.get('quickinsightformcontrol')?.value,
      QuickInsightsDescription : this.saveForm.get('descripationformcontrol')?.value,
    }
    console.log("savedata",savedata);
    this.ivinservice.probitesaveupdate(this.quickinsightid,savedata).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('save Update data',data);
        this.probitedetailclose();
        this.snackbar.open('Record Has Been Updated Successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'Snackbar-green'
        })
        
      }
    })
  }


}
