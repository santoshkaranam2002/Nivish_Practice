import { Component,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';
import { Apollo } from 'apollo-angular';
import { haryanadata } from '../probite.graphql';

@Component({
  selector: 'app-probite-table',
  templateUrl: './probite-table.component.html',
  styleUrls: ['./probite-table.component.scss']
})
export class ProbiteTableComponent {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['AssemblyConstituency','Candidate Name','Gender','Age','Candidate Category',
  'Political Party','Party Symbol','Postal Votes','TotalVotesPolled','Votes Polled',
  'Total Electors','Election Name', 'Election Year', 'Election Date', 'Election Type','State/UT Name',
  'AC Number','AC Category','Win Order','PC Name','General Votes','Service Votes'];

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

  constructor(private router: Router, private ivinservice:IvinService,private apollo:Apollo) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.Gettabledata();
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
    console.log("@@@",this.state);
    console.log("@@@",this.election);
    console.log("@@@",this.year);
    console.log("@@@",this.constituency);
    console.log("@@@",this.startvalue);
    console.log("@@@",this.endvalue);
    console.log("@@@",this.gender);
    console.log("@@@",this.party);
    console.log("@@@",this.category);
  
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
      console.log("result",this.tabledata);
      this.dataSource.data = this.tabledata ;
      this.isLoadingsearch = false;
    })
 
  }

}
