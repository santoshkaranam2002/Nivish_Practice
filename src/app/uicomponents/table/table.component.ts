import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TableColumn} from './TableColumn';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'custom-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() showCheckboxes: boolean = false;
  public tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public displayedColumns: string[] = [];
  @ViewChild(MatPaginator, {static: false}) matPaginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) matSort!: MatSort;
  @Input() heading: string='';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() addstudent = false;
  @Input() tableColumns: TableColumn[] = [];
  @Input() rowActionIcon = '';
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];
  @Input() classname2 =" ";
  @Input() icon: string = '';
  @Input() buttion: string = '';
  @Input() button: string = '';
  @Input() buttonLabel: string = 'Button Label';
  @Input() buttonIcon: string = 'add';
  @Input() showButton: boolean = false;
  @Input() buttonColor: string = '';
  @Input() classname: string = '';
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
    // @Input() buttion: string = '';
  @Output() viewStationsClicked: EventEmitter<any> = new EventEmitter<any>();

  chips: string[] = [];
  showFilter: boolean = false;
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  reviewStatus!: string;
  flag!: string;
  showNoResultsMessage: boolean | undefined;
  public selection = new SelectionModel<any>(true, []);
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);
    if (this.rowActionIcon) {
      this.displayedColumns = [this.rowActionIcon, ...columnNames];
    } else {
      this.displayedColumns = columnNames;
    }

    if (this.showCheckboxes) {
      this.displayedColumns = ['select', ...this.displayedColumns];
    }
  }

  ngAfterViewInit(): void {
    if (this.matPaginator) {
      this.tableDataSource.paginator = this.matPaginator;
    }

    this.selection.changed.subscribe(() => {
      this.selectionChange.emit(this.selection.selected);
    });
  }
  
  onRowClick(row: any) {
    this.rowClick.emit(row);
    console.log(row,"row");
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    if (this.matPaginator) {
      this.tableDataSource.paginator = this.matPaginator;
    }
    if (this.matSort) {
      this.tableDataSource.sort = this.matSort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.filteredData.length === 0) {
      this.showNoResultsMessage = true;
    } else {
      this.showNoResultsMessage = false;
    }
  }


  sortTable(sortParameters: Sort) {
    if (this.tableColumns) {
      const activeColumn = this.tableColumns.find(column => column.name === sortParameters.active);
      if (activeColumn) {
        sortParameters.active = activeColumn.dataKey;
      }
    }
    this.sort.emit(sortParameters);
  }

  emitRowAction(row: any) {
    this.rowAction.emit(row);
  }


  removeChip(chip: string) {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }


  viewStatus(element: any): void {
    this.router.navigate(['/view-status']);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  closeInput(inputField: ElementRef<HTMLInputElement>): void {
    inputField.nativeElement.value = ''; // Clear input value
    inputField.nativeElement.style.display = 'none'; // Hide the input field
  }

getColorForData(data: any): string {

  if (data === 'stuts') {
    return '#00D566';
  } else if (data === 'Verified') {
    return '#008F28';
  } else if (data === 'Not Verified') {
    return '#FF6D00'
  } else if (data === 'Inactive') {
    return '#828282'
  } else if (data === 'No InfoSeek') {
    return 'rgba(229, 57, 53, 1)'
  }
  else if (data === 'Scheduled') {
    return '#008F28';
  }
  else if (data === 'Canceled') {
    return '#828282';
  }
  else if (data === 'Rescheduled') {
    return 'rgba(32, 160, 216, 1)';
  }
  else if (data === 'Not Scheduled') {
    return '#FF6D00'
  }
  else if (data === 'InfoSeek') {
    return '#008F28'
  } else {
    return 'rgba(51, 51, 51, 1)'
  }
}
// openDialog(): void {
//   const dialogRef = this.dialog.open( {
//     width: '80%',
//     height: '90%',



//   });

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('The dialog was closed');
//   });
// }
onViewStationsClicked(row: any): void {
  this.viewStationsClicked.emit(row);
}
handleMenuItemClick(option: string, icon: string, element: any) {
  this.rowAction.emit({ option, icon, element });
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.tableDataSource.data.length;
  console.log(numRows,"checkbox")
  return numSelected === numRows;

}
onCheckboxChange(row: any) {
  this.selection.toggle(row);
  console.log('Selected data:', this.selection.selected);
}
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    // this.selection.toggle(row);
    this.tableDataSource.data.forEach(row => this.selection.select(row));
    console.log( this.tableDataSource.data.forEach(row => this.selection.select(row)),"aim");
}
onButtonClick() {
  this.buttonClick.emit();
}

}
