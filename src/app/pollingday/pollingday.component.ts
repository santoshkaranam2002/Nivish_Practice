import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IvinService } from '../ivin.service';
import { MatDialog } from '@angular/material/dialog';
// import * as jsPDF from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';


@Component({
  selector: 'app-pollingday',
  templateUrl: './pollingday.component.html',
  styleUrls: ['./pollingday.component.scss']
})


export class PollingdayComponent{

  private startTime!: Date;
  private endTime!: Date;
  private remainingTime: number = 0;

  pollingdropdown: any;
  selectedToggle: string = 'outside';
  SelectPollingStation: any;
  selectedPollingStationNumber: any;
  pagenumber : number=1;
  pagesize: number=100;
  voterserialnumbers: string = '';
  pollingdaychangespinner: boolean = false;
  showPopupContentOutside=false;
  showPopupContentInside=false;
  popupserialnumbers: any;
  errorMessage: string | null = null;
  partynames: string = '';
  outsideVoterBackgroundColors: { [key: string]: string } = {};
  insideVoterBackgroundColors: { [key: string]: string } = {};
  // uniquePartyNames: string[] = [];
  selectedParty: string = 'All';
  partyNamesforfilter: string[] = [
    'All',
    'Telugu Desam Party',
    'Yuvajana Sramika Rythu Congress Party',
    'Janasena Party',
    'Bharatiya Janata Party',
    'Neutral',
    'Other'
  ];
  popuppartynames: any;
  outsidetogglespinner: boolean = false;
  insidetogglespinner: boolean = false;
  nonlocaladdress: string = '';
  popupSpinner: boolean = false;
  markasvotedspinner: boolean = false;
  selectedFilter: string = 'All';
  popupnonlocaladdress: any;
  PollingstationNumber: any;
  votedValues: number[] = [];
  yettovote: any;
  Totalvoters: any;
  selectedNumbers: any[] = [];
  noofvoters: any;
  yetToVoteCount: any;
  VotedCount: any;
  isMarkAsVotedButtonDisabled: boolean = true;
  pagecount: any;
  morespinner:boolean = false;
  newVoterSerialNumbers = '';
  newPartyNames: any;
  newNonLocalAddresses: any;
  selectedPollingStationName:any;
  hoverdetailsData: any;
  hoverdetailsDatapopup: any;
  pagenumbers: any;
  filterpartyname: any;
  filternonlocaladdress: any;
  isChecked: { [key: string]: boolean } = {};
  checkedParties: string[] = [];
  isAllChecked: boolean = false;

  constructor(private ivinservice: IvinService, private dialog:MatDialog){}

  ngOnInit(): void {
    const UserEmail = localStorage.getItem('userEmail');
    this.PollingDropDown(UserEmail);

    this.SelectPollingStation = this.ivinservice.SelectPollingStation;
    // console.log("???????????",this.SelectPollingStation);
  
    this.PollingstationNumber = this.ivinservice.SelectPollingStationNumber;
    // console.log(">>>>>>>>>>>>>",this.PollingstationNumber);

    this.TotalNoVoters(this.SelectPollingStation);

    // countdown timer for event
    const startHour = 9;
    const startMinute = 30;

    // Set the start and end time
    this.startTime = new Date();// Replace this with your actual start time
    this.startTime.setHours(startHour, startMinute, 0); 
    this.endTime = new Date();   // Replace this with your actual end time
    this.endTime.setHours(20, 0, 0); // Assuming 6:00 PM as the end time

    // Calculate the initial remaining time
    this.calculateRemainingTime();

    // Update remaining time every second
    setInterval(() => {
      this.calculateRemainingTime();
    }, 1000);
  }

    calculateRemainingTime() {
      const now = new Date();
      this.remainingTime = Math.max(0, Math.floor((this.endTime.getTime() - now.getTime()) / 1000));

      // Uncomment the line below to see the remaining time in the console
      //  console.log('Remaining Time:', this.formatTime(this.remainingTime));
    }

    progressWidth(): string {
      const totalDuration = 10 * 60 * 60; // Assuming a 10-hour duration
      const progress = (this.remainingTime / totalDuration) * 100;
      return progress + '%';
    }

