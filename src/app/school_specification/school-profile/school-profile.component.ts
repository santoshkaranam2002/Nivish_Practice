import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddCoridnatorComponent } from '../../Enterprise/add-coridnator/add-coridnator.component';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { eventSchoolQuery, schoolProfileQuery } from './schoolprofile.graphql';
import { map, tap, of } from 'rxjs';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { SchoolEvents } from '../school-profile/schoolevents';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { Location } from '@angular/common';
import { DateFormatPipe } from '../../date-format.pipe';
import { SuperadminService } from '../../superadmin.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrl: './school-profile.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe],
})

export class SchoolProfileComponent{
  enterpriseForm!: FormGroup;

  isLoading:boolean=false;
  mobile:any;
  buttonLabel="Add Cordinator";
  showButton: boolean=false;
  schoolProfileId: any;
  rowData: any;
  country: any;
  state: any;
  schoolprofile: any;
  orders: SchoolEvents[] = [];
  ordersTableColumns: TableColumn[] = [];
  schoolevent: any;
  noData: boolean=false;
  primaryCordinator: any;
  primaryCordinatorEmail: any;
  primaryCordinatorMobile: any;
  primaryCordinatorStatus: any;
  secondaryCordinator: any;
  secondaryCordinatorEmail: any;
  secondaryCordinatorMobile: any;
  secondaryCordinatorStatus: any;
  primaryCordinatorNid: any;
  secondaryCordinatorNid: any;
  showButtonCordinator: boolean=false;
  spinnerLoading=true;
  schoolLogo: any;
  lastVerifiedOn: any;
  uploadFileUrl: any;
  @ViewChild('emailContainer') emailContainer!: ElementRef;
  isTextTruncated: boolean = false;;

