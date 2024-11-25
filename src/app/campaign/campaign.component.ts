import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IvinService } from '../ivin.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})

export class CampaignComponent {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['Sno','Communicationname', 'Status', 'Audienceincluded', 'option'];
  @Input() index = 1;
  overAllData= 100000;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  editid: any;
  copyid: any;
  ViewAllStatus: string = 'ViewAll';

  constructor(private ivinservice:IvinService, private router: Router){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.TableData();
  }

  ViewAllFilter() {
    this.TableData();
  }

  TableData() {
    this.ivinservice.TableGet(this.index, this.overAllData).subscribe(
      (data: any) => {
        if (data && data.Result) {
          this.dataSource.data = data.Result.filter((item: any) => {
            if (this.ViewAllStatus === 'SendNow') {
              return item.Status === 'SendNow';
            } else if (this.ViewAllStatus === 'SaveAsDraft') {
              return item.Status === 'SaveAsDraft';
            } else {
              return true;
            }
          });
          console.log('Table Data', this.dataSource.data);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  ReloadPage() {
    window.location.reload();
  }

  // Navigate to another component without id
  onclickCreate(){
    sessionStorage.removeItem('communicationeditId');
    sessionStorage.removeItem('communicationCopyId');
    this.router.navigate(['/campaignsearch']);
  }

  // Navigate to another component with id
  EditView(element:any) {
    this.editid = element.id;
    sessionStorage.setItem('communicationeditId', this.editid);
    sessionStorage.removeItem('communicationCopyId');
    this.router.navigate(['/campaignsearch']);
  }

  // Navigate to another component with id
  CopyEdit(element:any) {
    this.copyid = element.id;
    sessionStorage.setItem('communicationCopyId', this.copyid);
    sessionStorage.removeItem('communicationeditId');
    this.router.navigate(['/campaignsearch']);
  }
}
