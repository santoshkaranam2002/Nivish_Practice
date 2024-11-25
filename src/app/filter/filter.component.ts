import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IvinService } from '../ivin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { HabitationsData, PartyNamesData } from './graphql.filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  startvalue: number = 18;
  endvalue: number = 100;
  ageFilter = new FormControl(false);
  castfilter = new FormControl();
  Numberfilter = new FormControl();
  Professionfilter = new FormControl();
  PartyInclinationfilter = new FormControl();
  ContactModefilter = new FormControl();
  NonLocalAddressfilter = new FormControl();
  Dissidentfilter = new FormControl();
  JoinPartyfilter = new FormControl();
  Physicallychallengedfilter = new FormControl();
  Habitationsfilter = new FormControl();
  Schemesfilter = new FormControl();
  filterdata: any;
  ivinid: any;
  filter: any;
  filterValues: any;
  editvalues: any;
  showcastDropdown: boolean = false;
  selectedOptionsCast = new FormControl();
  castdropdown: any;
  showProfessionDropdown: boolean = false;
  selectedOptionsProfession = new FormControl();
  showPartyInclinationDropdown: boolean = false;
  selectedOptionsPartyInclination = new FormControl();
  showContactModeDropdown: boolean = false;
  selectedOptionsContactMode = new FormControl();
  showHabitationsDropdown: boolean = false;
  selectedOptionsHabitations = new FormControl();
  showSchemesDropdown: boolean = false;
  selectedOptionsSchemes = new FormControl();
  habitations: any;
  partynames: any;

  constructor(
    private ivinservice: IvinService,
    private dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apollo:Apollo
  ) {}
  
  ngOnInit(): void {
    this.filterValues = this.data.filterValues;
    console.log("flter component", this.filterValues);
    this.editvalues = this.data.editValues;
    console.log('editvalues', this.editvalues);
    this.castdropdown = this.data.castdata;
    if (this.filterValues) {
      // this.castfilter.setValue(this.filterValues.castFilterValue === 'yes');
      const castFilterArray = this.filterValues.castFilterValue ? this.filterValues.castFilterValue.split(',') : [];
      this.selectedOptionsCast.setValue(castFilterArray);
      this.showcastDropdown = castFilterArray.length > 0;
      this.Numberfilter.setValue(this.filterValues.numberFilterValue === 'yes');
      // this.Professionfilter.setValue(this.filterValues.professionFilterValue === 'yes');
      if (this.filterValues.professionFilterValue && this.filterValues.professionFilterValue !== 'null') {
        this.showProfessionDropdown = true;
        this.selectedOptionsProfession.setValue(this.filterValues.professionFilterValue);
      }
      // this.PartyInclinationfilter.setValue(this.filterValues.partyinclinationFilterValue === 'yes');
      const partyFilterArray = this.filterValues.partyinclinationFilterValue ? this.filterValues.partyinclinationFilterValue.split(',') : [];
      this.selectedOptionsPartyInclination.setValue(partyFilterArray);
      this.showPartyInclinationDropdown = partyFilterArray.length > 0;
      // this.ContactModefilter.setValue(this.filterValues.contactmodeFilterValue === 'yes');
      if(this.filterValues.contactmodeFilterValue && this.filterValues.contactmodeFilterValue !==null){
        this.showContactModeDropdown = true;
        this.selectedOptionsContactMode.setValue(this.filterValues.contactmodeFilterValue);
      }
      this.NonLocalAddressfilter.setValue(this.filterValues.nonlocalFilterValue === 'yes');
      this.Dissidentfilter.setValue(this.filterValues.dissidentFilterValue === 'yes');
      this.JoinPartyfilter.setValue(this.filterValues.joinpartyFilterValue === 'yes');
      this.Physicallychallengedfilter.setValue(this.filterValues.physicallyFilterValue === 'yes');
      // this.Habitationsfilter.setValue(this.filterValues.habitationFilterValue === 'yes');
      const habitationFilterArray = this.filterValues.habitationFilterValue ? this.filterValues.habitationFilterValue.split(',') : [];
      this.selectedOptionsHabitations.setValue(habitationFilterArray);
      this.showHabitationsDropdown = habitationFilterArray.length > 0;
      this.Schemesfilter.setValue(this.filterValues.schemesFilterValue === 'yes');
      this.ageFilter.setValue(this.filterValues.ageFilterValue === 'yes');
      this.startvalue = this.filterValues.startvalue === null ? 18 : parseInt(this.filterValues.startvalue);
      this.endvalue = this.filterValues.endvalue === null ? 100 : parseInt(this.filterValues.endvalue);
    }
    else if (this.editvalues){
      this.castfilter.setValue(this.editvalues.Caste === 'yes');
      this.Numberfilter.setValue(this.editvalues.ContactNumber === 'yes');
      this.Professionfilter.setValue(this.editvalues.Profession === 'yes');
      this.PartyInclinationfilter.setValue(this.editvalues.PartyInclination_id === 'yes');
      this.ContactModefilter.setValue(this.editvalues.ContactMode === 'yes');
      this.NonLocalAddressfilter.setValue(this.editvalues.Non_Local_Address === 'yes');
      this.Dissidentfilter.setValue(this.editvalues.Dissident === 'yes');
      this.JoinPartyfilter.setValue(this.editvalues.InterestToJoinParty === 'yes');
      this.Physicallychallengedfilter.setValue(this.editvalues.PhysicallyChallenged === 'yes');
      this.Habitationsfilter.setValue(this.editvalues.Habitations_id === 'yes');
      // this.Schemesfilter.setValue(this.editvalues.schemesFilterValue === 'yes');
      // this.ageFilter.setValue(this.editvalues.ageFilterValue === 'yes');
      // this.startvalue = this.editvalues.startvalue === null ? 18 : parseInt(this.editvalues.startvalue);
      // this.endvalue = this.editvalues.endvalue === null ? 100 : parseInt(this.editvalues.endvalue);
    }
    this.GetHabitation();
    this.GetPartyNames();
  }

  applyfilter() {
    const selectedCast = this.selectedOptionsCast.value ? this.selectedOptionsCast.value.join(','):null;
    const selectedHabitation = this.selectedOptionsHabitations.value ? this.selectedOptionsHabitations.value.join(','):null;
    const selectedPartyname = this.selectedOptionsPartyInclination.value ? this.selectedOptionsPartyInclination.value.join(','):null;
    if(this.ageFilter.value){
      this.filterValues = {
        // castFilterValue: this.castfilter.value ? "yes" : null,
        castFilterValue: selectedCast || null,
        numberFilterValue: this.Numberfilter.value ? "yes" : null,
        professionFilterValue: this.selectedOptionsProfession.value || null,
        partyinclinationFilterValue: selectedPartyname,
        contactmodeFilterValue: this.selectedOptionsContactMode.value || null,
        nonlocalFilterValue: this.NonLocalAddressfilter.value ? "yes" : null,
        dissidentFilterValue: this.Dissidentfilter.value ? "yes" : null,
        joinpartyFilterValue: this.JoinPartyfilter.value ? "yes" : null,
        physicallyFilterValue: this.Physicallychallengedfilter.value ? "yes" : null,
        // habitationFilterValue: this.Habitationsfilter.value ? "yes" : null,
        habitationFilterValue: selectedHabitation,
        schemesFilterValue: this.Schemesfilter.value ? "yes" : null,
        ageFilterValue: this.ageFilter.value ? 'yes' : null,
        startvalue: this.startvalue || null,
        endvalue: this.endvalue || null
      };
    } else {
      this.filterValues = {
        // castFilterValue: this.castfilter.value ? "yes" : null,
        castFilterValue: selectedCast || null,
        numberFilterValue: this.Numberfilter.value ? "yes" : null,
        professionFilterValue: this.selectedOptionsProfession.value || null,
        partyinclinationFilterValue: selectedPartyname,
        contactmodeFilterValue: this.selectedOptionsContactMode.value || null,
        nonlocalFilterValue: this.NonLocalAddressfilter.value ? "yes" : null,
        dissidentFilterValue: this.Dissidentfilter.value ? "yes" : null,
        joinpartyFilterValue: this.JoinPartyfilter.value ? "yes" : null,
        physicallyFilterValue: this.Physicallychallengedfilter.value ? "yes" : null,
        // habitationFilterValue: this.Habitationsfilter.value ? "yes" : null,
        habitationFilterValue: selectedHabitation,
        schemesFilterValue: this.Schemesfilter.value ? "yes" : null,
        ageFilterValue: this.ageFilter.value ? 'yes' : null,
        startvalue: null,
        endvalue: null
      };
    }
    this.dialogRef.close(this.filterValues);
  }

  CancelFilter() {
    if(this.editvalues) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close();
    }
  }

  GetHabitation() {
    this.apollo.use('userivin').watchQuery({
      query: HabitationsData
    }).valueChanges.subscribe(({data}:any) => {
      this.habitations = data.uniqueHabitations;
    });
  }

  GetPartyNames() {
    this.apollo.use('userivin').watchQuery({
      query: PartyNamesData
    }).valueChanges.subscribe(({data}:any) => {
      this.partynames = data.uniquePartynames;
    });
  }
}
