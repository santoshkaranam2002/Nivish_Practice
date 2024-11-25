import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as graphql from '../graphql.events';
import { SuperadminService } from '../../superadmin.service';


interface Option {
  id: any;
  option: string;
  selected?: boolean;
}


@Component({
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.scss']
})
export class EventsFilterComponent implements OnInit {
  form: FormGroup;
  enterprisesnames: Option[] = [];
  filterOptions = [
    {
      category: 'Country',
      options: [{ option: 'All' }, { option: 'UAE' }, { option: 'India' }]
    },
    {
      category: 'Schools',
      options: [] as Option[]
    }
  ];
  statusOptions = ['All', 'Not Scheduled', 'Scheduled'];
  showStatusCategory = true;


  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private dialogRef: MatDialogRef<EventsFilterComponent>,
    private SuperadminService: SuperadminService
  ) {
    this.form = this.fb.group({});
  }


  ngOnInit() {
    this.initializeForm();
    this.loadSelectedOptions();
    this.eventsfilter();
  }


  private initializeForm() {
    this.filterOptions.forEach(filterOption => {
      const controlArray = new FormArray(
        filterOption.options.map(() => new FormControl(false))
      );
      this.form.addControl(filterOption.category, controlArray);
    });


    if (this.showStatusCategory) {
      const statusControlArray = new FormArray(
        this.statusOptions.map(() => new FormControl(false))
      );
      this.form.addControl('Status', statusControlArray);
    }
  }


  onCheckboxChange(event: any, category: string, index: number) {
    const formArray = this.form.get(category) as FormArray;
    const allOptionIndex = 0;


    if (index === allOptionIndex) {
      formArray.controls.forEach((control) => control.setValue(event.checked));
    } else {
      const allChecked = formArray.controls.slice(1).every((control) => control.value);
      formArray.at(allOptionIndex).setValue(allChecked);
      if (!event.checked) {
        formArray.at(allOptionIndex).setValue(false);
      }
    }


    this.updateSelectedOptions(category);
  }


  private updateSelectedOptions(category: string) {
    const formArray = this.form.get(category) as FormArray;
    const selectedOptions = formArray.value
      .map((selected: boolean, index: number) => selected ? this.filterOptions.find(option => option.category === category)?.options[index].option : null)
      .filter((value: any) => value !== null);


    // Handle 'All' option
    const filterOption = this.filterOptions.find(option => option.category === category);
    if (filterOption) {
      if (selectedOptions.includes('All')) {
        this.SuperadminService.setSelectedOptions(category, ['All']);
      } else {
        this.SuperadminService.setSelectedOptions(category, selectedOptions);
      }
    }
  }


  clearAll() {
    this.form.reset();
    this.SuperadminService.clearSelectedOptions();
  }


  applyFilter() {
    if (this.form.valid) {
      const selectedCountries = this.form.value.Country
        .map((selected: boolean, index: number) => selected ? this.filterOptions[0].options[index] : null)
        .filter((value: any) => value !== null);


      const selectedSchools = this.form.value.Schools
        .map((selected: boolean, index: number) => selected ? this.filterOptions[1].options[index] : null)
        .filter((value: any) => value !== null);


      const selectedStatus = this.form.value.Status
        .map((selected: boolean, index: number) => selected ? this.statusOptions[index] : null)
        .filter((value: any) => value !== null);


      const selectedNames = {
        countries: selectedCountries.map((option:any) => option.option),
        schools: selectedSchools.map((option:any)  => ({
          name: option.option,
          id: option.id
        })),
        status: selectedStatus
      };


      this.SuperadminService.setSelectedOptions('Country', selectedCountries.map((option:any)  => option.option));
      this.SuperadminService.setSelectedOptions('Schools', selectedSchools.map((option:any)  => option.option));
      this.SuperadminService.setSelectedOptions('Status', selectedStatus);


      this.dialogRef.close(selectedNames);
    }
  }


  eventsfilter(): void {
    const getallevents = {
      Enterprise: null,
      sechudle: null
    };
    this.apollo.use('superAdminevents').watchQuery({
      query: graphql.alleventsget,
      variables: getallevents,
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.healthcampDetails) {
        const mappedData = data.healthcampDetails.map((item: any) => ({
          option: item.Enterprise_Name,
          id: item.EnterpriseName
        }));
        this.enterprisesnames = mappedData.sort((a: { option: string }, b: { option: string }) => {
          if (!a.option) return 1; 
          if (!b.option) return -1;
          return a.option.localeCompare(b.option);
        });
        this.updateSchoolsOptions();
      } else {
        console.log('No data found.');
      }
    });
  }


  private updateSchoolsOptions() {
    const schoolsOptions = this.filterOptions.find(option => option.category === 'Schools');
    if (schoolsOptions) {
      schoolsOptions.options = [{ option: 'All' }, ...this.enterprisesnames.map(item => ({ option: item.option, id: item.id }))];
      const controlArray = new FormArray(
        schoolsOptions.options.map(() => new FormControl(false))
      );
      this.form.setControl('Schools', controlArray);
    }
  }


  private loadSelectedOptions() {
    const storedOptions = this.SuperadminService.getSelectedOptions();
    if (storedOptions) {
      Object.keys(storedOptions).forEach(category => {
        const formArray = this.form.get(category) as FormArray;
        if (formArray) {
          storedOptions[category].forEach(option => {
            const index = this.filterOptions.find(filter => filter.category === category)?.options.findIndex(opt => opt.option === option);
            if (index !== undefined && index >= 0) {
              formArray.at(index).setValue(true);
            }
          });
          if (category === 'Status') {
            const allSelected = storedOptions[category].includes('All');
            formArray.controls.forEach((control, i) => {
              control.setValue(allSelected || storedOptions[category].includes(this.statusOptions[i]));
            });
          }
        }
      });
    }
  }
}
