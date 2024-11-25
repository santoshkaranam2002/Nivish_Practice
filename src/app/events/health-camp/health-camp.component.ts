import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { StudentTable } from './healthcamp';
import { SuperadminService } from '../../superadmin.service';
import { enterpisegropnameget } from '../../Enterprise/graphql.enterprise';
import { alleventsget } from '../graphql.events';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsFilterComponent } from '../events-filter/events-filter.component';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { Apollo } from 'apollo-angular';


@Component({
  selector: 'app-health-camp',
  templateUrl:'./health-camp.component.html',
  styleUrl: './health-camp.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]

})
export class HealthCampComponent {
  @ViewChild('dotspopup', { static: true })
  dotspopup!: TemplateRef<any>;
  campForm!: FormGroup; // Define your form group
  displayName='healthTable';
  selectedIds: any;
  @Input() showSpinner: boolean = false;

  dialogRef: any;
  @ViewChild('dialogpopup', { static: true })
  dialogpopup!: TemplateRef<any>;
  @ViewChild('campadminpopup', { static: true })
  campadminpopup!: TemplateRef<any>;
  @Input() label: string = '';
  enterpriseGroups: string[] = ['Group 1', 'Group 2', 'Group 3'];
  countryControl = new FormControl('', [Validators.required]);
  enterpriseGroupControl=new FormControl('', [Validators.required]);
  nameofenterpriseControl=new FormControl('', [Validators.required]);
  firstNameControl=new FormControl('', [Validators.required]);
  lastNameControl=new FormControl('', [Validators.required]);
  emailAddressControl=new FormControl('', [Validators.required]);
  webaddressControl=new FormControl('', [Validators.required]);
  streetaddressControl=new FormControl('', [Validators.required]);
  cityControl=new FormControl('', [Validators.required]);
  stateControl=new FormControl('', [Validators.required]);
  zipcodeControl=new FormControl('', [Validators.required]);
  faxControl=new FormControl('', [Validators.required]);

  orders: StudentTable[] = [];
  ordersTableColumns: TableColumn[] = [];
  Country: any;
  Schools: any;
  Status: any;
  hcid: any;
  spinnerLoading = true; 

  constructor(private appolo:Apollo,private dialog: MatDialog,private router:Router,private fb:FormBuilder,private SuperadminService:SuperadminService,private snackbar:MatSnackBar) { }
  ngOnInit(): void {
    sessionStorage.removeItem('hcid');
    this.initializeColumns();
    this.getallevents()
  }

  sortData(sortParameters: Sort) {
    const keyName: keyof StudentTable = sortParameters.active as keyof StudentTable;
    this.orders = this.orders.sort((a: StudentTable, b: StudentTable) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }
  healthcampresource(){
    this.router.navigate(['/healthcampresource'])

  }
  addhealthcamp(){
    this.router.navigate(['/addhealthcamp']);
  }
  healthcampedit(){
    this.router.navigate(['/healthcampedit']);
  }
  
  toggleFilterPopup(): void {
    const dialogRef = this.dialog.open(EventsFilterComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('resultdata', result);
        this.Country = result.countries;
        this.Schools = result.schools;
        this.Status = result.status;

        if (this.Schools.some((school: any) => school.name === 'All')) {
          this.Schools = [{ id: null, name: 'All' }];
        }
        if (this.Status.includes('All')) {
          this.Status = ['All'];
        }

        this.getallevents();

        console.log('Selected filter options:', this.Country, this.Schools, this.Status);
      }
    });
  }

  removeOption(index: number, type: string): void {
    if (type === 'Status') {
      const optionsArray = this.Status;
      if (optionsArray[index] === 'All') {
        this.Status = null;
      } else {
        optionsArray.splice(index, 1);
        this.Status = optionsArray || null;
      }
    } else if (type === 'Schools') {
      const optionsArray = this.Schools;
      if (optionsArray[index] === 'All') {
        this.Schools = null; 
      } else {
        optionsArray.splice(index, 1);
        this.Schools = optionsArray || null;
      }
    }
    this.getallevents();
  }
initializeColumns(): void {
  this.ordersTableColumns = [
    { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false, displayAsIcon: false,},

    { name: 'Name', dataKey: 'name', position: 'left', isSortable: false, displayAsIcon: false,},
    { name: 'Type', dataKey: 'Event_Type', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Date', dataKey: 'DateRange', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Total Participants', dataKey: 'Number_of_Participant', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Schools', dataKey: 'EnterpriseName', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Location', dataKey: 'Location', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Status', dataKey: 'Scheduled_Status', position: 'left', isSortable: false, displayAsIcon: false, },
    { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
      { label: 'Edit', icon: '', action: this.editOrder },
      { label: 'Delete', icon: '', action: this.deleteOrder },
      { label: 'Event Resource', icon: '', action: this.eventresource.bind(this)}
    ]
  }
  ];
}

