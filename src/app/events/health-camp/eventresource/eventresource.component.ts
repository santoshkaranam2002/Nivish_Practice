import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { eventresource } from '../healthcamp';
import { SuperadminService } from '../../../superadmin.service';

@Component({
  selector: 'app-eventresource',
  templateUrl: './eventresource.component.html',
  styleUrls: ['./eventresource.component.scss'],
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class EventresourceComponent implements OnInit {

  orders: eventresource[] = [];
  ordersTableColumns: TableColumn[] = [];
  hcid: any;
  hcpdata: any;

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,
    private SuperadminService: SuperadminService,
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.evrntresourceget();
    this.hcid = sessionStorage.getItem('hcid');
    console.log(this.hcid, "HCID EventresourceComponent");
  }

  sortData(sortParameters: Sort) {
    const keyName: keyof eventresource = sortParameters.active as keyof eventresource;
    this.orders = this.orders.sort((a: eventresource, b: eventresource) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'Resource', dataKey: 'FullName', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Category', dataKey: 'Category', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Actions', dataKey: 'actions', position: 'center', isSortable: true, displayAsIcon: true, customOptions: []},
      { name: 'Camp Duration', dataKey: 'CampDates', position: 'left', isSortable: false, displayAsIcon: false },
      { name: 'Station Name', dataKey: 'Station_Names', position: 'left', isSortable: false, displayAsIcon: false },
     
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

  evrntresourceget() {
    const HCID = sessionStorage.getItem('hcid');
    console.log('eventrowdata', HCID);
    this.SuperadminService.studentresourcr(HCID).subscribe(
      (data: any) => {
        console.log(data, 'data');
        if (data && data.Result) {
          console.log('Event Resource Data', data);
          this.orders = data.Result.map((item: any, index: number) => {
            console.log(`Item ${index + 1}:`);
            console.log('HCP Data:', item.HcpData);
            console.log('HCID Data:', item.HCID);
            console.log('StationID Data:', item.StationID);
            return {
              FullName: item.HcpData.FullName || 'N/A',
              Category: item.HcpData.Category || 'N/A',
              CampDates: `${item.HCID.StartDate} To ${item.HCID.EndDate}` || 'N/A',
              Station_Names: item.StationID.Station_Names || 'N/A',
            };
          });
        } else {
          console.log('No data found or invalid response structure.');
        }
      },
      (error) => {
        console.error('Error fetching event resource data:', error);
      }
    );
  }
}
