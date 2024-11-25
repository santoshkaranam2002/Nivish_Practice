import { Component, ViewChild } from '@angular/core';
import { TableColumn } from '../table/TableColumn';
import { MatSort, Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from './probite';
import { MatPaginator } from '@angular/material/paginator';
import { IvinService } from 'src/app/ivin.service';
import { Apollo } from 'apollo-angular';
import { haryanadata } from '../probite.graphql';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-probite1-table',
  templateUrl: './probite1-table.component.html',
  styleUrls: ['./probite1-table.component.scss'],
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class Probite1TableComponent {

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
    this.Gettabledata();
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
      { name: 'Assembly Constituency', dataKey: 'ACName', position: 'left', isSortable: true,displayAsIcon: false ,},
      { name: 'Candidate Name', dataKey: 'CandidateName', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Gender', dataKey: 'Gender', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Age', dataKey: 'Age', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Candidate Category', dataKey: 'Candidate_Category', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Political Party', dataKey: 'Party', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Party Symbol', dataKey: 'Symbol', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Postal Votes', dataKey: 'PostalVotes', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Total Votes Polled', dataKey: 'Total', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Votes Polled', dataKey: 'VotesPolledPer', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Total Electors', dataKey: 'TotalElectors', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Election Name', dataKey: 'ElectionName', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Election Year', dataKey: 'ElectionYear', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Election Date', dataKey: 'ElectionDate', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Election Type', dataKey: 'ACPCByPoll', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'State/UT Name', dataKey: 'StateUTName', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'AC Number', dataKey: 'ACNO', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'AC Category', dataKey: 'ACCategory', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Win Order', dataKey: 'WinOrder', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'PC Name', dataKey: 'PCName', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'General Votes', dataKey: 'General_Votes', position: 'left', isSortable: true,displayAsIcon: false  },
      { name: 'Service Votes', dataKey: 'ServiceVotes', position: 'left', isSortable: true,displayAsIcon: false  },



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

  Gettabledata() {
    this.isLoadingsearch = true;
    this.state = this.ivinservice.stateselected;
    this.election = this.ivinservice.electionselected;
    this.year = this.ivinservice.yearselected;
    this.constituency = this.ivinservice.constituencyselected;
    this.startvalue = this.ivinservice.startvalue;
    this.endvalue = this.ivinservice.endvalue;
    this.gender = this.ivinservice.genderselected;
    this.party = this.ivinservice.partyselected;
    this.category = this.ivinservice.categoryselected;
    console.log("@@@ TTTTTTT",this.state);
    console.log("@@@ ttt",this.election);
    console.log("@@@ tt",this.year);
    console.log("@@@ tt",this.constituency);
    console.log("@@@ tt",this.startvalue);
    console.log("@@@ tt",this.endvalue);
    console.log("@@@ tt",this.gender);
    console.log("@@@ tt",this.party);
    console.log("@@@ tt",this.category);
  
    const tabledatavariables = {
      state : this.state,
      election : this.election,
      year : this.year,
      constituency : this.constituency || null,
      gender : this.gender || null,
      toage : this.endvalue || null,
      fromage : this.startvalue || null,
      party : this.party || null,
      candidature : this.category || null
    }
    console.log("tabledata variables",tabledatavariables);
    this.apollo.use('probite').watchQuery({
      query : haryanadata,
      variables : tabledatavariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.tabledata = data.haryanaData.Result;
      console.log("result Table",this.tabledata);
      this.orders = data.haryanaData.Result.map((item: any, index: any) => {
        const ACName = item.ACName|| '--';
        const CandidateName = item.CandidateName || '--';
        const  Gender = item.Gender || '--';
        const Age = item.Age || '--';
        const Candidate_Category = item.Candidate_Category || '--';
        const Party = item. Party || '--';
        const Symbol = item.Symbol  || '--';
        const PostalVotes = item.PostalVotes || '--';
        const Total = item.Total|| '--';
        const VotesPolledPer = item.VotesPolledPer ? parseFloat(item.VotesPolledPer).toFixed(2): '--';
        const TotalElectors = item.TotalElectors || '--';
        const ElectionName = item.ElectionName || '--';
        const ElectionYear = item.ElectionYear || '--';
        const  ElectionDate = item.ElectionDate || '--';
        const ACPCByPoll = item.ACPCByPoll|| '--';
        const StateUTName = item.StateUTName|| '--';
        const  ACNO = item. ACNO || '--';
        const ACCategory = item.ACCategory|| '--';
        const WinOrder = item.WinOrder|| '--';
        const PCName = item.PCName|| '--';
        const General_Votes = item.General_Votes || '--';
        // console.log('general votes data',General_Votes);
        const  ServiceVotes = item. ServiceVotes|| '--';
        const infoseekId = item.InfoseekId;
        const actions = [
         
          { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
          { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
        ];
        return {
          sno: index + 1,
          ACName,
          CandidateName,
          Gender,
          Age,
          Candidate_Category,
          Party,
          Symbol,
          PostalVotes,
          Total,
          VotesPolledPer,
          TotalElectors,
          ElectionName,
          ElectionYear,
          ElectionDate,
          ACPCByPoll,
          StateUTName,
          ACNO,
          ACCategory,
          WinOrder,
          PCName,
          General_Votes,
          ServiceVotes,
        
          infoseekId,
          
          actions
        };
      });
      this.isLoadingsearch = false;
    })
 
  }
  
}






