
import { Component, ViewChild } from '@angular/core';
import { TableColumn } from '../quickinsights-pro-bite/table/TableColumn';
import { MatSort, Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../quickinsights-pro-bite/probite1-table/probite';
import { MatPaginator } from '@angular/material/paginator';
import { IvinService } from 'src/app/ivin.service';
import { Apollo } from 'apollo-angular';
import { haryanadata } from '../quickinsights-pro-bite/probite.graphql';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class IssuesComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  index= 1;
  lastpagedata =10000;
  state: any;
  election: any;
  year: any;
  constituency: any;
  tabledata: any;
  isLoadingsearch: boolean = false;
  startvalue: any;
  endvalue: any;
  gender: any;
  party: any;
  category: any;


  orders: Order[] = [];
  ordersTableColumns: TableColumn[] = [];
  dataSource = new MatTableDataSource<any>([]);
  
  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,private ivinservice:IvinService,private apollo:Apollo
  ) {}
  ngOnInit(): void {
    this.initializeColumns();
    this.initializeOrders();
    this.Issuedata();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  sortData(sortParameters: Sort) {
    const keyName: keyof Order = sortParameters.active as keyof Order;
    this.orders = this.orders.sort((a: Order, b: Order) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }
  
  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S.No', dataKey: 'sno', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'TicketID', dataKey: 'TicketID', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Name', dataKey: 'Name', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Email', dataKey: 'Email', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Mobile Number', dataKey: 'MobileNumber', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Issue', dataKey: 'Issue', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Issue Type', dataKey: 'IssueType', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Issue Category', dataKey: 'IssueCategory', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'State', dataKey: 'State', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'District', dataKey: 'District', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Pincode', dataKey: 'Pincode', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'AreaName', dataKey: 'AreaName', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'CreatedOn', dataKey: 'CreatedOn', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'UpdatedOn', dataKey: 'UpdatedOn', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Status', dataKey: 'StatusId', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'IssueDocuments', dataKey: 'IssueDocuments', position: 'left', isSortable: true,displayAsIcon: false  },



    //   { name: 'Actions', dataKey: 'Total', position: 'left', displayAsIcon: true, customOptions: [
    //     { label: 'Edit', icon: 'Symbol', action: this.editOrder },
    //     { label: 'Delete', icon: 'delete', action: this.deleteOrder }
    //   ]
    // },

    

    ];
  }
  initializeOrders(): void {
    // const data = [
    //   { id: 1, description: 'Timpany, Gajuwaka', amount: 'Timpany Group', price: 'Teja',stuts:'Verified',viewstat:'more_vert'},
    //   { id: 2, description: 'Harmony Academy, Yendada', amount: 'TATA Group', price: 'Raja', stuts:'Not Verified',viewstat:'more_vert'},
    //   { id: 3, description: 'Scholars School, Duvada', amount: 'Birla Group', price: 'Teja', stuts:'Completed',viewstat:'more_vert' },
    //   { id: 4, description: 'Crestwood Collegiate, Gajuwaka', amount: 'LTC Group', price: 'Raja',stuts:'Verified',viewstat:'more_vert ' },
    //   { id: 5, description: 'Pioneer Prep Schoo, Aruku', amount: 'Timpany Group', price: 'Teja',stuts:'ReportedHand Over',viewstat:' more_vert'},
    //   { id: 6, description: 'Unity High School, RK Puram', amount: 'TATA Group', price: 'Raja', stuts:'Not Verified',viewstat:'more_vert '},
    //   { id: 7, description: 'Springs School, Simhachalam', amount: 'Birla Group', price: 'Raja',stuts:'Completed',viewstat:'more_vert' },
    //   { id: 8, description: 'Ivy Grove Academy, RK Nagar', amount: 'LTC Group', price: 'Teja',stuts:'Verified',viewstat:' more_vert'},
    //   { id: 9, description: 'Blossom Bay School, Aruku', amount: 'Birla Group', price: 'Raja',stuts:'Completed',viewstat:'more_vert '},
    //   { id: 10, description: 'Beacon Elementary, Duvada', amount: 'LTC Group', price: 'Teja',stuts:'Not Verified',viewstat:'more_vert' },
    //   { id: 11, description: 'Sapphire Academy, RK Puram ', amount: 'TATA Group', price: 'Raja',stuts:'Not Verified',viewstat:'more_vert' },
    //   // { id: 2, description: 'Beacon Elementary, Duvada', amount: '7', price: 'A',stuts:'ReportedHand Over',viewstat:' more_vert' },
    //   // Add more data objects here as needed
    // // ];
    // this.orders = data.map(item => ({
    //   id: item.id,
    //   description: item.description,
    //   amount: String(item.amount),
    //   price: String(item.price),
    //   stuts: String(item.stuts),
    //   actions: [
    //     { label: 'Edit', icon: 'edit', action: this.editOrder.bind(this, item) },
    //     { label: 'Delete', icon: 'delete', action: this.deleteOrder.bind(this, item) }
    //   ]
    // }));
  }
  editOrder(rowData: any): void {
    console.log('Editing order:', rowData);
  }
  deleteOrder(rowData: any): void {
    console.log('Deleting order:', rowData);
  }
  handleRowAction(event: any) {
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
  }

  Issuedata() {
    this.ivinservice.issuesdata().subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('Issue data',data);

        // const formatDate = (dateString:any) => {
        //   if (!dateString) return '--';
        //   const date = new Date(dateString);
        //   const day = String(date.getDate()).padStart(2, '0');
        //   const month = String(date.getMonth() + 1).padStart(2, '0');
        //   const year = date.getFullYear();
        //   return `${day}-${month}-${year}`;
        // };

        const formatDate = (dateString: any) => {
          if (!dateString) return '--';
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        this.orders = data.Result.reverse().map((item: any, index: any) => {
          const  TicketID = item.TicketId || '--';
          const Name = item.Name || '--';
          const Email = item.Email || '--';
          const MobileNumber = item. MobileNumber || '--';
          const Issue = item.Issue || '--';
          const IssueType = item.IssueType|| '--';
          const IssueCategory = item.IssueCategory || '--';
          const State = item.State || '--';
          const District = item.District || '--';
          const  Pincode = item.Pincode || '--';
          const AreaName = item.AreaName|| '--';
          const CreatedOn = item.CreatedOn ? formatDate(item.CreatedOn) : '--';
          const UpdatedOn = item.UpdatedOn ? formatDate(item.UpdatedOn) : '--';
          const StatusId = item.StatusId?.raiseissue_status|| '--';
          const IssueDocuments = item.Issue_doc ? 
          `<div class="clickable-wrapper"><a href="${item.Issue_doc}" target="_blank">View Document</a></div>` : '--';
          
          const actions = [
           
            { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
            { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
          ];
          return {
            sno: index + 1,
            TicketID,
            Name,
            Email,
            MobileNumber,
            Issue,
            IssueType,
            IssueCategory,
            State,
            District,
            Pincode,
            AreaName,
            CreatedOn,
            UpdatedOn,
            StatusId,
            IssueDocuments,
            
            actions
          };
        });
        this.isLoadingsearch = false;
     
      }else{
        console.log('No data Available')
      }
    })
  }
  


}
