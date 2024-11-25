import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IvinService } from 'src/app/ivin.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss']
})
export class RelationComponent {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['Voter_SerialNumber','VoterID', 'Name', 'Dependent', 'House', 'Age', 'Gender'];
  urldata: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private ivinservice:IvinService, 
    private dialogRef: MatDialogRef<RelationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    const relationdata = Array.isArray(data) ? data : [data];

    const relationvalues = relationdata
    .map((value: any) => Object.values(value).map(subValue => subValue === null ? 'null' : subValue))
    .flat();

    this.urldata = relationvalues.join("/");
    this.ivinservice.RelationTableData(this.urldata).subscribe((data:any) => {
      this.dataSource.data = data.Result;
    });
  }
}
