import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { enterpisegropnameget, enterpisenameQuery } from '../graphql.enterprise';

interface Filter {
  category: string;
  options: { option: string; id: string }[];
}

@Component({
  selector: 'app-enterprise-name-filter',
  templateUrl: './enterprise-name-filter.component.html',
  styleUrls: ['./enterprise-name-filter.component.scss']
})
export class EnterpriseNameFilterComponent {
  @Output() filterOptionsSelected = new EventEmitter<string[]>();
  selectedFilterOptions: any[];
  displayName = '';
  selectedOptions: { [category: string]: string } = {};
  filterOptions: Filter[] = [
    { category: 'Enterprise Group', options: [] }
  ];
  schoolFilter: Filter = { category: 'School', options: [] };
  showSchoolCategory: boolean = false;
  showStatusCategory: boolean = false;
  statusOptions = ['All', 'Verified', 'Not Verified'];
  groupId: any;
  constructor(
    private dialogRef: MatDialogRef<EnterpriseNameFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apollo: Apollo
  ) {
    this.selectedFilterOptions = data.selectedOptions || [];
  }
  ngOnInit(): void {
    this.displayName = this.data.displayName;
    this.groupnameget();
  }
  applyFilter(): void {
    console.log(this.selectedOptions);
    this.dialogRef.close(this.selectedOptions);
  }
  onRadioChange(category: string, event: any): void {
    const selectedOption = event.value;
    console.log(selectedOption,"selectedOption")
    if (category === 'Status') {
      this.selectedOptions[category] = selectedOption;
    } else {
      this.selectedOptions[category] = selectedOption.option;
    }
    console.log(this.selectedOptions, "selected options");

    if (category === 'Enterprise Group') {
      this.groupId = selectedOption.id;
      this.getEnterpriseName();
      this.showSchoolCategory = true;
    } else if (category === 'School') {
      this.showStatusCategory = true;
    }
  }
  clearAll(): void {
    this.selectedOptions = {};
    this.showSchoolCategory = false;
    this.showStatusCategory = false;
    this.dialogRef.close();
  }
  groupnameget(): void {
    this.apollo.use('campAdminClient').watchQuery({
      query: enterpisegropnameget,
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.EnterpriseGroup) {
        const groupNames = data.EnterpriseGroup
          .map((item: any) => ({ option: item.Group_Name, id: item.id }))
          .sort((a: any, b: any) => a.option.localeCompare(b.option)); // Sort alphabetically
  
        this.filterOptions[0].options = groupNames;
        console.log(this.filterOptions[0].options, "filter");
      }
    });
  }
  
  getEnterpriseName(): void {
    const enterprisename = { enterprisegroup: parseInt(this.groupId) };
    this.apollo.use('campAdminClient').watchQuery({
      query: enterpisenameQuery,
      variables: enterprisename
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.EnterpriserDetails) {
        const enterpriseNames = data.EnterpriserDetails
          .map((item: any) => ({ option: item.Enterprise_Name, id: item.id }))
          .sort((a: any, b: any) => a.option.localeCompare(b.option)); // Sort alphabetically
  
        this.schoolFilter.options = enterpriseNames;
      }
    });
  }
  
}
