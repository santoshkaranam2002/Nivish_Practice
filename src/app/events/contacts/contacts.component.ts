import { Component, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IvinService } from 'src/app/ivin.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class ContactsComponent  {
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();

  columnsToDisplay = ['BoothNoandName', 'BoothIncharge', 'MandalIncharge', 'DataEntry', 'Cluster', 'FollowupPerson', 'FoodIncharge', 'Route', 'VoterMotivation','UnitNo','TentInchage1','TentInchage2'];
  expandedElement: any;

  contacts: FormGroup;
  stations: any;
  dataSource = new MatTableDataSource<any>();


  constructor(private fb: FormBuilder,private ivinservice:IvinService) {
    this.contacts = this.fb.group({
      view: ['Table', Validators.required],
    });
  }

  contactsclose(){
    this.moveToTab.emit(4);
  }

  ngOnInit(){
    const UserEmail = localStorage.getItem('userEmail');
    this.PollingDropDown(UserEmail);
  }

  // This is for get the data in the Table
  PollingDropDown(byemail:any){
    this.ivinservice.PollingStationGet(byemail).subscribe((data:any) => {
      if (data && data.Result) {
        this.dataSource.data = data.Result;
        console.log('tablestatsss',this.dataSource.data)
        // this.pollingstationsnames = data.Result.map((item:any)=>item.Polling_Station_Name_Num);
        // console.log('stationnamess',this.pollingstationsnames);
      }
    })
  }

}
