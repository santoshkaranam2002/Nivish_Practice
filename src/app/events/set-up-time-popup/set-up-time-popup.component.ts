  import { Component } from '@angular/core';
  import { FormControl, Validators } from '@angular/forms';
  import { MatDialog, MatDialogRef } from '@angular/material/dialog';
  import { Router } from '@angular/router';
  import { SuccessPopupComponent } from '../../uicomponents/success-popup/success-popup.component';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { SuperadminService } from '../../superadmin.service';
  import { FormBuilder, FormGroup, } from '@angular/forms'; // Import necessary modules


  @Component({
    selector: 'app-set-up-time-popup',
    templateUrl: './set-up-time-popup.component.html',
    styleUrl: './set-up-time-popup.component.scss'
  })
  export class SetUpTimePopupComponent {
    countryNameControl = new FormControl('', [Validators.required]);
    enterpriseControl = new FormControl('', [Validators.required]);
    enterPriseNameControl=new FormControl('', [Validators.required]);
    radioEGroup: string='';
    radioOptions: string='';
    StartDate: any;
    EndDate: any;
    campForm: any;
    startime:any;
    endtime:any;
    dateRange: { date: string, startTime: string, endTime: string }[] = [];
    selectedDates: string[] = [];


    // dateRange: { date: string, startTime: string, endTime: string }[] = [];

    constructor(private router: Router,private dialog:MatDialog,private snackbar:MatSnackBar,private superadminservice:SuperadminService,private fb: FormBuilder){}
    onRadioButtonChangeEgroup(event: { source: { id: string; }; value: string; }){
      console.log("onRadioButtonChangeEgroup()");
      console.log("event.source=" + event.source.id);
      console.log("event.value=" + event.value);
    }
    ngOnInit(): void {
      const startDate = '2024-01-01'; // Replace with your actual start date
      const endDate = '2024-01-10'; // Replace with your actual end date
      this.timeslotsget()
  this.healthcampgetbyid()
  this.campForm = this.fb.group({
    username:['', Validators.required],
    healthcampname: ['', Validators.required],
    Country: [''],
    enterpriseGroup: ['', Validators.required], // Assuming this is the form control for enterprise group selection
    enterpriseGroupname: [''], // Assuming this is the form control for enterprise group name
    comment: [''],
    startdate: [''],
    enterprise:[''],
    enddate: [''],
    Date:[''],
    NumberOfStudents: ['']
  });;
  this.dateRange = this.generateDateRange(startDate, endDate);
    }


    onSubmitRadioGroup() {
      console.log("onSubmitRadioGroup()");
      console.log("radios=" + this.radioOptions);
    // console.log("this.surveyPlusPlans.selected=" + this.surveyPlusPlans.value);
    }


    Back(){
      this.router.navigate(['/addhealthcamp'])
    }
    updateSelectedDates(date: string) {
      const extractedDate = date.split(':')[1].trim(); // Extracts '23-May-2024' from 'Thursday:23-May-2024'
    
      // Convert the extracted date to 'YYYY-MM-DD' format
      const [day, month, year] = extractedDate.split('-');
      const months: { [key: string]: string } = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
    
      // Ensure day and month are valid before formatting
      if (months[month] && !isNaN(parseInt(day)) && !isNaN(parseInt(year))) {
        const formattedDay = day.length === 1 ? `0${day}` : day;
        const formattedDate = `${year}-${months[month]}-${formattedDay}`;
    
        if (this.selectedDates.includes(formattedDate)) {
          this.selectedDates = this.selectedDates.filter(d => d !== formattedDate);
        } else {
          this.selectedDates.push(formattedDate);
        }
      } else {
        console.error('Invalid date format:', extractedDate);
      }
    }
    timeslotsget() {
      const HCID = sessionStorage.getItem('hcid') || sessionStorage.getItem('HCID');
      console.log(HCID, "hcid");
  
      this.superadminservice.timeslotsget(HCID).subscribe(
        (data: any) => {
          if (data && data.Result) {
            console.log('Time slots received:', data);
            // your logic
          } else {
            console.error('No data returned');
          }
        },
        (error) => {
          console.error('Error fetching time slots:', error);
        }
      );
    }
    formatDate(dateString: string): string {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const date = new Date(dateString);
      const dayOfWeek = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${dayOfWeek}:${day}-${month}-${year}`;
    }
    generateDateRange(startDate: string, endDate: string): { date: string, startTime: string, endTime: string }[] {
      const dateArray: { date: string, startTime: string, endTime: string }[] = [];
      const currentDate = new Date(startDate);
      const lastDate = new Date(endDate);

      while (currentDate <= lastDate) {
        dateArray.push({ date: this.formatDate(currentDate.toISOString().split('T')[0]), startTime: '', endTime: '' });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    }
    healthcampgetbyid() {
      const HCID = sessionStorage.getItem('hcid') || sessionStorage.getItem('HCID');
      console.log(HCID, "hcid");
    
      this.superadminservice.healthcampgetbyid(HCID).subscribe(
        (data: any) => {
          const InfoseekMasterId = data.Result[0];
    
          this.StartDate = this.formatDate(InfoseekMasterId.StartDate);
          this.EndDate = this.formatDate(InfoseekMasterId.EndDate);
          this.dateRange = this.generateDateRange(InfoseekMasterId.StartDate, InfoseekMasterId.EndDate);
    
          console.log(InfoseekMasterId, "InfoseekMasterId");
    
          // Fetch time slots and fill them in the form
          this.superadminservice.timeslotsget(HCID).subscribe(
            (timeSlotData: any) => {
              if (timeSlotData && timeSlotData.Result) {
                // Loop over the returned time slots and update the form accordingly
                timeSlotData.Result.forEach((timeSlot: any) => {
                  const formattedDate = this.formatDate(timeSlot.Date);
                  const dateRangeIndex = this.dateRange.findIndex(d => d.date === formattedDate);
    
                  if (dateRangeIndex !== -1) {
                    // Pre-fill the time slots and check the checkbox
                    this.dateRange[dateRangeIndex].startTime = timeSlot.Start_Time.substring(0, 5); // HH:MM format
                    this.dateRange[dateRangeIndex].endTime = timeSlot.End_Time.substring(0, 5);
    
                    // Mark checkbox as checked for the pre-filled date
                    if (!this.selectedDates.includes(formattedDate)) {
                      this.selectedDates.push(formattedDate); // Add to selectedDates to check the checkbox
                    }
                  }
                });
              }
            },
            (error) => {
              console.error('Error fetching time slots:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching health camp data:', error);
        }
      );
    }
    
    
    onSubmit() {
      const HCID = sessionStorage.getItem('hcid');
      const eveHcid=sessionStorage.getItem('HCID')
      const filteredStartTime = this.dateRange.map(dateInfo => dateInfo.startTime).filter(time => time.trim() !== '');
      const filteredEndTime = this.dateRange.map(dateInfo => dateInfo.endTime).filter(time => time.trim() !== '');
    
      const startdate = this.campForm.get('StartDate')?.value || null;
      
    
      const superAdminId = sessionStorage.getItem('superAdminId');
      console.log(superAdminId,"superAdminId")
    
      const sectionD={
        SuperAdmin_Id: superAdminId,
        HCID:HCID||eveHcid,
        Date: this.selectedDates,
        Start_Time:filteredStartTime,
        End_Time:filteredEndTime,
      
    
      }
        console.log(sectionD,"sectionD")
    
    
    
    // Append form values to formData
    
    this.superadminservice.multipletimepost(sectionD).subscribe(
      (data: any) => {
        if (data['Status'] === 200) {
          console.log('User data updated successfully');
          this.opensuccespopup()
          // this.hcid = data.Result.HCID;
          // const hcid = this.hcid;
          // this.enterprisename = data.Result.EnterpriseName.id
          // console.log(this.enterprisename,"enterprisename")
          // console.log(hcid,"hcid")
          // sessionStorage.setItem('HCID', hcid);
    
        }
        // console.log( this.hcid,"hcid")
      },
      (error) => {
        console.error('Error updating user data:', error);
      }
    );
    }

    opensuccespopup() {
      this.snackbar.open('Details Posted Successfully', 'Close', {
                  duration: 4000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                })
                this.router.navigate(['/healthcamp'])

      // this.dialogRef.close();
      // const dialogRef = this.dialog.open(SuccessPopupComponent, {
      //   data: {
      //     title: 'Success',
      //     message: 'Student added successfully.',
      //     buttonLabel: 'Add Another Student' 
      //   },
      //   width: '500px'
      // });
    
    
      // dialogRef.componentInstance.buttonClickFunction = () => {
        
      //   dialogRef.close();

      // };
    
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   this.router.navigate(['/healthcamp'])
      
      // });
    }



  }
