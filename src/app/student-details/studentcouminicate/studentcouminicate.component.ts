import {Component, OnInit} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { studentcouminication } from '../../school_specification/school-events/school_praticipants';

@Component({
  selector: 'app-studentcouminicate',
  templateUrl: './studentcouminicate.component.html',
  styleUrl: './studentcouminicate.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class StudentcouminicateComponent {  
  orders: studentcouminication[] = [];
  ordersTableColumns: TableColumn[] = [];
  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
  }

  
  sortData(sortParameters: Sort) {
    const keyName: keyof studentcouminication = sortParameters.active as keyof studentcouminication;
    this.orders = this.orders.sort((a: studentcouminication, b: studentcouminication) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
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
 
  editOrder(rowData: any): void {    
    console.log('Editing order:', rowData);
  }

  deleteOrder(rowData: any): void {
    console.log('Deleting order:', rowData);
  }
  handleRowAction(event: any) {    
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
  }

}