    formatTime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
    }

    pad(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }

    getStartTime(): Date {
      return this.startTime;
    }

    getEndTime(): Date {
      return this.endTime;
    }

    getRemainingTime(): number {
      return this.remainingTime;
    }
  //  Timer end


  // outside popup open
  outcorrections(templateRef: TemplateRef<any>){
    this.dialog.open(templateRef);
    this.showPopupContentOutside = true;
  }

  // inside popup open
  insidecorrections(templateRef: TemplateRef<any>){
    this.dialog.open(templateRef);
    this.showPopupContentInside = true;
  }

  
  // onToggleChange() Function is OutSide and InSide
  onToggleChange() {
    if (!this.SelectPollingStation) {
      this.errorMessage = 'Please select the polling station first';
      return;
    }

    // Reset pagenumber to 1 when the toggle changes
    this.pagenumber = 1;

    // Clear the previous voterserialnumbers
    this.voterserialnumbers = '';
    this.partynames = '';
    this.nonlocaladdress = '';

    // Fetch data based on the selected toggle
    if (this.selectedToggle === 'outside') {
      this.outsidetogglespinner = true;
      // this.insidetogglespinner = false;
      this.voternumbers(this.PollingstationNumber)
    
    } else if (this.selectedToggle === 'inside') {
      this.insidetogglespinner = true;
      // this.outsidetogglespinner = false;
      this.voternumbers(this.PollingstationNumber)
    }
    
    // Clear the selectedNumbers array
    this.selectedNumbers = [];
  }


  async onPollingStationSelected(event: any) {
    this.pollingdaychangespinner = true;

    // Save the selected polling station name
    this.selectedPollingStationName = event.value;

    // Reset pagenumber to 1 when polling station changes
    this.pagenumber = 1;

    // Clear the previous voterserialnumbers
    this.voterserialnumbers = '';
    this.partynames = '';
    this.nonlocaladdress = '';

    // Clear the selectedNumbers array
    this.selectedNumbers = [];
    this.PollingstationNumber = this.extractLastNumber(event.value);
    // console.log(`Selected polling station number: ${this.PollingstationNumber} for ${event.value}`);
    await this.voternumbers(this.PollingstationNumber);
    this.TotalNoVoters(this.SelectPollingStation);
  }

  private extractLastNumber(pollingStationName: string): number {
    // Extract the last number from the polling station name
    const lastNumberMatch = pollingStationName.match(/\d+$/);
    
    if (lastNumberMatch) {
      return parseInt(lastNumberMatch[0], 10);
    } else {
      // console.error('Unable to extract last number from polling station name:', pollingStationName);
      return 0; // or handle the error accordingly
    }
  }

  // pollingstation names data get in dropdown
  PollingDropDown(byemail:any){
    this.pollingdaychangespinner = true;
    this.ivinservice.PollingStationGet(byemail).subscribe((data:any) => {
      if (data && data.Result) {
        this.pollingdropdown = data.Result;
        this.voternumbers(this.PollingstationNumber);
      }
    })
  }

  TotalNoVoters(PollingStationname: any) {
    this.ivinservice.GetTotalVoters(PollingStationname).subscribe(
      (data:any) => {
        if (data && data.Result) {
          this.noofvoters = data.Result["No.Of.Voter"];
        }
      }
    )
  }

  // voter serialnumbers will get based on the outside and inside
  voternumbers(PollingstationNumber:any) {
    this.morespinner = true;
    let outsideVoter: string | null = null;
    let insideVoter: string | null = null;
  
    if (this.selectedToggle === 'outside') {
      outsideVoter = 'false';
    } else if (this.selectedToggle === 'inside') {
      insideVoter = 'false';
    }

    const pollingStationNumber = {
      PollingStationNumber: this.PollingstationNumber || "undefined",
      non_local_address: this.filternonlocaladdress ||  null,
      outside_voter: outsideVoter,
      inside_voter: insideVoter,
      PartyName: this.filterpartyname || null,
      page_number: this.pagenumber,
      page_size: this.pagesize,
    };

    // console.log('voter jasondata',pollingStationNumber);

    this.ivinservice.serialnumbers(pollingStationNumber).subscribe((data:any)=>{
      if (data['Status']===200){
        console.log("voternumbers data",data)
        this.Popupvoternumbers();
        // Extract all voterserial values
        const voterNumbersArray = data.Result.data.map((item: any) => item.VoterSerialNumber);
        this.newVoterSerialNumbers = voterNumbersArray.filter((val: string) => /^\d+$/.test(val)).join(",");
        // console.log("newVoterSerialNumbers", this.newVoterSerialNumbers);
  
        // Append new voter serial numbers to the existing list
        this.voterserialnumbers += (this.voterserialnumbers ? ',' : '') + this.newVoterSerialNumbers;
        // console.log("existing voterserialnumbers",this.voterserialnumbers);

        // Append new PartyNames to the existing list
        this.newPartyNames = data.Result.data.map((item: any) => item.PartyInclination?.PartyName).join(",");
        this.partynames += (this.partynames ? ',' : '') + this.newPartyNames;
        // console.log("partynames",this.partynames);


        // Append new non_Local_Addresses to the existing list
        this.newNonLocalAddresses = data.Result.data.map((item: any) => item.NonLocalAddress).join(",");
        this.nonlocaladdress += (this.nonlocaladdress ? ',' : '') + this.newNonLocalAddresses;
        // console.log("nonlocaladdress",this.nonlocaladdress);
        this.tooltipdata();
        // Extract pagecount value
        this.pagecount = data.Result.pagecount;
        
        this.pollingdaychangespinner = false;
        this.insidetogglespinner = false;
        this.outsidetogglespinner = false;
        this.markasvotedspinner = false;
        this.morespinner = false;
      }
     
    })
  }


  pagecountincrease(){
      // Increment pagenumber if it's less than pagecount
      if (this.pagenumber < this.pagecount) {
        this.pagenumber++;
        // console.log(`Incremented pagenumber: ${this.pagenumber}`);
        this.voternumbers(this.PollingstationNumber);
    }
  }

  // Get the party colors based on the voter serialnumbers
  getPartyColor(partyName: string): string {
    switch (partyName) {
      case 'All':
        return '';
      case 'Telugu Desam Party':
        return '#FEE00E';
      case 'Yuvajana Sramika Rythu Congress Party':
        return '#0140FE';
      case 'Janasena Party':
        return '#FF0000';
      case 'Bharatiya Janata Party':
        return '#FF7A00';
      case 'Neutral':
        return '#808080';
      case 'Other':
        return '#FFFFFF';
      default:
        return '#FFFFFF'; 
    }
  }

  getPartyName(partyNames: string): string {
    return partyNames.split(',')[0]; // Assuming party names are comma-separated
  }

  onPartyFilterChange(checkedParties: string[]) {
    if (checkedParties.length === 0 || checkedParties.includes("All")) {
      this.filterpartyname = null; // Set to null if "All" is selected or no parties are selected
      this.checkedParties = [];
    } else {
      this.filterpartyname = checkedParties.join(",") // Join the array elements with comma separator
    }
    console.log('Selected Party names in the filter:', this.filterpartyname);
    // You can perform additional actions here if needed
    // this.voternumbers(this.PollingstationNumber);
    // Clear the previous voterserialnumbers
    this.voterserialnumbers = '';
    this.partynames = '';
    this.nonlocaladdress = '';
    this.increment(this.PollingstationNumber);
  }

  // onCheckboxChange(party: string) {
  //   if (this.isChecked[party]) {
  //     // If checkbox is checked, add the party to the array
  //     this.checkedParties.push(party);
  //   } else {
  //     // If checkbox is unchecked, remove the party from the array
  //     const index = this.checkedParties.indexOf(party);
  //     if (index !== -1) {
  //       this.checkedParties.splice(index, 1);
  //     }
  //   }
  //   // Log the checked parties
  //   console.log('Checked parties:', this.checkedParties);
  //   // Call onPartyFilterChange with checkedParties array
  //   this.onPartyFilterChange(this.checkedParties);
    
  // }

  onCheckboxChange(party: string) {
    if (party === "All") {
      // If "All" is checked, uncheck all other checkboxes
      this.checkedParties = [];
      for (const partyName of this.partyNamesforfilter) {
        this.isChecked[partyName] = false;
      }
      // Check the "All" checkbox
    this.isChecked["All"] = true;
    } else {
      // Uncheck "All" checkbox if it was checked previously
      this.isChecked["All"] = false;
    }
  
    if (this.isChecked[party]) {
      // If checkbox is checked, add the party to the array
      this.checkedParties.push(party);
    } else {
      // If checkbox is unchecked, remove the party from the array
      const index = this.checkedParties.indexOf(party);
      if (index !== -1) {
        this.checkedParties.splice(index, 1);
      }
    }
  
    // Log the checked parties
    console.log('Checked parties:', this.checkedParties);
    // Call onPartyFilterChange with checkedParties array
    this.onPartyFilterChange(this.checkedParties);
  }
  

  

  onLocalFilterChange(selectedValue: string) {
    if(selectedValue === "All") {
      this.filternonlocaladdress = null; // Set to null if "All" is selected
    } else {
      this.filternonlocaladdress = selectedValue;
    }
    // console.log('Selected Filter:', selectedValue);
    // You can perform additional actions here if needed
    // this.voternumbers(this.PollingstationNumber);
    // Clear the previous voterserialnumbers
    this.voterserialnumbers = '';
    this.partynames = '';
    this.nonlocaladdress = '';
    this.increment(this.PollingstationNumber);
  }


  // popup get voterserial numbers
  Popupvoternumbers() {
    let popupoutsideVoter: string | null = null;
    let popupinsideVoter: string | null = null;
  
    if (this.selectedToggle === 'outside') {
      popupoutsideVoter = 'true';
    } else if (this.selectedToggle === 'inside') {
      popupinsideVoter = 'true';
    }

    const votersdata = {
      PollingStationNumber: this.PollingstationNumber || "undefined",
      non_local_address: null,
      outside_voter: popupoutsideVoter,
      inside_voter: popupinsideVoter,
      PartyName: null,
      page_number: 1,
      page_size: 2000,
    };
    // console.log('popup votersdata:',votersdata);

    this.ivinservice.serialnumbers(votersdata).subscribe((data:any)=>{
      if (data['Status']===200){
        console.log("Backend Response popup",data);
        this.popupserialnumbers = data.Result.data.map((item: any) => item.VoterSerialNumber);
        console.log("popupserialnumbers", this.popupserialnumbers);
        this.tooltipdatapopup();

        this.VotedCount = this.popupserialnumbers.length;
        this.yetToVoteCount = this.noofvoters - this.VotedCount;
        this.popupSpinner = false;
    
        // Extract all PartyName values
        this.popuppartynames = data.Result.data.map((item: any) => item.PartyInclination?.PartyName).join(",");

        // Extract all non_Local_Address values
        this.popupnonlocaladdress = data.Result.data.map((item: any) => item.NonLocalAddress).join(",");
      }
    })
  }

  // update serialnumbers for outside and inside
  serialnumbersupdatemain() {
    this.markasvotedspinner = true;
    let updateoutsideVoter: string | null = null;
    let updateinsideVoter: string | null = null;

    if (this.selectedToggle === 'outside') {
      updateoutsideVoter = 'true';
    } else if (this.selectedToggle === 'inside') {
      updateinsideVoter = 'true';
    }

    const jsondata = {
      outsidevoter: updateoutsideVoter,
      insidevoter: updateinsideVoter,
    };

    // console.log('Checkbox Value:', jsondata);
    // console.log('PollingStationNumber:', this.PollingstationNumber);
    // console.log('VoterSerialNumber:', this.selectedNumbers);

    this.ivinservice.updateserialnumber(this.PollingstationNumber, this.selectedNumbers, jsondata).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          // console.log("Backend Data Updated", data);

          // this.voternumbers(this.PollingstationNumber);
          // this.voterserialnumbers += (this.voterserialnumbers ? ',' : '') + '';
          // this.partynames += (this.partynames ? ',' : '') + '';
          // this.nonlocaladdress += (this.nonlocaladdress ? ',' : '') + '';

          // Split existing data into arrays
          const existingSerialNumbers = this.voterserialnumbers.split(',');
          const existingPartyNames = this.partynames.split(',');
          const existingNonLocalAddresses = this.nonlocaladdress.split(',');

          // Convert updated serial numbers to string for comparison
          const updatedSerialNumbers = this.selectedNumbers.map(String);

          // Remove entries corresponding to updated serial numbers, party names, and non-local addresses
          this.voterserialnumbers = existingSerialNumbers.filter(number => !updatedSerialNumbers.includes(number)).join(",");
          this.partynames = existingPartyNames.filter((_, index) => !updatedSerialNumbers.includes(existingSerialNumbers[index])).join(",");
          this.nonlocaladdress = existingNonLocalAddresses.filter((_, index) => !updatedSerialNumbers.includes(existingSerialNumbers[index])).join(",");

          // console.log("Updated voterserialnumbers:", this.voterserialnumbers);
          // console.log("Updated partynames:", this.partynames);
          // console.log("Updated nonlocaladdress:", this.nonlocaladdress);
          
          this.Popupvoternumbers();
          // Clear the selectedNumbers array
          this.selectedNumbers = [];
          this.isMarkAsVotedButtonDisabled = true;
          this.markasvotedspinner = false;
        }
      }
    );
  }


  increment(PollingstationNumber: any) {
    // this.voterserialnumbers = '';
    this.pagenumbers = this.pagenumber;
    // console.log("#####", this.pagenumbers);

    this.morespinner = true;
    let outsideVoter: string | null = null;
    let insideVoter: string | null = null;

    if (this.selectedToggle === 'outside') {
        outsideVoter = 'false';
    } else if (this.selectedToggle === 'inside') {
        insideVoter = 'false';
    }

    const pollingStationNumber = {
        PollingStationNumber: this.PollingstationNumber || "undefined",
        non_local_address: this.filternonlocaladdress ||  null,
        outside_voter: outsideVoter,
        inside_voter: insideVoter,
        PartyName: this.filterpartyname || null,
        page_number: 1, // Initial page_number set to 1
        page_size: this.pagesize,
    };


    console.log('increment voter jasondata', pollingStationNumber);

    // Function to make subsequent API calls until page_number matches this.pagenumber
    const makeAPICalls = () => {
        // Log the value of page_number before making each API call
        // console.log("Sending request with page_number:", pollingStationNumber.page_number);
        this.ivinservice.serialnumbers(pollingStationNumber).subscribe((data: any) => {
            if (data['Status'] === 200) {
                // console.log("voternumbers data", data);

                 // Extract all voterserial values
                 const voterNumbersArray = data.Result.data.map((item: any) => item.VoterSerialNumber);
                 this.newVoterSerialNumbers = voterNumbersArray.filter((val: string) => /^\d+$/.test(val)).join(",");
                //  console.log("increment newVoterSerialNumbers", this.newVoterSerialNumbers);

                 // Append new voter serial numbers to the existing list
                 this.voterserialnumbers += (this.voterserialnumbers ? ',' : '') + this.newVoterSerialNumbers;
                //  console.log("increment existing voterserialnumbers", this.voterserialnumbers);

                // Append new PartyNames to the existing list
                this.newPartyNames = data.Result.data.map((item: any) => item.PartyInclination?.PartyName).join(",");
                this.partynames += (this.partynames ? ',' : '') + this.newPartyNames;
                // console.log("partynames",this.partynames);


                // Append new non_Local_Addresses to the existing list
                this.newNonLocalAddresses = data.Result.data.map((item: any) => item.NonLocalAddress).join(",");
                this.nonlocaladdress += (this.nonlocaladdress ? ',' : '') + this.newNonLocalAddresses;
                // console.log("nonlocaladdress",this.nonlocaladdress);

                // Execute remaining tasks when page_number matches this.pagenumber
                if (pollingStationNumber.page_number === this.pagenumbers) {
                    // Execute remaining tasks
                    this.Popupvoternumbers();
                    // // Extract all voterserial values
                    // const voterNumbersArray = data.Result.data.map((item: any) => item.VoterSerialNumber);
                    // this.newVoterSerialNumbers = voterNumbersArray.filter((val: string) => /^\d+$/.test(val)).join(",");
                    // console.log("newVoterSerialNumbers", this.newVoterSerialNumbers);

                    // // Append new voter serial numbers to the existing list
                    // this.voterserialnumbers += (this.voterserialnumbers ? ',' : '') + this.newVoterSerialNumbers;
                    // console.log("existing voterserialnumbers", this.voterserialnumbers);

                    // Append new PartyNames to the existing list
                    // this.newPartyNames = data.Result.data.map((item: any) => item.PartyInclination?.PartyName).join(",");
                    // this.partynames += (this.partynames ? ',' : '') + this.newPartyNames;

                    // // Append new non_Local_Addresses to the existing list
                    // this.newNonLocalAddresses = data.Result.data.map((item: any) => item.NonLocalAddress).join(",");
                    // this.nonlocaladdress += (this.nonlocaladdress ? ',' : '') + this.newNonLocalAddresses;
                    this.tooltipdata();
                    // Extract pagecount value
                    this.pagecount = data.Result.pagecount;

                    this.pollingdaychangespinner = false;
                    this.insidetogglespinner = false;
                    this.outsidetogglespinner = false;
                    this.markasvotedspinner = false;
                    this.morespinner = false;
                } else {
                    // Increment page_number and make another API call
                    pollingStationNumber.page_number++;
                    makeAPICalls();
                }
            }
        });
    };

    makeAPICalls(); // Call the function to start making API calls
}



  
  // update serialnumbers for popup outside and inside
  serialnumbersupdatepopup(voternumber:any){
    this.popupSpinner = true;
    let updateoutsideVoterpop: string | null = null;
    let updateinsideVoterpop: string | null = null;
  
    if (this.selectedToggle === 'outside') {
      updateoutsideVoterpop = 'false';
    } else if (this.selectedToggle === 'inside') {
      updateinsideVoterpop = 'false';
    }
  
    const jsondata= {
      outsidevoter: updateoutsideVoterpop,
      insidevoter: updateinsideVoterpop,
    };
    // console.log('jsondata:', jsondata);
    // console.log('PollingStationNumber:', this.PollingstationNumber);
    // console.log('VoterSerialNumber:',  voternumber);
  
    this.ivinservice.updateserialnumber(this.PollingstationNumber,voternumber, jsondata).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          // console.log("outsidepopup-updated",data);
          this.Popupvoternumbers();
          this.voterserialnumbers = '';
          this.partynames = '';
          this.nonlocaladdress = '';
          this.increment(this.PollingstationNumber);
          // this.voternumbers(this.PollingstationNumber);
        }
      }
    );
  }

  // // This is the filter for partynames
  // shouldShowCheckbox(number: string, index: number): boolean {
  //   // console.log("partynames:", this.partynames);
  //   // console.log("nonlocaladdress:", this.nonlocaladdress);
  //   // console.log("selectedparty:",this.selectedFilter);

  //   const isNonLocal = this.nonlocaladdress.split(',')[index] === 'true';
  //   const isLocal = this.nonlocaladdress.split(',')[index] === 'false';
  
  //   if (this.selectedFilter === 'All') {
  //     return number.trim() !== '' && (this.selectedParty === 'All' || this.getPartyName(this.partynames.split(',')[index]) === this.selectedParty);
  //   } else if (this.selectedFilter === 'false') {
  //     return isLocal && number.trim() !== '' && (this.selectedParty === 'All' || this.getPartyName(this.partynames.split(',')[index]) === this.selectedParty);
  //   } else if (this.selectedFilter === 'true') {
  //     return isNonLocal && number.trim() !== '' && (this.selectedParty === 'All' || this.getPartyName(this.partynames.split(',')[index]) === this.selectedParty);
  //   }
  
  //   return false;
  // }

  numberssaved(number: any) {
    // Toggle the selection: if the number is already selected, remove it; otherwise, add it.
    const index = this.selectedNumbers.indexOf(number);
    if (index !== -1) {
      this.selectedNumbers.splice(index, 1);
    } else {
      this.selectedNumbers.push(number);
    }
    this.isMarkAsVotedButtonDisabled = this.selectedNumbers.length === 0;
    // console.log('Selected Numbers:', this.selectedNumbers);
  }


  tooltipdata(){
    const hoverdetails = {
      PollingStationName : this.selectedPollingStationName || this.SelectPollingStation,
      Voter_SerialNumber : this.voterserialnumbers
    }
    // console.log('tooltip ....',hoverdetails);
    this.ivinservice.hoverdetails(hoverdetails).subscribe((data:any)=>{
      if(data['Status']===200){
        // console.log('hover details',data);
        this.hoverdetailsData = data;
      }
    })
  }


  tooltipdatapopup() {
    const serialNumbersString = this.popupserialnumbers.join(','); // Convert array to comma-separated string
    const hoverdetails = {
      PollingStationName: this.selectedPollingStationName || this.SelectPollingStation,
      Voter_SerialNumber: serialNumbersString // Pass the string instead of the array
    };
    // console.log('tooltip ....', hoverdetails);
    this.ivinservice.hoverdetails(hoverdetails).subscribe((data: any) => {
      if (data['Status'] === 200) {
        // console.log('hover details popup', data);
        this.hoverdetailsDatapopup = data;
      }
    });
  }
  


  getTooltipContent(serialNumber: string): string {
    // Check if hoverdetails is available
    if (!this.hoverdetailsData || !this.hoverdetailsData.Result) {
      return ''; // No data available
    }
  
    // Find the entry corresponding to the serial number
    const voterDetails = this.hoverdetailsData.Result.find((entry: any) => entry.VoterSerialNumber === serialNumber);
  
    // If details for the serial number are found
    if (voterDetails) {
      // Format the tooltip content using the details
      const tooltipContent = `
        Voter ID: ${voterDetails.VoterId || 'N/A'}\n
        Name: ${voterDetails.Name || 'N/A'}\n
        Contact Number: ${voterDetails.ContactNumber || 'N/A'}\n
        PartyInclination:${voterDetails.PartyInclination || 'N/A'}
      `;
      return tooltipContent;
    } else {
      return ''; // No details found for the serial number
    }
  }
  

  getTooltipContentpopup(voternumber: string): string {
    // Check if hoverdetails is available
    if (!this.hoverdetailsDatapopup || !this.hoverdetailsDatapopup.Result) {
      return ''; // No data available
    }
  
    // Find the entry corresponding to the serial number
    const voterDetails = this.hoverdetailsDatapopup.Result.find((entry: any) => entry.VoterSerialNumber === voternumber);
  
    // If details for the serial number are found
    if (voterDetails) {
      // Format the tooltip content using the details
      const tooltipContent = `
        Voter ID: ${voterDetails.VoterId || 'N/A'}\n
        Name: ${voterDetails.Name || 'N/A'}\n
        Contact Number: ${voterDetails.ContactNumber || 'N/A'}\n
        PartyInclination:${voterDetails.PartyInclination || 'N/A'}
      `;
      return tooltipContent;
    } else {
      return ''; // No details found for the serial number
    }
  }
  


  votersdatadownload() {
    this.ivinservice.pollingdaydowmload(this.selectedPollingStationName || this.SelectPollingStation).subscribe((data: any) => {
        if (data['Status'] === 200) {
            // Create a new jsPDF instance
            const doc = new jsPDF();

            // Function to add footer
            const addFooter = function(doc: any) {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    // Add footer image
                    const footerImageUrl = 'assets/images/pdffooter.png';
                    const footerHeight = 10;
                    const xOffset = 10;
                    const yOffset = doc.internal.pageSize.getHeight() - footerHeight - 5;
                    doc.addImage(footerImageUrl, 'PNG', xOffset, yOffset, 190, footerHeight);
                }
            };

            // Add image to the PDF
            const imageUrl = 'assets/images/pdfheader.png';
            doc.addImage(imageUrl, 'PNG', 0, 0, 210, 40);

            // Add title to the PDF
            doc.text('Voter Data', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

            // Add table for summary data
            (doc as any).autoTable({
                head: [['Polling Station Number and Name', 'Total Voters', 'Marked Voted Outside', 'Marked Voted Inside', 'YetToVote']],
                body: data.Result.map((item: any) => [item.Polling_Station_Name_Num, item.Total_Voters, item.outside_voted, item.inside_voted, item.pendingVoters]),
                startY: 55,
                // Specify styles for the table headers
                headStyles: {
                  fillColor: [0, 0, 0] // Black color
              }
            });

            // Add contact details
            doc.text('Contact Details', 10, (doc as any).autoTable.previous.finalY + 10);

            const nameFontSize = 10; // Define the font size for names

            const contactDetailsRows = data.Result.flatMap((item: any) => {
                const rows = [];
                // Push each contact detail as a separate row
                rows.push([
                    { content: `Booth Incharge:`, styles: { fontStyle: 'bold' } }, 
                    item.Booth_Incharge, 
                    item.Booth_Incharge_Number
                ]);
                rows.push([
                    { content: `Mandal Incharge:`, styles: { fontStyle: 'bold' } }, 
                    item.Mandal_Incharge, 
                    item.Mandal_Incharge_Number
                ]);
                rows.push([
                    { content: `Booth Communicator:`, styles: { fontStyle: 'bold' } }, 
                    item.Booth_Communicator, 
                    item.Booth_Communicator_Contact
                ]);
                rows.push([
                    { content: `Follow Up:`, styles: { fontStyle: 'bold' }}, 
                    item.Follow_up_Person, 
                    item.Follow_up_Person_Contact
                ]);
                rows.push([
                    { content: `Cluster Incharge:`, styles: { fontStyle: 'bold' } }, 
                    item.Cluster_Incharge, 
                    item.Cluster_Incharge_Number
                ]);
                rows.push([
                    { content: `Unit Incharge:`, styles: { fontStyle: 'bold' } }, 
                    item.Unit_Incharge, 
                    item.Unit_Incharge_Number
                ]);
                rows.push([
                    { content: `Data Entry:`, styles: { fontStyle: 'bold' } }, 
                    item.Data_Entry, 
                    item.Data_Entry_Contact
                ]);
                rows.push([
                    { content: `Food Incharge:`, styles: { fontStyle: 'bold' } }, 
                    item.Food_Incharge, 
                    item.Food_Incharge_Contact
                ]);
                rows.push([
                    { content: `Mandal Party Secretary:`,styles: { fontStyle: 'bold' } }, 
                    item.Mandal_Party_Secretary, 
                    item.Mandal_Party_Secretary_Contact
                ]);
                rows.push([
                    { content: `Tent Incharge 1:`, styles: { fontStyle: 'bold' } }, 
                    item.Tent_Inchage1, 
                    item.Tent_Incharge1_Contact
                ]);
                rows.push([
                    { content: `Tent Incharge 2:`, styles: { fontStyle: 'bold' } }, 
                    item.Tent_Inchage2, 
                    item.Tent_Incharge2_Contact
                ]);
                rows.push([
                    { content: `Voter Motivation:`, styles: { fontStyle: 'bold' } }, 
                    item.Voter_Motivation, 
                    item.Voter_Motivation_Contact
                ]);
                rows.push([
                    { content: `Transportation Incharge 1:`, styles: { fontStyle: 'bold' } }, 
                    item.Transportation1_Incharge, 
                    item.Transportation_Incharge1_Contact
                ]);
                rows.push([
                    { content: `Transportation Incharge 2:`, styles: { fontStyle: 'bold' } }, 
                    item.Transportation2_Incharge, 
                    item.Transportation_Incharge2_Contact
                ]);
                // Add other contact details similarly
                return rows;
            });

          

            (doc as any).autoTable({
                body: contactDetailsRows,
                startY: (doc as any).autoTable.previous.finalY + 15,
                // Specify styles for the table body
                styles: {
                  cellPadding: 2,
                  fontSize: 10,
                  fontStyle: 'normal', // Setting normal font style for body cells
              },
            });

            // Add yet to vote section
            doc.text('Yet To Vote', 10, (doc as any).autoTable.previous.finalY + 10);
            (doc as any).autoTable({
                head: [['S.No', 'Voter Serial Number', 'Voter Id', 'Full Name', 'Phone Number', 'Party Inclination']],
                body: data.Result.flatMap((item: any, index: any) => item.VoterDetails.map((voter: any, i: any) => [i + 1, voter.VoterSerialNumber, voter.VoterId, voter.Name, voter.ContactNumber, item.PartyInclination])),
                startY: (doc as any).autoTable.previous.finalY + 20,
                // Specify styles for the table headers
                headStyles: {
                  fillColor: [0, 0, 0] // Black color
              }
            });

            // Add footer to all pages
            addFooter(doc);

            // Save the PDF
            doc.save('Voters Data.pdf');
        }
    });
}




}