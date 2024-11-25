import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { providerget } from '../provider_graphql';

interface Filter {
  category: string;
  options: { option: string; id?: string }[];
}

@Component({
  selector: 'app-hcp-filter',
  templateUrl: './hcp-filter.component.html',
  styleUrls: ['./hcp-filter.component.scss']
})
export class HcpFilterComponent implements OnInit {
  form!: FormGroup;
  selectedOptions: { [category: string]: any } = {};
  groupId: any;
  statusOptions = ['All', 'Verified', 'Not Verified'];
  filterOptions: Filter[] = [
    { category: 'Category', options: [{ option: 'All' }, { option: 'Dentist' }, { option: 'Doctor' }, { option: 'Optometrist' }, { option: 'Nurse' }, { option: 'Physiotherapist' }, { option: 'Other' }]},
    { category: 'Type', options: [{ option: 'All' }, { option: 'HCP' }, { option: 'Ops' }]},
    { category: 'Provider', options: [] },
    { category: 'Status', options: [{ option: 'All' }, { option: 'Verified' }, { option: 'Not Verified' }]}
  ];
  showStatusCategory: boolean = false;
  providername: any;
  providerid: any;
  providers: any;
  hcpmasernmae: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HcpFilterComponent>,
    private apollo: Apollo
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.hcpmasterlistfilter();
  }

  createForm(): void {
    const formGroupConfig = this.filterOptions.reduce((acc: any, filterOption) => {
      acc[filterOption.category] = this.fb.array(
        filterOption.options.map(() => this.fb.control(false))
      );
      return acc;
    }, {});

    formGroupConfig['Status'] = this.fb.array(this.statusOptions.map(() => this.fb.control(false)));

    this.form = this.fb.group(formGroupConfig);
  }

  applyFilter(): void {
    if (this.form.valid) {
      const selectedFilters: { [key: string]: any } = {};
      Object.keys(this.form.controls).forEach(category => {
        selectedFilters[category] = this.form.get(category)?.value
          .map((checked: boolean, i: number) => (checked ? this.filterOptions.find(f => f.category === category)?.options[i] : null))
          .filter((v: any) => v !== null);
      });
  
      const selectedCategories = this.form.value.Category
        .map((selected: boolean, index: number) => selected ? this.filterOptions.find(f => f.category === 'Category')?.options[index] : null)
        .filter((value: any) => value !== null);
  
      const selectedTypes = this.form.value.Type
        .map((selected: boolean, index: number) => selected ? this.filterOptions.find(f => f.category === 'Type')?.options[index] : null)
        .filter((value: any) => value !== null);
  
      const selectedProviders = this.form.value.Provider
        .map((selected: boolean, index: number) => selected ? this.filterOptions.find(f => f.category === 'Provider')?.options[index] : null)
        .filter((value: any) => value !== null);
  
      const selectedStatus = this.form.value.Status
        .map((selected: boolean, index: number) => selected ? this.statusOptions[index] : null)
        .filter((value: any) => value !== null);
  
      const selectedNames = {
        categories: (selectedCategories as { option: string }[]).map(option => option.option),
        types: (selectedTypes as { option: string }[]).map(option => option.option),
        providers: (selectedProviders as { option: string, id?: string }[]).map(option => ({
          name: option.option,
          id: option.id
        })),
        status: selectedStatus
      };
  
      this.dialogRef.close(selectedNames);
    }
  }
  
  

  clearAll(): void {
    this.form.reset();
  }

  hcpmasterlistfilter(): void {
    this.apollo.use('campAdminClient').watchQuery({
      query: providerget,
      fetchPolicy: 'network-only', // Adjust fetch policy as needed
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.ProviderData) {
        console.log('Filtered Events', data.ProviderData);
        this.hcpmasernmae = data.ProviderData.map((item: any) => ({
          option: item.Name,
          id: item.ProviderID
        })).sort((a: { option: string; id: string }, b: { option: string; id: string }) => 
          a.option.localeCompare(b.option)
        );
        console.log('this.enterprisesnames', this.hcpmasernmae);
        this.updateSchoolsOptions();
      } else {
        console.log('No data found.');
      }
    });
  }

  private updateSchoolsOptions() {
    const providerOptions = this.filterOptions.find(option => option.category === 'Provider');
    if (providerOptions) {
      providerOptions.options = [{ option: 'All' }, ...this.hcpmasernmae.map((item: { option: any; id: any; }) => ({ option: item.option, id: item.id }))];
      const controlArray = new FormArray(
        providerOptions.options.map(() => new FormControl(false))
      );
      this.form.setControl('Provider', controlArray);
    }
  }

  // onCheckboxChange(event: any, category: string, index: number): void {
  //   const formArray: FormArray = this.form.get(category) as FormArray;
  //   formArray.at(index).setValue(event.checked);
  // }
  onCheckboxChange(event: any, category: string, index: number): void {
    const formArray: FormArray = this.form.get(category) as FormArray;
    if (index === 0) { 
      const isChecked = event.checked;
      formArray.controls.forEach((control, i) => {
        if (i !== 0) {
          control.setValue(isChecked);
        }
      });
    } else {
      const allCheckbox = formArray.at(0); 
      const areAllChecked = formArray.controls.slice(1).every(control => control.value);
      allCheckbox.setValue(areAllChecked);
    }
  }
}
