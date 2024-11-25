import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-health-camp-resource',
  templateUrl: './health-camp-resource.component.html',
  styleUrls: ['./health-camp-resource.component.scss']
})
export class HealthCampResourceComponent {
  constructor(private dialog: MatDialog, private router: Router) { }
  displayedColumns = [
    'Resource',
    'Category',
    'star',
    'Day1',
    'Day2',
    'Day3',
    'Day4',
    'Day5'
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  openpopup() {
    this.router.navigate(['/healthcampresourceactionspopup']);
  }
}

export interface PeriodicElement {
  Resource: string;
  Category: number;
  weight: number;
  symbol: string;
  Day1: string;
  Day2: string;
  Day3: string;
  Day4: string;
  Day5: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Category: 1, Resource: 'Hydrogen', weight: 1.0079, symbol: 'H', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 2, Resource: 'Helium', weight: 4.0026, symbol: 'He', Day1: 'A', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 3, Resource: 'Lithium', weight: 6.941, symbol: 'Li', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 4, Resource: 'Beryllium', weight: 9.0122, symbol: 'Be', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 5, Resource: 'Boron', weight: 10.811, symbol: 'B', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 6, Resource: 'Carbon', weight: 12.0107, symbol: 'C', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 7, Resource: 'Nitrogen', weight: 14.0067, symbol: 'N', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 8, Resource: 'Oxygen', weight: 15.9994, symbol: 'O', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 9, Resource: 'Fluorine', weight: 18.9984, symbol: 'F', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' },
  { Category: 10, Resource: 'Neon', weight: 20.1797, symbol: 'Ne', Day1: 'B', Day2: 'A', Day3: 'C', Day4: 'D', Day5: 'E' }
];
