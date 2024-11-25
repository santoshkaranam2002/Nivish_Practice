import { Component } from '@angular/core';
import { CurrencyPipe, DecimalPipe, Location, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { eventProfileQuery, eventSchoolQuery, participantQuery, summerQuery } from '../school-profile/schoolprofile.graphql';
import { participants } from './school_praticipants';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-school-events',
  templateUrl: './school-events.component.html',
  styleUrl: './school-events.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe],
})
export class SchoolEventsComponent {
  orders: participants[] = [];
  ordersTableColumns: TableColumn[] = [];
  ordersTableColumnsss: TableColumn[] = [];
  isLoading:boolean=false;
  schoolprofile:any
  mobile:any;
  rowData: any;
  hcid: any;
  healthcampprofile: any;
  title='Event Include / Exclude List';
  updatedDate: Date = new Date();
  classSection:any;
  included:any;
  excluded :any;
  total:any;
  hcSummary: any;
  noData: boolean = false;
  eventParticipants: any[] = [];
  spinnerLoading=true;
  status: any;
  constructor(private router:Router,private dialog:MatDialog,private apollo:Apollo,private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,private location:Location){
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.rowData = navigation.extras.state['data'];
        this.hcid=this.rowData.hcid;
        console.log('Received row data:', this.rowData,this.hcid);

      }
  }
  ngOnInit(){
    this.initializeColumns();
    this.initializeColumncoumnicate();
    this.getEventProfile();
    this.getParticipants();

  }
  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'UIN', dataKey: 'uin', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Student Full Name', dataKey: 'studentFullName', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Class & Section', dataKey: 'classandSection', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Roll #', dataKey: 'rollNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Regn #', dataKey: 'regnNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
  }

  
  initializeColumncoumnicate(): void {
    this.ordersTableColumnsss = [
      { name: 'Sdfhhfgh #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'UIN', dataKey: 'uin', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Student Full Name', dataKey: 'studentFullName', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Class & Section', dataKey: 'classandSection', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Roll #', dataKey: 'rollNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Regn #', dataKey: 'regnNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
  }
  sortData(sortParameters: Sort) {
    const keyName: keyof participants = sortParameters.active as keyof participants;
    this.orders = this.orders.sort((a: participants, b: participants) =>
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
  openEditPopup(){}
  goBack(){
    this.location.back();
  }
  downloadSchoolDetails(){}
  getEventProfile(){
    const eventProfile ={
      HCID:this.hcid,
    };
    console.log(eventProfile,"epname");
    this.apollo.use('superAdminevents').watchQuery({
      query:eventProfileQuery,
      variables:eventProfile,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe(({data}:any)=>
    {
      this.healthcampprofile = data.healthcampDetails[0];
      this.status=this.healthcampprofile.Scheduled_Status||'N/A';
      console.log(data,"data");
      this.spinnerLoading=false
      this.getsummery();

    })
  }
  getsummery() {
    console.log("sum");
    const summary = {
      summery: this.hcid,
    };
    console.log(summary, "epname");
    this.apollo.use('superAdminevents').watchQuery({
      query: summerQuery,
      variables: summary,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe(({data}: any) => {
      console.log(data,"hcsummeryData");
      if (data && data.hcSummury) {
        this.hcSummary = data.hcSummury;
        this.classSection = this.hcSummary[0].ClassandSections||'N/A';
        this.included=this.hcSummary[0].Include||'N/A';
        this.excluded=this.hcSummary[0].Exclude||'N/A';
        this.total=this.hcSummary[0].Total||'N/A';
        this.updatedDate=this.hcSummary[0].UpdatedOn||'N/A'
        console.log(this.hcSummary, "hcSummary");
      }
    }, (error: any) => {
      console.error('GraphQL query error:', error);
    });
  }
  getParticipants(){
    const participant = {
      hcId:  parseInt(this.hcid)
    };
    console.log(participant, "participant");
    this.apollo.use('superAdminevents').watchQuery({
      query: participantQuery,
      variables: participant,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe(({data}: any) => {
      console.log(data,"ParticipantsDetails");
      if (data && data.ParticipantsDetails.length > 0) {
        this.eventParticipants = [...data.ParticipantsDetails].reverse();
        console.log(this.eventParticipants,"eventParticipants");
          this.orders = this.eventParticipants.map((item: any, index: any) => {
            const uin=item.UIN ? String(item.UIN) : '--';
            const studentFullName=item.Student_FirstName ? String(item.Student_FirstName) : '--';
            const classs=item.class_name ? String(item.class_name) : '--';
            const section=item.section_name?String(item.section_name) : '--';
            const classandSection = `${classs} ${section}`.trim();
            const rollNo=item.Student_Roll_number?String(item.Student_Roll_number) : '--';
            const regnNo=item.Student_Admission_code?String(item.Student_Admission_code) : '--';
            const stuts = item.Event_Status ? String(item.Event_Status) : '--';
            const infoseekId=item.InfoseekId
            const Infoseek_Masterid=item.Infoseek_Master;
            console.log(Infoseek_Masterid,"Infoseek_Masterid")
            return {
              sno: index + 1,
              uin: uin,
              studentFullName: studentFullName,
              classandSection: classandSection,
              rollNo:rollNo,
              regnNo:regnNo,
              infoseekId:infoseekId,
              stuts:stuts,
              Infoseek_Masterid:Infoseek_Masterid,
              actions: [
                    // { label: 'Generate Temporary UIN', icon: '', },
                { label: 'Edit', icon: '', action: this.editOrder },
                { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
                ]
              };
          })
          this.noData = false;
        }


    }, (error: any) => {
      console.error('GraphQL query error:', error);
    });
  }
  onRowClicked(rowData:any){
    console.log('row',rowData);
    const sanitizedData = this.sanitizeData(rowData);
    this.router.navigate(['/studentdetails'],{ state: { data: sanitizedData } });
  }
  sanitizeData(data: any): any {
    // Create a new object with only serializable properties
    return {
      sno: data.sno,
      uin: data.uin,
      studentFullName: data.studentFullName,
      classandSection: data.classandSection,
      rollNo:data.rollNo,
      regnNo:data.regnNo,
      infoseekId:data.infoseekId,
      stuts:data.stuts,
      Infoseek_Masterid:data.Infoseek_Masterid,

    };
  }
  handleRowAction(row:any){}
}