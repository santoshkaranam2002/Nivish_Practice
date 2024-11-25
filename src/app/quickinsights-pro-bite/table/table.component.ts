import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableColumn } from './TableColumn';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'custom-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [DatePipe]
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() showCheckboxes: boolean = false;
  public tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public displayedColumns: string[] = [];
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @Input() showDateFilters: boolean = true;
  @Input() heading: string = '';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() isdatefilter = false;
  @Input() addstudent = false;
  @Input() tableColumns: TableColumn[] = [];
  @Input() rowActionIcon = '';
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];
  @Input() classname2 = " ";
  @Input() icon: string = '';
  @Input() buttion: string = '';
  @Input() button: string = '';
  @Input() buttonLabel: string = 'Button Label';
  @Input() buttonIcon: string = 'add';
  @Input() showButton: boolean = false;
  @Input() buttonColor: string = '';
  @Input() classname: string = '';
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewStationsClicked: EventEmitter<any> = new EventEmitter<any>();
  public startDate: Date | null = null;
  public endDate: Date | null = null;
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

  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe,
    private dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
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
    console.log(row, "row");
  }

  openLink(url: string) {
    console.log('Opening link: ', url);
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    window.open(sanitizedUrl.toString(), '_blank');
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

  applyDateFilter(): void {
    this.tableDataSource.data = this.tableDataSource.data.filter(order => {
      const createdOn = new Date(order.CreatedOn);
      return (
        (!this.startDate || createdOn >= this.startDate) &&
        (!this.endDate || createdOn <= this.endDate)
      );
    });

    // Format dates before logging
    const formattedStartDate = this.datePipe.transform(this.startDate, 'dd-MMM-yyyy');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'dd-MMM-yyyy');

    console.log('startdate', formattedStartDate);
    console.log('endDate', formattedEndDate);
  }

  updateStartDate(event: any): void {
    this.startDate = event.value;
    // console.log('Selected Start Date:', this.startDate);
    this.applyDateFilter();
  }
  
  updateEndDate(event: any): void {
    this.endDate = event.value;
    // console.log('Selected End Date:', this.endDate);
    this.applyDateFilter();
  }

  getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
      return '#FF6D00';
    } else if (data === 'Inactive') {
      return '#828282';
    } else if (data === 'No Infoseek') {
      return '#000000';
    } else if (data === 'Scheduled') {
      return '#008F28';
    } else if (data === 'Canceled') {
      return '#828282';
    } else if (data === 'Rescheduled') {
      return 'rgba(32, 160, 216, 1)';
    } else if (data === 'Not Scheduled') {
      return '#FF6D00';
    } else if (data === 'Infoseek') {
      return '#008F28';
    } else {
      return 'rgba(51, 51, 51, 1)';
    }
  }

  // New method to sanitize HTML content
  public getSanitizedHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  onViewStationsClicked(row: any): void {
    this.viewStationsClicked.emit(row);
  }

  handleMenuItemClick(option: string, icon: string, element: any) {
    this.rowAction.emit({ option, icon, element });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    console.log(numRows, "checkbox");
    return numSelected === numRows;
  }

  onCheckboxChange(row: any) {
    this.selection.toggle(row);
    console.log('Selected data:', this.selection.selected);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDataSource.data.forEach(row => this.selection.select(row));
    console.log(this.tableDataSource.data.forEach(row => this.selection.select(row)), "aim");
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}
