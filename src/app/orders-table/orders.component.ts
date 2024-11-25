import {Component, OnInit} from '@angular/core';
import { TableColumn } from '../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from './order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  ordersTableColumns: TableColumn[] = [];

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeOrders();
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
      { name: 'S #', dataKey: 'id', position: 'left', isSortable: true,displayAsIcon: false ,},
      { name: 'Enterprise Name', dataKey: 'description', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Group Name', dataKey: 'amount', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Contact Person', dataKey: 'price', position: 'left', isSortable: true,displayAsIcon: false, },
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: true,displayAsIcon: false, },
      // { name: 'jj', dataKey: 'viewstat', position: 'left', isSortable: false,displayAsIcon: true  ,iconName: 'more_vert', },
      { name: 'Actions', dataKey: 'actions', position: 'left', displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: 'edit', action: this.editOrder },
        { label: 'Delete', icon: 'delete', action: this.deleteOrder }
      ]
    },
    ];
  }

  initializeOrders(): void {
    const data = [
      { id: 1, description: 'Timpany, Gajuwaka', amount: 'Timpany Group', price: 'Teja',stuts:'Verified',viewstat:'more_vert'},
      { id: 2, description: 'Harmony Academy, Yendada', amount: 'TATA Group', price: 'Raja', stuts:'Not Verified',viewstat:'more_vert'},
      { id: 3, description: 'Scholars School, Duvada', amount: 'Birla Group', price: 'Teja', stuts:'Completed',viewstat:'more_vert' },
      { id: 4, description: 'Crestwood Collegiate, Gajuwaka', amount: 'LTC Group', price: 'Raja',stuts:'Verified',viewstat:'more_vert ' },
      { id: 5, description: 'Pioneer Prep Schoo, Aruku', amount: 'Timpany Group', price: 'Teja',stuts:'ReportedHand Over',viewstat:' more_vert'},
      { id: 6, description: 'Unity High School, RK Puram', amount: 'TATA Group', price: 'Raja', stuts:'Not Verified',viewstat:'more_vert '},
      { id: 7, description: 'Springs School, Simhachalam', amount: 'Birla Group', price: 'Raja',stuts:'Completed',viewstat:'more_vert' },
      { id: 8, description: 'Ivy Grove Academy, RK Nagar', amount: 'LTC Group', price: 'Teja',stuts:'Verified',viewstat:' more_vert'},
      { id: 9, description: 'Blossom Bay School, Aruku', amount: 'Birla Group', price: 'Raja',stuts:'Completed',viewstat:'more_vert '},
      { id: 10, description: 'Beacon Elementary, Duvada', amount: 'LTC Group', price: 'Teja',stuts:'Not Verified',viewstat:'more_vert' },
      { id: 11, description: 'Sapphire Academy, RK Puram ', amount: 'TATA Group', price: 'Raja',stuts:'Not Verified',viewstat:'more_vert' },
      // { id: 2, description: 'Beacon Elementary, Duvada', amount: '7', price: 'A',stuts:'ReportedHand Over',viewstat:' more_vert' },
    
      // Add more data objects here as needed
    ];

    this.orders = data.map(item => ({
      id: item.id,
      description: item.description,
      amount: String(item.amount),
      price: String(item.price),
      stuts: String(item.stuts),
      actions: [
        { label: 'Edit', icon: 'edit', action: this.editOrder.bind(this, item) },
        { label: 'Delete', icon: 'delete', action: this.deleteOrder.bind(this, item) }
      ]
    }));
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