onViewStationsClicked(event:any){
    const dialogRef = this.dialog.open(this.dotspopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
}


editOrder(rowData: any): void {
  this.router.navigate(['/healthcampedit']);
  console.log('Editing order:', rowData);

}
eventresource(rowData: any): void {
  this.router.navigate(['/login']);
  console.log('Editing order:', rowData);
}


deleteOrder(rowData: any): void {

  console.log('Deleting order:', rowData);
}
handleRowAction(event: any) {
  console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
  if (event.option === 'Edit') {
    this.hcid=event.element.hcid;
    console.log(this.hcid,"hccc");
   sessionStorage.setItem('hcid',this.hcid);
    this.router.navigate(['/healthcampedit']);
  }
  if (event.option === 'Health Camp Resource') {
    this.router.navigate(['/healthcampresource'])  }
  if (event.option === 'Event Resource') {
    this.hcid=event.element.hcid;
    sessionStorage.setItem('hcid',this.hcid);
    this.router.navigate(['/resouceevent'])  }
    if (event.option === 'Delete') {
      const dialogRef =this.dialog.open(AlertpopupComponent,{
        data:{
          title:"Alert",
          message:"Are you sure want to Delete ?",
          buttonLabel:"Delete"
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);       
      });
      dialogRef.componentInstance.buttonClickFunction = () => {
        dialogRef.close();
      };
    }
    
      
}

onRowClick(rowData: any) {
  console.log(rowData,"rowData");
  const sanitizedData = this.sanitizeData(rowData);
  this.router.navigate(['/School-Events'], { state: { data: sanitizedData } });
}
sanitizeData(data: any): any {
  return {
    DateRange:data.DateRange,
    EnterpriseName:data.DateRange,
    Event_Type:data.Event_Type,
    HealthCampType:data.HealthCampType,
    Location:data.Location,
    Number_of_Participant:data.Number_of_Participant,
    Scheduled_Status:data.Scheduled_Status,
    hcid:parseInt(data.hcid),
    name:data.name,
    id:data.id,
    sno:data.sno,
    type:data.type,
  };
}
getallevents(): void {
  console.log(this.Schools,"getall")
  const filters = {
    hcid: null,
    Enterprise: this.Schools && this.Schools.length ? this.Schools.some((school: any) => school.name === 'All') ? null : this.Schools.map((school: any) => parseInt(school.id, 10)) : null,
    sechudle: this.Status ? (this.Status.includes('All') ? null : this.Status) : null,
  };
console.log("idgettingschool",filters),
  console.log('getallevents', filters);
  this.appolo.use('superAdminevents').watchQuery({
    query: alleventsget,
    variables: filters,
    fetchPolicy: 'network-only'
  }).valueChanges.subscribe(({ data }: any) => {
    console.log('data', data);
    if (data && data.healthcampDetails) {      
      const reversedListContact = [...data.healthcampDetails].reverse();
      this.orders = reversedListContact.map((item: any, index: any) => {
        const name = item.HealthCampName ? String(item.HealthCampName) : '--';
        const Number_of_Participant = item.Number_of_Participant ? String(item.Number_of_Participant) : '--';
        const Event_Type = item.Event_Type ? String(item.Event_Type) : '--'; 
        const Enterprise_Name = item.Enterprise_Name ? String(item.Enterprise_Name) : '--'; 
        const StartDate = item.StartDate ? String(item.StartDate) : '--';
        const EndDate = item.EndDate ? String(item.EndDate) : '--';
        const DateRange = (StartDate !== '--' && EndDate !== '--') ? `${StartDate} to ${EndDate}` : '--';
        const Location = item.Location ? String(item.Location) : '--'; 
        const Scheduled_Status = item.Scheduled_Status ? String(item.Scheduled_Status) : '--'; 
        const hcid=item.HCID?String(item.HCID) : '--';
        return {
          sno: index + 1,
          Number_of_Participant: Number_of_Participant,
          id: item.id,
          HealthCampType: Event_Type,
          Event_Type:Event_Type,
          EnterpriseName: Enterprise_Name,
          name: name,
          DateRange: `${this.formatDate(item.StartDate)} to ${this.formatDate(item.EndDate)}`,
          Scheduled_Status: Scheduled_Status,
          Location:Location,
          type: StartDate,
          hcid:hcid,
          actions: [
                        { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
                        { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) },
                        { label: 'Event Resource', icon: '', action: this.eventresource.bind(this, item)  },
                        { label: 'Event Schedule', icon: '', },
                        { label: 'Event Report', icon: '', },
            
                      ],
        };
        
      }) as StudentTable[]; // Type assertion to ensure the type matches
      this.spinnerLoading = false;
      console.log('group', this.orders);
    } else {
      console.log('Data or EnterpriseGroup is undefined or null.');
      
    }
 
  });
}

formatDate(date: string): string {
  if (!date) return '--';
  const formattedDate = new Date(date);
  if (!formattedDate.getTime()) return '--';
  const pipe = new DatePipe('en-US');
  return pipe.transform(formattedDate, 'dd-MMM-yyyy') || '--';
}

breadcrumbs = [
  { label: 'Login', url: '/' },
  { label: 'All Events', url: '/healthcamp' },
]



}
