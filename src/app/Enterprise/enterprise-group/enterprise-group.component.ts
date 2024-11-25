import { Component, ViewChild } from '@angular/core';

// import {CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common';
import {MatSort, Sort} from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { EnterpriseGroup } from './enterprisegroup';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEnterprisePopupComponent } from '../add-enterprise-popup/add-enterprise-popup.component';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { enterpisegropnameget } from '../graphql.enterprise';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { AddCoridnatorComponent } from '../add-coridnator/add-coridnator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise-group',
  templateUrl: './enterprise-group.component.html',
  styleUrl: './enterprise-group.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]

})
export class EnterpriseGroupComponent {
  orders: EnterpriseGroup[] = [];
  ordersTableColumns: TableColumn[] = [];
  errorMessage: string = '';
  enid: string = '';
  id: any;
  name: any;
  Group_Name: any;
  group: any;
  superadminid: any;
  spinnerLoading = true; 
  constructor(private dialog:MatDialog,private SuperadminService:SuperadminService,private snackbar:MatSnackBar, private appolo:Apollo,private routes:Router){

  }

  ngOnInit(): void {
    this.initializeColumns();
    // this.initializeOrders();
    // this.enterprisegroup()
    this.emterprisegroupgetbyid()
    this.enterprisegroupget();
  }
  enterprisegroupget() {
    const watchQuery = this.appolo.use('campAdminClient').watchQuery({
      query: enterpisegropnameget,
      fetchPolicy: 'network-only'
    });
    watchQuery.valueChanges.subscribe(({ data }: any) => {
      if (data && data.EnterpriseGroup) {
        const sortedOrders = data.EnterpriseGroup
          .map((item: any) => ({
            ...item,
            Group_Name: item.Group_Name || '--',
            Number_of_Enterprises: item.Count || '--',
          }))
          .sort((a: any, b: any) => (b.createdAt || b.id) - (a.createdAt || a.id))
          .map((item: any, index: any) => ({
            sno: index + 1,
            Group_Name: item.Group_Name,
            Number_of_Enterprises: item.Number_of_Enterprises,
            id: item.id,
            actions: [
              { label: 'Edit', icon: '' },
              { label: 'Delete', icon: '' }
            ]
          }));
  
        this.orders = sortedOrders;
        console.log('group', this.orders);
        this.spinnerLoading = false;
      } else {
        console.log('Data or EnterpriseGroup is undefined or null.');
      }
    });
  }
  
  sortData(sortParameters: Sort) {
    const keyName: keyof EnterpriseGroup = sortParameters.active as keyof EnterpriseGroup;
    this.orders = this.orders.sort((a: EnterpriseGroup, b: EnterpriseGroup) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }
  onFilesChanged(files: File[]) {
    console.log('Files:', files);
  }
  onErrorMessageChanged(message: string) {
    this.errorMessage = message;
  }
  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'Group Name', dataKey: 'Group_Name', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Number of Schools', dataKey: 'Number_of_Enterprises', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
  }

  onRowClicked(rowData: any) {
    console.log("Row data:", rowData);
    this.routes.navigate(['/AllSchools'], { state: { data: rowData } });
  }
  

  editOrder(rowData: any): void {
    console.log('Editing order:', rowData);
  }

  deleteOrder(rowData: any): void {

    console.log('Deleting order:', rowData);
  }
  handleRowAction(event: any,) {
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
    this.enid=event.element.id;
    this.emterprisegroupgetbyid();

    console.log(this.enid,'eventId');
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
      this.deleteEnterprise();
        // this.addStudent(dialogRef);
        dialogRef.close();

      };
      // this.enterprisegroup();
    }
      
    
    else if(event.option === 'Edit') {
      const dialogRef = this.dialog.open(AddEnterprisePopupComponent, {
        data: {
          title: 'Enterprise Group Name',
          title2:'No Of Schools',
          Group_Name:event.element.Group_Name,
          enid: event.element.id,

          // message: 'Student added successfully.',
          // buttonLabel: 'Add Another Student'
        },
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.enterprisegroupget();
      });
      dialogRef.componentInstance.buttonClickFunction = () => {

        // this.addStudent(dialogRef);
        dialogRef.close();

      };
      // this.enterprisegroup();
    }

  }

  deleteEnterprise(){
    {
      this.SuperadminService.emterprisenamedelatebyid(this.enid).subscribe(
        (data: any) => {
          if(data['Status']===200){
            console.log(data,'successs');

            this.snackbar.open('Group Name Dealte Successfully', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
            this.enterprisegroupget();
          }


        })


        }
    }

  openAdEnterpriseGroup(){
    // this.dialogRef.close();
    const dialogRef = this.dialog.open(AddEnterprisePopupComponent, {
      data: {
        title: 'Enterprise Group Name',
        // message: 'Student added successfully.',
        // buttonLabel: 'Add Another Student'
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.enterprisegroup();

      this.enterprisegroupget();

    });
    dialogRef.componentInstance.buttonClickFunction = () => {

      // this.addStudent(dialogRef);
      dialogRef.close();
      // this.refreshPage();


      this.enterprisegroupget();


    };



    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');

    // });
  }

  // enterprisegroup() {
  //   this.SuperadminService.enterprisegroup().subscribe(
  //     (data: any) => {
  //       this.orders = data.Result.reverse().map((item: any, index: any) => {
  //         this.enid=item.id
  //         console.log(this.enid, "enid"); // Print enid for each item
  //         return {
  //           id: index + 1,
  //           enid: item.id,
  //           noofenterprises: String("--"),
  //           Group_Name: String(item.Group_Name),
  //           actions: [
  //             { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
  //             { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
  //             // Other action options...
  //           ]
  //         };
  //       });
  //       console.log(data, "tabledata");
  //     },
  //     (error: any) => {
  //       console.error('Error fetching health camp list:', error);
  //     }
  //   );
  // }


  emterprisegroupgetbyid() {
    this.SuperadminService.emterprisegroupgetbyid(this.enid).subscribe(
      (data: any) => {
        console.log(data,"get");
        this.Group_Name = data.Result[0].Group_Name;
        console.log(this.Group_Name, "name");
      },
      error => {
        console.error("Error fetching name by ID:", error);
      }
    );
  }

  breadcrumbs = [
    { label: 'Login', url: '/' },
    { label: 'Enterprise Group', url: '/EnterPriseGrpoup' },
    
  ];
}
