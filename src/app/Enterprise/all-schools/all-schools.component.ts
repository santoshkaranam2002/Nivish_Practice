import { Component,TemplateRef, ViewChild  } from '@angular/core';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { EnterpriseGroup } from './all_school';
import { AddCoridnatorComponent } from '../add-coridnator/add-coridnator.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { AddEnterprisePopupComponent } from '../add-enterprise-popup/add-enterprise-popup.component';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';
import { enterpisenameQuery } from '../../student-details/graphql.school';
import { Apollo } from 'apollo-angular';
import { Location } from '@angular/common';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateFormatPipe } from '../../date-format.pipe';

import { EnterprisefilterComponent } from '../enterprisefilter/enterprisefilter.component';
interface Category {
  name: string;
  options: Option[];
}

interface Option {
  id?: number;  // Make id optional
  label: string;
}

interface SelectedOption {
  id?: number;  // Make id optional
  label: string;
  selected: boolean;
}

interface SelectedCategory {
  name: string;
  options: SelectedOption[];
}
@Component({
  selector: 'app-all-schools',
  templateUrl: './all-schools.component.html',
  styleUrl: './all-schools.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class AllSchoolsComponent {
  @ViewChild('campadminpopup', { static: true })
  campadminpopup!: TemplateRef<any>;
  orders: EnterpriseGroup[] = [];
  ordersTableColumns: TableColumn[] = [];
  enid: any;
  rowData: any;
  groupName: any;
  schoolId: any;
  spinnerLoading=true;
  groupNames:boolean=true;
  nameID: any;
  statusOptions: any;
  status: any;
  constructor(private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,private dialog:MatDialog,private routes:Router,private apollo:Apollo,private location: Location,private adminService:SuperadminService,private snackbar:MatSnackBar) {
      const navigation = this.routes.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.rowData = navigation.extras.state['data'];
        this.schoolId=this.rowData.id;
        console.log('Received row data:', this.rowData,this.schoolId);

      }
}
  ngOnInit(): void {
    this.groupName=this.rowData.Group_Name;
    this.initializeColumns();
    this.getenterpiseName();
  }
  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'Schools', dataKey: 'Schools', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Primary Coordinator', dataKey: 'PrimaryCoordinator', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Secondary Coordinator', dataKey: 'SecondaryCoordinator', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Last Verified On', dataKey: 'LastVerifiedOn', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
  }
  
  onRowClicked(rowData: any) {
    console.log("Row data:", rowData);

    // this.enterprisegroup();
    this.routes.navigate(['/School-Profile'],{ state: { data: rowData } });
  }
  openSchoolForm(){
    this.routes.navigate(['/school-add']);
  }
  goBack() {
    this.location.back();
  }
  handleRowAction(event: any,) {
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
    this.nameID=event.element.id;
    sessionStorage.setItem("nameid", this.nameID);
    console.log(this.nameID,'eventId');
    if (event.option === 'Delete') {
      const dialogRef =this.dialog.open(AlertpopupComponent,{
        data:{
          title:"Alert",
          message:"Are you sure want to Delete ?",
          buttonLabel:"Delete"
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
      dialogRef.componentInstance.buttonClickFunction = () => {
        this.adminService.enterpriseNameDelete(this.nameID).subscribe((data:any)=>
          {
            if(data['Status']===200){
              this.snackbar.open('School Deleted Successfully', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
            }
          })
        dialogRef.close();

      };
    } else if(event.option === 'Edit') {
      this.routes.navigate(['/school-add'],{ state: { data: event.element } })
    }
  }
  openAdEnterpriseGroup(){

  }
  sortData(sortParameters: Sort) {
    const keyName: keyof EnterpriseGroup = sortParameters.active as keyof EnterpriseGroup;
    this.orders = this.orders.sort((a: EnterpriseGroup, b: EnterpriseGroup) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  editOrder(rowData: any): void {
    console.log('Editing order:', rowData);
  }

  deleteOrder(rowData: any): void {

    console.log('Deleting order:', rowData);
  }
  getenterpiseName(){
    if (!Array.isArray(this.statusOptions)) {
      this.statusOptions = [];
    }
    const namevaraibles = {
      enterprisegroup: this.schoolId,
      status: this.statusOptions.includes('All') ? null : this.statusOptions || null,
    };
    console.log('namevaraibles', namevaraibles);
    this.groupNames=true;
    this.apollo.use('campAdminClient').watchQuery({
      query: enterpisenameQuery,
      variables: namevaraibles,
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({data}:any) => {
      console.log(data.EnterpriseSchools,"data");
      if (data && data.EnterpriseSchools) {
        const schoolsList = [...data.EnterpriseSchools].reverse(); 
      this.orders =schoolsList.map(( item: any, index: any  ) => {
        const dateFormatPipe = new DateFormatPipe(new DatePipe('en-US'));

        const schools=item.Enterprise_Name? String(item.Enterprise_Name) : '--';
        const primaryCordinator=item.Primary_Coordinator_Name? String(item.Primary_Coordinator_Name) : '--';
        const secondaryCordinator=item.Secondary_Coordinator_Name ? String(item.Secondary_Coordinator_Name) : '--';
        const verified=item.UpdatedOn? dateFormatPipe.transform(item.UpdatedOn) : '--' ;
        const status=item.Status?String(item.Status):'--';
        
        return {
          sno: index + 1,
          Schools: schools,
          PrimaryCoordinator: primaryCordinator,
          SecondaryCoordinator: secondaryCordinator,
          LastVerifiedOn:verified,
          stuts: status,
          id: item.id,
          actions: [{ label: 'Edit', icon: '' },
            { label: 'Delete', icon: '' }
            ]   
        };
      })
    }else {
      this.orders = []; 
    }
    this.groupNames=false;

    this.spinnerLoading = false;
    }, error => {
      console.error('Error fetching data:', error);
      this.spinnerLoading = false; 
    });
  }
 

  onFilterChange(selectedOptions: SelectedCategory[]): void {
    console.log('Selected Options:', selectedOptions);
    const allLabels:any = [];  
    selectedOptions.forEach((category: SelectedCategory) => {
      console.log(`Category: ${category.name}`);
      category.options.forEach((option: SelectedOption) => {
        console.log(`Option: ${option.label} (ID: ${option.id}), Selected: ${option.selected}`);
        if(option.selected){
        allLabels.push(option.label);
        }
        
      });

    });
   this.statusOptions=allLabels
   console.log(this.statusOptions,"this.statusOptions");
   this.getenterpiseName();
  }
  
  removeOption(index: number): void {
    if (index >= 0 && index < this.statusOptions.length) {
      this.statusOptions.splice(index, 1);
      this.status = this.statusOptions.join(',');  // Update status string for chip display
      this.getenterpiseName();  // Refresh the table data after removing a filter
    }
  }
  
  toggleFilterPopup(): void {
    const dialogRef = this.dialog.open(EnterprisefilterComponent, {
      data: { selectedOptions: this.statusOptions || {} },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statusOptions = result['Status'] || [];
        this.status = this.statusOptions.join(',');  // Update status string for chip display
        console.log(this.statusOptions, 'Selected Status Options');
        this.getenterpiseName();
      } else {
        console.log('No filter options selected');
      }
    });
  }
  breadcrumbs = [
    { label: 'Login', url: '/' },
    { label: 'Enterprise Group', url: '/EnterPriseGrpoup' },
    { label: 'School', url: '/AllSchools' },

  ];
}

