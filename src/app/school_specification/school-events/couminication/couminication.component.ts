import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { couminication } from '../school_praticipants';
import { SuperadminService } from '../../../superadmin.service';




@Component({
  selector: 'app-couminication',
  templateUrl: './couminication.component.html',
  styleUrls: ['./couminication.component.scss']
})
export class CouminicationComponent implements OnInit {
  orders: couminication[] = [];
  ordersTableColumns: TableColumn[] = [];

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,
    private SuperadminService: SuperadminService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.couminicationgets();

  }

  sortData(sortParameters: Sort) {
    const keyName: keyof couminication = sortParameters.active as keyof couminication;
    this.orders = this.orders.sort((a: couminication, b: couminication) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'UIN', dataKey: 'uin', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Name', dataKey: 'Name', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Class & Section', dataKey: 'classandSection', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Report Status', dataKey: 'rollNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Next Action', dataKey: 'regnNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Communication Name', dataKey: 'regnNo', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: '', action: this.editOrder },
        { label: 'Delete', icon: '', action: this.deleteOrder }
      ]
    }
    ];
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


  couminicationgets() {
    const coummnicate = {
      HCID: '140',
    };

    this.SuperadminService.couminicationget(coummnicate.HCID).subscribe(
      (data: any) => {
        console.log('coumnSSSicationget', data);
        this.orders = data.Result.map((communication: any, index: any) => {
          const combinedData = [
            ...communication.stack_for_email_InfoseekId_data,
            ...communication.handover_in_person_InfoseekId_data,
          ];                    
          return combinedData.map((item: any, itemIndex: any) => {
            const UIN = item.UIN ? String(item.UIN) : '--';
            const studentFullName = item.Student_FirstName ? String(item.Student_FirstName) : '--';
            const class_name = item.class_name ? String(item.class_name) : '--';
            const section_name = item.section_name ? String(item.section_name) : '--';
            const classandSection = `${class_name} ${section_name}`.trim();
            const Communication_Name = communication.Communication_Name ? String(communication.Communication_Name) : '--';
            const HCPID = communication.HCPID ? String(communication.HCPID) : '--';
            
            return {
              sno: itemIndex + 1,
              uin: UIN,
              studentFullName: studentFullName,
              classandSection: classandSection,
              Communication_Name: Communication_Name,
              HCPID: HCPID,
              actions: []
            };
          });
        }).flat();
      },
      (error: any) => {
        console.error('Error fetching communication data', error);
      }
    );
  }
  
    
    
    
  }