  constructor(private cdr: ChangeDetectorRef, private router:Router,private dialog:MatDialog,private apollo:Apollo,private currencyPipe: CurrencyPipe,private superdminService:SuperadminService,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,private location:Location){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rowData = navigation.extras.state['data'];
      this.schoolProfileId=this.rowData.id;
      console.log('Received row data:', this.rowData,this.schoolProfileId);

    }
  }

  ngAfterViewInit() {
    if (this.emailContainer) {
      this.checkTextOverflow(this.emailContainer.nativeElement);

      // Add a listener to recheck when the window is resized
      window.addEventListener('resize', () => {
        if (this.emailContainer) {
          this.checkTextOverflow(this.emailContainer.nativeElement);
        }
      });
    }
  }

  checkTextOverflow(element: HTMLElement) {
    this.isTextTruncated = element.scrollWidth > element.clientWidth;
    this.cdr.detectChanges(); // Trigger change detection to update the tooltip
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification(`Copied to clipboard: ${text}`);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  showNotification(message: string) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.classList.add('show');

      // Hide the notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  transform(value: any, max: number): any {
    return value.length > max ? value.slice(0, max) + '...' : value;
}

  ngOnInit(){
    this.getSchoolProfile();
    this.initializeColumns();
    this.schoolEvents();
    this.getNamebyId()
    
  }
  handleRowAction(event: any,) {}
  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'Name', dataKey: 'Name', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Type', dataKey: 'Type', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Date', dataKey: 'Date', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
  }
  onRowClicked(rowData: any) {
    const sanitizedData = this.sanitizeData(rowData);
    this.router.navigate(['/School-Events'], { state: { data: sanitizedData } });
  }
  sanitizeData(data: any): any {
    return {
      sno: data.sno,
      name: data.Name,
      type: data.Type,
      date: data.Date,
      hcid: data.hcid,
      stuts: data.stuts,
    };
  }
  sortData(sortParameters: Sort) {
    const keyName: keyof SchoolEvents = sortParameters.active as keyof SchoolEvents;
    this.orders = this.orders.sort((a: SchoolEvents, b: SchoolEvents) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  editOrder(rowData: any): void {
    console.log('Editing order:', rowData);
  }
  goBack() {
    this.location.back();
  }
  deleteOrder(rowData: any): void {

    console.log('Deleting order:', rowData);
  }
  onTabChange(event: any) {
    this.showButton = event.index === 1; // Show button only for "Coordinators" tab
    this.updateShowButtonCordinator();
  }
  backstoSchoolList(){
    this.router.navigate(['Schools']);
  }
  downloadSchoolDetails(){

  }
  openEditPopup(){}
  AddCoOrdinator(){
    const dialogRef =this.dialog.open(AddCoridnatorComponent,{
      data:{
        title:"Coordinators",
        message:"Are you sure want to Delete ?",
        buttonLabel:"Add",
        id:this.schoolProfileId,
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSchoolProfile();
    });
    dialogRef.componentInstance.buttonClickFunction = () => {

      // this.addStudent(dialogRef);
      dialogRef.close();

    };
  }
  updateShowButtonCordinator() {
    this.showButtonCordinator = this.showButton && (!this.primaryCordinator || !this.secondaryCordinator);
  }
  getSchoolProfile(){
    const schoolprofile ={
      schoolProfileId:parseInt(this.schoolProfileId),
    };
    console.log(schoolprofile,"epname");
    this.apollo.use('campAdminClient').watchQuery({
      query:schoolProfileQuery,
      variables:schoolprofile,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe(({data}:any)=>
    {
      console.log(data,"schoolprofile");
      const dateFormatPipe = new DateFormatPipe(new DatePipe('en-US'));
      this.schoolprofile = data.EnterpriseSchools[0];
      this.primaryCordinator=this.schoolprofile.Primary_Coordinator_Name;
      this.primaryCordinatorEmail=this.schoolprofile.Primary_Coordinator_Email;
      this.primaryCordinatorMobile=this.schoolprofile.Primary_Coordinator_MobileNo;
      this.primaryCordinatorStatus=this.schoolprofile.Primary_Coordinator_Status;
      this.primaryCordinatorNid=this.schoolprofile.Primary_Coordinator_NID;
      this.secondaryCordinator=this.schoolprofile.Secondary_Coordinator_Name;
      this.secondaryCordinatorEmail=this.schoolprofile.Secondary_Coordinator_Email;
      this.secondaryCordinatorMobile=this.schoolprofile.Secondary_Coordinator_MobileNo;
      this.secondaryCordinatorStatus=this.schoolprofile.Secondary_Coordinator_Status;
      this.secondaryCordinatorNid=this.schoolprofile.Secondary_Coordinator_NID;
      this.showButton = !this.primaryCordinator || !this.secondaryCordinator;
      this.schoolLogo=this.schoolprofile.Upload_School_Logo;
      console.log('schoollogo',this.schoolLogo)
      this.lastVerifiedOn=this.schoolprofile.UpdatedOn?dateFormatPipe.transform(this.schoolprofile.UpdatedOn) : '--';
      
      console.log(this.schoolLogo,"scLogo");
      this.updateShowButtonCordinator();
      console.log(this.schoolprofile,"dg",data);
      this.spinnerLoading=false;
    })
  }

  getNamebyId(): void {
    this.superdminService.getEnterpriseNameDetails(this.schoolProfileId).subscribe((data: any) => {
      if (data.Status === 200) {
        const result = data.Result;
        this.uploadFileUrl = result.Upload_School_Logo;
        console.log(data, "get imagess");
        console.log(data, "getSuccess");
      }
    });
  }
  schoolEvents() {
    const schoolEvnets = {
      schooleventId: parseInt(this.schoolProfileId),
    };
    this.apollo.use('superAdminevents').watchQuery({
      query: eventSchoolQuery,
      variables: schoolEvnets,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe(({ data }: any) => {
      console.log(data, "schoolEvents");

      if (data.healthcampDetails && data.healthcampDetails.length > 0) {
        const dateFormatPipe = new DateFormatPipe(new DatePipe('en-US'));

        this.schoolevent = [...data.healthcampDetails].reverse();
        this.orders = this.schoolevent.map((item: any, index: any) => {
          const Name = item.HealthCampName ? String(item.HealthCampName) : '--';
          const Type = item.Event_Type? String(item.Event_Type) : '--';
          const Date = item.StartDate ? dateFormatPipe.transform(item.StartDate) : '--';
          const stuts = item.Scheduled_Status ? String(item.Scheduled_Status) : '--';
          const hcid=item.HCID;
          return {
            sno: index + 1,
            Name: Name,
            Type: Type,
            Date: Date,
            id: item.id,
            stuts: String(stuts),
            hcid:hcid,
            actions: [
              // { label: 'Generate Temporary UIN', icon: '', },
              { label: 'Edit', icon: '', action: this.editOrder },
              { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
            ]
          };
        });
        this.noData = false;
      } else {
        this.noData = true;
      }
      console.log(this.schoolevent, "schoolEvents");
    });
  }

  onEditCoordinator(details: any) {
    console.log('Edit details:', details,this.schoolProfileId);
    const dialogRef =this.dialog.open(AddCoridnatorComponent,{
      data:{
        title:"Coordinators",
        message:"Are you sure want to Delete ?",
        buttonLabel:"Add",
        details: details,
        id:this.schoolProfileId,
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSchoolProfile();
    });
    dialogRef.componentInstance.buttonClickFunction = () => {
      // this.addStudent(dialogRef);
      dialogRef.close();
    };
  }

}
