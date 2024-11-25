import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import {  Sort } from '@angular/material/sort';
import { FilterComponent } from '../../uicomponents/filter/filter/filter.component';
import { MatDialog } from '@angular/material/dialog';
import { EnterpriseNameFilterComponent } from '../enterprise-name-filter/enterprise-name-filter.component';
import { SuperadminService } from '../../superadmin.service';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Name } from './enterprisename';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterpise-names',
  templateUrl: './enterpise-names.component.html',
  styleUrl: './enterpise-names.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class EnterpiseNamesComponent implements OnInit  {
  displayName='eName';
  flag: string='';
  reviewStatus: string='';
  schoolStatus:string='';
  selectedFilterOptions: any = { ReviewStatus: [] };
    isInitialLoadComplete: boolean=false;
    orders: Name[] = [];
    ordersTableColumns: TableColumn[] = [];
  nameID: any;
  enterpriseStatus: any;
  verifiedStatus: any;
  spinnerLoading=true;
  

  constructor(private dialog:MatDialog,private adminService:SuperadminService,private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,private snackbar:MatSnackBar,private routes:Router){}
    ngOnInit(): void {
      this.initializeColumns();
      // this.initializeOrders();
      this.studentMasterlist();
    }
    openSchoolForm(){
    sessionStorage.removeItem("nameid");
    this.routes.navigate(['/school-add'])
  }

  toggleFilterPopup(): void {
    this.flag = '';
    this.reviewStatus = '';
    const dialogRef = this.dialog.open(EnterpriseNameFilterComponent, {
        data: { displayName: 'filterDashboard' },
        width: '75%',
        height: 'calc(15px + 75vh)'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            if (result['Enterprise Group']) {
                this.enterpriseStatus = result['Enterprise Group'];
                console.log('Enterprise Group:', this.enterpriseStatus);
            } else {
                this.enterpriseStatus = '';
            }
            if (result['School']) {
                this.schoolStatus = result['School'];
                console.log('School:', this.schoolStatus);
            } else {
                this.schoolStatus = '';
            }
            if (result['Status']) {
                this.verifiedStatus = result['Status'];
                console.log('Status:', this.verifiedStatus);
            } else {
                this.verifiedStatus = '';
            }
            this.displayFilterOptions(result);
        } else {
            console.log('No filter options selected');
        }
    });
}

displayFilterOptions(options: any): void {
    this.selectedFilterOptions = options;
    this.studentMasterlist();
}

removeOption(index: number): void {
    const optionsArray = this.enterpriseStatus.split(',');
    optionsArray.splice(index, 1);
    this.enterpriseStatus = optionsArray.join(',');
    this.studentMasterlist();
}

removeReviewStatus(index: number): void {
    const statusArray = this.reviewStatus.split(',');
    statusArray.splice(index, 1);
    this.reviewStatus = statusArray.join(',');
    this.studentMasterlist();
}

removeSchoolStatus(index: number): void {
    const statusArray = this.schoolStatus.split(',');
    statusArray.splice(index, 1);
    this.schoolStatus = statusArray.join(',');
    this.studentMasterlist();
}

onRowClicked(rowData: any) {
  console.log("Row data:", rowData);

  // Create a new object excluding functions or non-serializable fields, such as 'actions'
  const serializableData = {
    sno: rowData.sno,
    description: rowData.description,
    amount: rowData.amount,
    id: rowData.id,
    stuts: rowData.stuts
  };

  // Navigate with the serializable data
  this.routes.navigate(['/School-Profile'], { state: { data: serializableData } });
}

removeVerifiedStatus(index: number): void {
    const statusArray = this.verifiedStatus.split(',');
    statusArray.splice(index, 1);
    this.verifiedStatus = statusArray.join(',');
    this.studentMasterlist();
}

  enterpriseNameTable(){
    const namedata={
      Enterprise_Name:this.schoolStatus||null,
      Status:this.verifiedStatus||null
    }
    console.log(namedata,"namedt");
  }

  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'School Name', dataKey: 'description', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Group Name', dataKey: 'amount', position: 'left', isSortable: false, displayAsIcon: false, },
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false, displayAsIcon: false, },
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: 'edit', action: this.editOrder },
        // { label: 'Delete', icon: 'delete', action: this.deleteOrder }
      ]
    },
    ];
  }

  editOrder(order: any) {
    console.log("Edit order function called with order:", order);
    this.openSchoolForm();
    console.log("Editing order:", order);
  }

  deleteOrder(rowData: any): void {
    console.log('Deleting order:', rowData);
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
            this.studentMasterlist()
          })
        dialogRef.close();

      };
    }
    else if(event.option === 'Edit') {
      const sanitizedData = this.sanitizeData(event.element);
      this.routes.navigate(['/school-add'],{ state: { data: sanitizedData } })
    }
  }
  sanitizeData(data: any): any {
    return {
      sno: data.sno,
      id: data.id,
      description: data.description,
      amount: data.amount,
      stuts:data.stuts,
    };
  }
  sortData(sortParameters: Sort) {
    const keyName: keyof Name = sortParameters.active as keyof Name;
    this.orders = this.orders.sort((a: Name, b: Name) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  studentMasterlist() {
    const namedata={
      Enterprise_Name:this.schoolStatus||null,
      Status: this.verifiedStatus === 'All' ? null : this.verifiedStatus||null
    }
    console.log(namedata,"namedt");

    this.adminService.enterprisenamesget(namedata).subscribe(
      (data: any) => {
        console.log(data,"studentmatser")
        this.orders = data.Result.reverse().map(( item: any, index: any  ) => {
          const description = item.Enterprise_Name ? String(item.Enterprise_Name) : '--';
          const amount = item.Group_Name ? String(item.Group_Name) : '--';

          const stuts = item.Status
          ? String(item.Status
          ) : '--';

          return {
            sno: index + 1,
            description: description,
            amount: String(amount),
            id:item.id,
            stuts: String(stuts),
            actions: [
              // { label: 'Genarate Temporary UIN', icon: '',  },
              { label: 'Edit', icon: '', action:  this.editOrder },
              { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
            ]
          };
        });
        console.log(this.orders, "tabledata");
        this.spinnerLoading=false;
      },
      (error: any) => {
        console.error('Error fetching health camp list:', error);
      }
    );
  }

}
