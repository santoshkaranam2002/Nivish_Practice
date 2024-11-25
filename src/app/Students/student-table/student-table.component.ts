import { Component,Input,TemplateRef, ViewChild  } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentTable } from './studenttable';
import { TableColumn } from '../../uicomponents/table/TableColumn';
import { Sort } from '@angular/material/sort';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { SuperadminService } from '../../superadmin.service';
import { AlertpopupComponent } from '../../uicomponents/alertpopup/alertpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TempuinGeneratorComponent } from '../tempuin-generator/tempuin-generator.component';
import { Router } from '@angular/router';

import { FilterSmlComponent } from '../filter-sml/filter-sml.component';

interface Category {
  name: string;
  options: Option[];
}

interface Option {
  id: any;
  name: string;
}
@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss',
  providers: [CurrencyPipe, DecimalPipe, PercentPipe]
})
export class StudentTableComponent {
  @ViewChild('campadminpopup', { static: true })
  campadminpopup!: TemplateRef<any>;
  orders: StudentTable[] = [];
  ordersTableColumns: TableColumn[] = [];
  enterpriseGroupId: any;
  enterpriseNameId: any;
  countryNameId: any;

  studentId: any;
  categories: Category[] = [
    { name: 'Category 1', options: [{ id: 1, name: 'Verified' }, { id: 2, name: 'Not Verified' }] },
    { name: 'Category 2', options: [{ id: 1, name: 'Verified' }, { id: 2, name: 'Not Verified' }]  },
    { name: 'Category 3', options: [] }
  ];
  Country: any;
  Schools: any;
  Status: any;
  Enterprisegroup: any;
  classandsection: any;
  constructor(private dialog:MatDialog,private superAdmin:SuperadminService,private snackbar:MatSnackBar,private router:Router){
  }
  ngOnInit(): void {
    this.enterpriseGroupId=sessionStorage.getItem("enterpriseGroupId");
    this.enterpriseNameId=sessionStorage.getItem("enetrpriseNameId");
    this.countryNameId==sessionStorage.getItem("countryNameId");
    this.initializeColumns();
    this.studentMasterlist();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      data: { id: null },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.studentMasterlist();
    });
  }
  editDialog(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      data: { id: this.studentId },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.studentMasterlist();
    });
  }
  sortData(sortParameters: Sort) {
    const keyName: keyof StudentTable = sortParameters.active as keyof StudentTable;
    this.orders = this.orders.sort((a: StudentTable, b: StudentTable) =>
      sortParameters.direction === 'asc'
        ? String(a[keyName]).localeCompare(String(b[keyName]))
        : String(b[keyName]).localeCompare(String(a[keyName]))
    );
  }

  initializeColumns(): void {
    this.ordersTableColumns = [
      { name: 'S #', dataKey: 'sno', position: 'left', isSortable: false,displayAsIcon: false ,},
      { name: 'UIN', dataKey: 'uin', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Name', dataKey: 'amount', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Class', dataKey: 'price', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Section', dataKey: 'section', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Roll #', dataKey: 'roll', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Reg #', dataKey: 'description', position: 'left', isSortable: false,displayAsIcon: false,},
      { name: 'Status', dataKey: 'stuts', position: 'left', isSortable: false,displayAsIcon: false, },
      { name: 'Actions', dataKey: 'actions', position: 'left', isSortable: true, displayAsIcon: true, customOptions: [
        { label: 'Edit', icon: 'edit', action: this.editOrder },
        { label: 'Delete', icon: 'delete', action: this.deleteOrder }
      ]
    },
    ];
  }

  editOrder(rowData: any): void {
    this.openDialog();
    console.log('Editing order:', rowData);
  }

  deleteOrder(rowData: any): void {

    console.log('Deleting order:', rowData);
  }
  handleRowAction(event: any) {
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
    this.studentId = event.element.id;
    
    if (event.option === 'Delete') {
      const dialogRef = this.dialog.open(AlertpopupComponent, {
        data: {
          title: "Alert",
          message: "Are you sure want to Delete?",
          buttonLabel: "Delete"
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  
      dialogRef.componentInstance.buttonClickFunction = () => {   
        this.snackbar.open('Student Delete Coming Soon', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        dialogRef.close();
      };
    } else if (event.option === 'Generate Temporary UIN') {
      const dialogRef = this.dialog.open(TempuinGeneratorComponent,{
        data: {
          title: "Consent",
          buttonLabel: "Delete",
          details:event.element,
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.studentMasterlist();
      });
    } else if (event.option === 'Edit') {
      this.editDialog();
    }
  
    console.log('Clicked:', event.option, 'with icon:', event.icon, 'for element:', event.element);
  }

  
  toggleFilterPopup(): void {
    const dialogRef = this.dialog.open(FilterSmlComponent, {});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Filter Results:', result);
  
        this.Country = result.countries || [];
        this.Enterprisegroup = result.enterpriseGroups || [];
        this.Schools = result.schools || [];
        this.Status = result.statuses || [];
        this.classandsection = result.classSections || [];
  
        // Check if Enterprisegroup and Schools have elements before accessing the first element
        if (this.Enterprisegroup.length > 0) {
          this.enterpriseGroupId = this.Enterprisegroup[0].id;
          console.log(this.enterpriseGroupId, "enterpriseGroupId");
        } else {
          console.warn('No enterprise groups available');
        }
  
        if (this.Schools.length > 0) {
          this.enterpriseNameId = this.Schools[0].id;
          console.log(this.enterpriseNameId, "enterpriseNameId");
        } else {
          console.warn('No schools available');
        }
  
        this.studentMasterlist();
      } else {
        console.log('No filter options selected');
      }
    });
  }
  
  // toggleFilterPopup(): void {
  //   const dialogRef = this.dialog.open(FilterSmlComponent, {});
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log('Filter Results:', result);
  //       this.Country = result.countries;
  //       this.Enterprisegroup = result.enterpriseGroups;
  //       this.enterpriseGroupId = this.Enterprisegroup[0].id;
  //       console.log(this.enterpriseGroupId,"enterpriseGroupId")
  //       this.Schools = result.schools;
  //       this.enterpriseNameId=  this.Schools[0].id;
  //       console.log(this.enterpriseNameId,"enterpriseNameId")
  //       this.Status = result.statuses;
  //       this.classandsection = result.classSections;
  //       this.studentMasterlist();
  //     } else {
  //       console.log('No filter options selected');
  //     }
  //   });
  // }

  removeOption(index: number, type: string): void {
    if (type === 'Status') {
      const optionsArray = this.Status;
      if (optionsArray[index] === 'All') {
        this.Status = null; 
      } else {
        optionsArray.splice(index, 1);
        this.Status = optionsArray || null;
      }
    } else if (type === 'Enterprisegroup') {
      const optionsArray = this.Enterprisegroup;
      if (optionsArray[index] === 'All') {
        this.Enterprisegroup = null; 
      } else {
        optionsArray.splice(index, 1);
        this.Enterprisegroup = optionsArray || null;
      }
    } else if (type === 'Schools') {
      const optionsArray = this.Schools;
      if (optionsArray[index] === 'All') {
        this.Schools = null; 
      } else {
        optionsArray.splice(index, 1);
        this.Schools = optionsArray || null;
      }
    } else if (type === 'Country') {
      const optionsArray = this.Country;
      if (optionsArray[index] === 'All') {
        this.Country = null; 
      } else {
        optionsArray.splice(index, 1);
        this.Country = optionsArray || null;
      }
    }
    else if (type === 'classandsection') {
      const optionsArray = this.classandsection;
      if (optionsArray[index] === 'All') {
        this.classandsection = null; 
      } else {
        optionsArray.splice(index, 1);
        this.classandsection = optionsArray || null;
      }
    }
 this.studentMasterlist();
  }
  
  
  
  studentMasterlist() {
    const statusMapping: { [key: string]: string } = {
      'InfoSeek': 'Infoseek',
      'No InfoSeek': 'No InfoSeek',
    };
  
    // Array of all possible status values
    const allPossibleStatuses = ['All', 'InfoSeek', 'No InfoSeek'];
  
    // Check if Status includes all possible statuses
    const containsAllStatuses = allPossibleStatuses.every(status => this.Status?.includes(status));
  
    // Map the Status values according to the defined mapping if not all statuses
    const mappedStatus = containsAllStatuses ? null : this.Status?.map((status: string) => statusMapping[status] || status);
    const classAndSection = this.classandsection?.some((cs: { option: string }) => cs.option === 'All')
    ? null
    : this.classandsection?.map((p: { option: string }) => p.option).join(',');
    const masterlist = {
      Enterprise_Group: this.enterpriseGroupId,
      //  ClassAndSection: this.classandsection && this.classandsection.length && this.classandsection.some((cs: { option: string }) => cs.option === 'All') ? null : this.classandsection && this.classandsection.map((p: { option: string }) => p.option).join(','),
      // ClassAndSection: this.classandsection?.length ? this.classandsection.map((p: { option: string }) => p.option).join(',') : null,
      ClassAndSection: classAndSection,
      Enterprise_Name: this.enterpriseNameId,
      Provider: this.Country?.length ? this.Country.map((p: { id: string }) => p.id).join(',') : null,
      Infoseek_Status:  containsAllStatuses ? null : mappedStatus?.length ? mappedStatus.join(',') : null,
    };
    console.log(masterlist, "masterobj");
  
    this.superAdmin.getStudentMaster(masterlist).subscribe(
      (data: any) => {
        console.log(data, "studentmaster");
  
        this.orders = data.Result.reverse().map((item: any, index: any) => {
          const description = item.Student_Admission_Code || '--';
          const amount = item.Student_First_Name || '--';
          const price = item.Student_Class || '--';
          const section = item.Student_Section || '--';
          // const stuts = item.Infoseek_Status || '--';
          const stuts = item.Infoseek_Status.toLowerCase() === 'infoseek' ? 'InfoSeek' : item.Infoseek_Status.toLowerCase() === 'no infoseek' ? 'No InfoSeek' : (item.Infoseek_Status || '--');
          const roll = item.Student_Roll_Number || '--';
          const motherFullName = item.Mothers_First_Name || '--';
          const dob = item.Date_of_Birth || '--';
          const email = item.Parent_Email || '--';
          const Uin = item.UIN || '--';
          const infoseekId = item.InfoseekId;
          const actions = [
            ...(stuts !== 'Infoseek' ? [{ label: 'Generate Temporary UIN', icon: '', }] : []),
            { label: 'Edit', icon: '', action: this.editOrder.bind(this, item) },
            { label: 'Delete', icon: '', action: this.deleteOrder.bind(this, item) }
          ];
  
          return {
            sno: index + 1,
            description,
            amount,
            price,
            section,
            roll,
            stuts,
            id: item.id,
            uin: Uin,
            dob,
            Email: email,
            infoseekId,
            mothersfullName: motherFullName,
            actions
          };
        });
  
        console.log(this.orders, "tabledata");
      },
      (error: any) => {
        console.error('Error fetching student master list:', error);
      }
    );
  }
  
  
  


  onRowClicked(rowData: any) {
    console.log(rowData, "rowData");
    
    const sanitizedData = this.sanitizeData(rowData);
    this.router.navigate(['/studentdetails'], { state: { data: sanitizedData } });
  }
  
  sanitizeData(data: any): any {
    // Create a new object with only serializable properties
    return {
      sno: data.sno,
      description: data.description,
      id: data.id,
      uin: data.uin,
      mothersfullName: data.mothersfullName,
      Email: data.Email,
      stuts: data.stuts,
      section: data.section,
      price: data.price,
      infoseekId:data.infoseekId,
      amount: data.amount,
      dob: data.dob,
      actions: data.actions.map((action: any) => ({
        label: action.label,
        icon: action.icon,
        // Remove function or complex object here
        // Assuming action is a string or other serializable value
      }))
    };
  }
  filter(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
        top: '1000px',
        right: '60px'
    };
    dialogConfig.width = '50%';
    dialogConfig.height = '50%'; 

    const dialogRef = this.dialog.open(this.campadminpopup, dialogConfig);
  }
 

  onSelectionChanged(event: { category: string, option: Option }) {
    const categoryIndex = this.categories.findIndex(cat => cat.name === event.category);

    if (categoryIndex !== -1 && categoryIndex < this.categories.length - 1) {
      this.fetchNextCategoryOptions(categoryIndex + 1, event.option.id);
    }
  }
  fetchNextCategoryOptions(categoryIndex: number, selectedOptionId: string) {
    // this.http.get<Option[]>(`api/options?category=${categoryIndex}&optionId=${selectedOptionId}`).subscribe(options => {
    //   this.categories[categoryIndex].options = options;
    // });
  }

 
}