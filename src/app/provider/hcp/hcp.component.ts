import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { StudentTable } from './hcptable';
import { SuperadminService } from '../../superadmin.service';
import { HcpFilterComponent } from '../hcp-filter/hcp-filter.component';
import { DateFormatPipe } from '../../date-format.pipe';
import { DatePipe } from '@angular/common';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hcp',
  templateUrl: './hcp.component.html',
  styleUrls: ['./hcp.component.scss'],
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class HcpComponent {
  @Input() isFilterable = false;
  @Input() rowActionIcon = '';
  names: string[] = [];
  flag: string = '';
  selectedFilterOptions: any = [];
  @Input() showSpinner: boolean = false;

  orders: StudentTable[] = [];
  @ViewChild('campadminpopup', { static: true })
  campadminpopup!: TemplateRef<any>;
  ordersTableColumns: TableColumn[] = [];
  verifiedStatus: any;
  category: any;
  Type: any;
  provider: any;
  providerIds: any = [];
  spinnerLoading = true; 
  notifyemail: any;
  notifyname: any;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private SuperadminService: SuperadminService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.providergetall();
    this.onsubmit();
  }

  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'index', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'NID', dataKey: 'ProviderID', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Name', dataKey: 'FullName', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Type', dataKey: 'Type', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Category', dataKey: 'Category', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Experience', dataKey: 'ExperienceDetails', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Last Verified On', dataKey: 'UpdatedOn', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Provider', dataKey: 'Provider_Name', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Status', dataKey: 'Status', position: 'left', isSortable: false, displayAsIcon: false },
      { 
        name: 'Actions', 
        dataKey: 'actions', 
        position: 'left', 
        isSortable: true, 
        displayAsIcon: true, 
        customOptions: [
          { 
            label: 'Notify', 
            icon: '', 
            action: (rowData: any) => this.handleRowAction({ option: 'Notify', icon: '', element: rowData }) 
          },
          { 
            label: 'Delete', 
            icon: '', 
            action: (rowData: any) => this.handleRowAction({ option: 'Delete', icon: '', element: rowData }) 
          }
        ]
      }
    ];
  }
  

  sortData(sortParameters: Sort) {
    const keyName: keyof StudentTable = sortParameters.active as keyof StudentTable;
    this.orders = this.orders.sort((a: StudentTable, b: StudentTable) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  filter(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
        top: '250px',
        right: '60px'
    };
    dialogConfig.width = '40%'; // Adjust the width as needed
    dialogConfig.height = '40%'; // Adjust the height as needed

    const dialogRef = this.dialog.open(this.campadminpopup, dialogConfig);
  }

  toggleFilterPopup(): void {
    const dialogRef = this.dialog.open(HcpFilterComponent, {});
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.category = result.categories || [];
        this.Type = result.types || [];
        this.providerIds = result.providers || [];
        this.verifiedStatus = result.status || [];

        if (this.providerIds.some((provider: any) => provider.name === 'All')) {
          this.providerIds = [{ id: null, name: 'All' }];
        }
        if (this.verifiedStatus.includes('All')) {
          this.verifiedStatus = ['All'];
        }
        if (this.Type.includes('All')) {
          this.Type = ['All'];
        }
        if (this.category.includes('All')) {
          this.category = ['All'];
        }
  
        this.onsubmit();
        console.log('Selected filter options:', this.category, this.Type, this.providerIds,this.verifiedStatus);
      } else {
        console.log('No filter options selected');
      }
    });
  }  
  
  removeOption(index: number, type: string): void {
    if (type === 'verifiedStatus') {
      const optionsArray = this.verifiedStatus;
      if (optionsArray[index] === 'All') {
        this.verifiedStatus = [];
      } else {
        optionsArray.splice(index, 1);
        this.verifiedStatus = optionsArray.length ? optionsArray : [];
      }
    } else if (type === 'category') {
      const optionsArray = this.category;
      if (optionsArray[index] === 'All') {
        this.category = [];
      } else {
        optionsArray.splice(index, 1);
        this.category = optionsArray.length ? optionsArray : [];
      }
    } else if (type === 'Type') {
      const optionsArray = this.Type;
      if (optionsArray[index] === 'All') {
        this.Type = []; 
      } else {
        optionsArray.splice(index, 1);
        this.Type = optionsArray.length ? optionsArray : [];
      }
    } else if (type === 'providerIds') {
      const optionsArray = this.providerIds;
      if (optionsArray[index] === 'All') {
        this.providerIds = []; 
      } else {
        optionsArray.splice(index, 1);
        this.providerIds = optionsArray.length ? optionsArray : [];
      }
    }
    this.onsubmit();
  }
  
  
  
  onsubmit(): void {
    this.showSpinner = true;
  
    const filterObject = {
      Category: this.category && this.category.length
        ? this.category.includes('All') ? null : this.category.join(',')
        : null,
      Provider: this.providerIds && this.providerIds.length
        ? this.providerIds.some((provider: any) => provider.id === null) ? null : this.providerIds.map((p: { id: string }) => p.id).join(',')
        : null,
      Status: this.verifiedStatus && this.verifiedStatus.length
        ? this.verifiedStatus.includes('All') ? null : this.verifiedStatus.join(',')
        : null,
      Type: this.Type && this.Type.length
        ? this.Type.includes('All') ? null : this.Type.join(',')
        : null,
    };
    this.SuperadminService.hcpget(filterObject).subscribe(
      (data: any) => {
        this.orders = data.Result.reverse().map((item: any, index: any) => {
          const ProviderID = item.NIV ? String(item.NIV) : '--';
          const Provider_Name = item.Provider_Name ? String(item.Provider_Name) : '--';
          const Status = item.Status ? String(item.Status) : '--';
          const Type = item.Type ? String(item.Type) : '--';
          const HCPID = item.HCPID ? String(item.HCPID) : '--'; 
          const FullName = item.FullName ? String(item.FullName) : '--';
          const Category = item.Category ? String(item.Category) : '--';
          const UpdatedOn = item.UpdatedOn ? new DateFormatPipe(new DatePipe('en-US')).transform(item.UpdatedOn) : '--';
          const ExperienceDetails = item.ExperienceDetails && item.ExperienceDetails.length > 0 && item.ExperienceDetails[0].Total_Experience_Years !== null
            ? `${item.ExperienceDetails[0].Total_Experience_Years} years`
            : '--';
          return {
            index: index + 1,
            Type: Type,
            ProviderID: ProviderID,
            Provider_Name: Provider_Name,
            Status: Status,
            FullName: FullName,
            Category: Category,
            UpdatedOn: UpdatedOn,
            ExperienceDetails: ExperienceDetails,
            HCPID: HCPID,
            actions: [
              { label: 'Notify', icon: '' },
              { label: 'Delete', icon: '' },
            ],
          };
        });
  
        this.spinnerLoading = false;
        console.log(data, "data");
      },
      (error: any) => {
        console.error('Error fetching health camp list:', error);
      }
    );
  }
  

  handleRowAction(event: any) {
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
    this.notifyemail = event.element.Email;
    this.notifyname = event.element.ProviderName;
    if (event.option === 'Delete') {
      const dialogRef = this.dialog.open(AlertpopupComponent, {
        data: {
          title: "Alert",
          message: "Are you sure want to Delete ?",
          buttonLabel: "Delete"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
      dialogRef.componentInstance.buttonClickFunction = () => {
        dialogRef.close();
      };
    }
    if (event.option === 'Notify') {
      const notifydata = {
        Email: this.notifyemail,
        Name: this.notifyname
      };
      console.log('notifydata', notifydata);
      this.SuperadminService.notifypost(notifydata).subscribe(
        (data:any)=>{
          if (data['Status']=== 200){
               this.snackbar.open('Successfully notified Sent', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
            console.log('notify posted', data);
            console.log('notify posted', data.Result.Message);
          }
        }
      )
  
    }

  }

  

  displayFilterOptions(options: any[]): void {
    this.selectedFilterOptions = options;
    this.onsubmit();
  }

  removeCategory(option: string): void {
    if (this.category) {
      this.category = this.category.split(',').filter((item: string) => item.trim() !== option.trim()).join(',');
    }
    this.onsubmit();
  }

  removeProvider(option: string): void {
    if (this.providerIds) {
      this.providerIds = this.providerIds.filter((id: string) => id !== option.trim());
      this.provider = this.providerIds.join(',');
    }
    this.onsubmit();
  }

  addhcp() {
    this.router.navigate(['/addhcp']);
  }

  removeStatus(option: string): void {
    if (this.verifiedStatus) {
      this.verifiedStatus = this.verifiedStatus.split(',').filter((item: string) => item.trim() !== option.trim()).join(',');
    }
    this.onsubmit();
  }

  providergetall() {
    this.SuperadminService.providergetall().subscribe(
      (data: any) => {
        this.names = data.Result.map((provider: { Name: any; }) => provider.Name ? String(provider.Name) : '--');
        console.log(data, "providersdata");
        console.log(this.names, "names");
      }
    );
  }

  onRowClicked(rowData: any) {
    console.log('rowdatadetails', rowData);
    this.router.navigate(['/docprofile'], { state: { data: rowData } });
  }

  breadcrumbs = [
    { label: 'Login', url: '/' },
    { label: 'HCP Master List', url: '/hcp' },
  ]
}
