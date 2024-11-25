import { Component,Input,TemplateRef,ViewChild } from '@angular/core';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { StudentTable } from './TableColumn';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { SuperadminService } from '../../superadmin.service';
import { ProviderPopupComponent } from '../provider-popup/provider-popup.component';
import { AddPoviderComponent } from '../add-povider/add-povider.component';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-provider-entity',
  templateUrl: './provider-entity.component.html',
  styleUrl: './provider-entity.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]

})
export class ProviderEntityComponent {
  orders: StudentTable[] = [];
  @ViewChild('dotspopup', { static: true })
  dotspopup!: TemplateRef<any>;
  ordersTableColumns: TableColumn[] = [];
  status: any;
  selectedFilterOptions: any=[];
  @Input() showSpinner: boolean = false;

  campForm: any;
  provideId: any;
  notifyemail: any;
  notifyname: any;
  spinnerLoading=true;

  constructor(private dialog: MatDialog,private router:Router,private fb:FormBuilder,private snackbar:MatSnackBar,private SuperadminService:SuperadminService) { }
  ngOnInit(): void {
    this.initializeColumns();
    // this.initializeOrders();
    this.providerentitygetall()
    this.campForm = this.fb.group({
      HealthCampName:[''],
      StartDate:[''],
      EndDate:[],
      EnterpriseName:[],
      EnterpriseGroupName:[],
      Country:[],
      classsectionname:[],
      Discription:[],
      HealthCampType:[],
      Number_of_Participant:[],
      Category: [''],
      FullName: [''],
      First_Name: [''],
      Middle_Name: [''],
      Last_Name: [''],
      Nationality: [''],
      Passport: [''],
      Date_of_Birth: [''],
      Registered_Email: [''],
      Gender: [''],
      Registered_MobileNumber: [''],
      Type: [''],
      Terms_and_conditions: [''],
      Version: [''],
      Date: [''],
      Upload_Your_Photo: [''],
      NIV: [''],
      Hcp_qrcode: ['']

    });
  }



  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'NID', dataKey: 'NID', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Provider Name', dataKey: 'ProviderName', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Provider Service Location', dataKey: 'ServiceLocation', position: 'left', isSortable: false,displayAsIcon: false, },
      // { name: 'Number Of HCPs', dataKey: 'NumberOfHCPEnrolled', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Status', dataKey: 'Status', position: 'left', isSortable: false, displayAsIcon: false, },
      { name: 'Number Of HCPs', dataKey: 'NumberOfHCPs', position: 'left', isSortable: false, displayAsIcon: false, },
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        // { label: 'Edit', icon: '', action: this.editOrder },
        // { label: 'Delete', icon: '', action: this.deleteOrder }
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


  toggleFilterPopup(): void {
    const dialogRef = this.dialog.open(ProviderPopupComponent, {
      data: { displayName: 'filterDashboard' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['Status']) {
        const options = result['Status'];
      if (options.includes('All')) {
        this.status = 'All'; 
      } else {
        this.status = options.join(','); 
      }
        console.log(this.status, 'Status');
        this.displayFilterOptions(result);
        this.providerentitygetall();
      } else {
        console.log('No filter options selected');
      }
    });
  }

  removeOption(index: number): void {
    const optionsArray = this.status ? this.status.split(',') : [];
    if (optionsArray[index] === 'All') {
      this.status = null; 
    } else {
      optionsArray.splice(index, 1);
      this.status = optionsArray.length > 0 ? optionsArray.join(',') : null;
    }
    this.providerentitygetall();
  }
  providerentitygetall() {
    this.showSpinner = true;
    let statusToSend = this.status;
    if (!statusToSend || statusToSend === 'All') {
      statusToSend = null;
    }
      this.SuperadminService.providerentitygetall(statusToSend).subscribe(
        (data: any) => {
          console.log(data,"swaroop");
          this.orders = data.Result.reverse().map((item: any,index:any) => {
            const ProviderID = item.ProviderID ? String(item.ProviderID) : '--';
            const NID = item.NID ? String(item.NID) : '--';
            const ProviderName = item.Name ? String(item.Name) : '--';
            const ServiceLocation = item.ServiceLocation ? String(item.ServiceLocation) : '--';
            const Status = item.Status ? String(item.Status) : '--';
            const Count = item.Count ? String(item.Count) : '--';
            const NumberOfHCPs = item.Count ? String(item.Count) : '--';
            const Email = item.Email ? String(item.Email) : '--';



            return {
              sno: index +1,
              ProviderID: ProviderID,
              NID: NID,
              ProviderName: ProviderName,
              ServiceLocation: ServiceLocation,
              NumberOfHCPEnrolled:Count,
              Status:Status,
              id:item.HCID,
              NumberOfHCPs:NumberOfHCPs,
              Email: Email,
              actions: [
                // { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
                // { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) },
                // { label: 'View Professional Details', icon: '', },
                { label: 'Notify', icon: '', },
                { label: 'Delete', icon: '',action: this.deleteOrder },

              ],
            };
          });
          console.log(this.orders, "tabledata");
          console.log(data, "data");

          this.spinnerLoading=false;
        },
        (error: any) => {
          console.error('Error fetching health camp list:', error);
        }
      );
    }
  //   displayFilterOptions(options: any): void {
  //     this.selectedFilterOptions = options;
  //     this.studentMasterlist();
  // }

  displayFilterOptions(options: any[]): void {
    this.selectedFilterOptions = options;
    this.providerentitygetall();
    console.log("Filter options updated");
  }
  deleteOrder(rowData: any): void {

    console.log('Deleting order:', rowData);
  }
  addprovider(){
    const dialogRef = this.dialog.open(AddPoviderComponent, {
      data: {
        title: 'Enterprise Group Name',
      },
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.enterprisegroup();
      this.providerentitygetall()
      // this.enterprisegroupget();

    });
    dialogRef.componentInstance.buttonClickFunction = () => {

      // this.addStudent(dialogRef);
      dialogRef.close();
      // this.refreshPage();




    };
  }



    handleRowAction(event: any) {
      console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
      this.notifyemail = event.element.Email;
      this.notifyname = event.element.ProviderName;
   
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
      // this.deleteEnterprise();
        // this.addStudent(dialogRef);
        dialogRef.close();

      };
      // this.enterprisegroup();
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
   
      // this.enterprisegroup();
    }
        }
    //   if (event.option === 'Health Camp Resource') {
    //     this.router.navigate(['/healthcampresource'])  }

    healthcampgetbyid(){
      // const HCID = sessionStorage.getItem('HCID');
      // console.log(HCID,"HCID")

      this.SuperadminService.providerget(this.provideId).subscribe(
        (data: any) => {
         console.log(data,"narayana")
          const InfoseekMasterId = data.Result[0];

          // console.log(this.enterprisenames,"enterprisenames");

          this.campForm.patchValue({
          // this.hcid = InfoseekMasterId.HCID
          Category: InfoseekMasterId['Category'],
          FullName: InfoseekMasterId['FullName'],
          First_Name: InfoseekMasterId['First_Name'],
          Middle_Name: InfoseekMasterId['Middle_Name'],
          Last_Name: InfoseekMasterId['Last_Name'],
          Nationality: InfoseekMasterId['Nationality'],
          Passport: InfoseekMasterId['Passport'],
          Date_of_Birth: InfoseekMasterId['Date_of_Birth'],
          Registered_Email: InfoseekMasterId['Registered_Email'],
          Gender: InfoseekMasterId['Gender'],
          Registered_MobileNumber: InfoseekMasterId['Registered_MobileNumber'],
          Type: InfoseekMasterId['Type'],
          Terms_and_conditions: InfoseekMasterId['Terms_and_conditions'],
          Version: InfoseekMasterId['Version'],
          Date: InfoseekMasterId['Date'],
          Upload_Your_Photo: InfoseekMasterId['Upload_Your_Photo'],
          NIV: InfoseekMasterId['NIV'],
          Hcp_qrcode: InfoseekMasterId['Hcp_qrcode'],
        }

          );
          console.log(InfoseekMasterId,"provider data");


        });


    }

    breadcrumbs = [
      { label: 'Login', url: '/' },
      { label: 'All Providers', url: '/providerentity' },
    ]
}