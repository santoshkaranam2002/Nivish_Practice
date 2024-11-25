import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { countryNameQuery, enterpisegropnameget, enterpisenameQuery,classandsection } from '../../Enterprise/graphql.enterprise';

interface FilterOption {
  selected: boolean;
  option: string;
  id: string | null;
}

@Component({
  selector: 'app-filter-sml',
  templateUrl: './filter-sml.component.html',
  styleUrls: ['./filter-sml.component.scss']
})
export class FilterSmlComponent implements OnInit {
  form: FormGroup;
  showNoResultsMessage: boolean | undefined;
  filterOptions: { 
    category: string; 
    options: FilterOption[]; 
  }[] = [
    { category: 'Country', options: [] },
    { category: 'Enterprise Group', options: [] },
    { category: 'Schools', options: [] },
    { category: 'Class & Sections', options: [] } 
  ];
  classSectionOptions: FilterOption[] = [];
  selectedOptions: { [category: string]: string[] } = {};
  statusOptions = ['All', 'InfoSeek', 'No InfoSeek',];
  showStatusCategory = true;

  showEnterpriseGroups = false;
  classandsectionsfilter = false;
  showSchools = false;
  classessml: any;
  selectedStatus: any;
  filterObject: any;
  classeandsectionget: any;
  EnterpriseName: any;
  selectedSchoolId: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<FilterSmlComponent>, private apollo: Apollo) {
    this.form = this.fb.group({
      'Country': [null],
      'Enterprise Group': [null],
      'Schools': [null],
      'Status': this.fb.group({})
    });
    this.filterObject = {
      countries: [],
      enterpriseGroups: [],
      schools: [],
      classSections: [],
      statuses: [],
      // Add other categories if needed
    };
    
  }

  ngOnInit() {
    this.loadCountries();
    
    
  }

  loadCountries(): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: countryNameQuery
    }).valueChanges.subscribe(({ data, error }) => {
      console.log(data,"country names sml");
      if (error) {
        console.error('Error fetching country names:', error);
        return;
      }
      if (data && data.EnterpriseGroupAllCountry && Array.isArray(data.EnterpriseGroupAllCountry.Country)) {
        this.filterOptions[0].options = data.EnterpriseGroupAllCountry.Country.map((country: string) => ({
          option: country,
          id: null
        }));
        this.initializeForm();
      }
      console.log()
    });
    
  }

  private initializeForm() {
    this.form.patchValue({
      'Country': null,
      'Enterprise Group': null,
      'Schools': null
    });

    const statusGroup = this.form.get('Status') as FormGroup;
    this.statusOptions.forEach(status => {
      statusGroup.addControl(status, new FormControl(false));
    });
  }

 onCountryChange(event: any) {
  const selectedCountryOption = event.value; 
  const selectedCountry = this.filterOptions[0].options.find(country => country.option === selectedCountryOption);
  if (selectedCountry) {
    const countryExists = this.filterObject.countries.some((country:any) => country.id === selectedCountry.id);
      if (!countryExists) {
        this.filterObject.countries.push({
          option: selectedCountry.option,
          id: selectedCountry.id
        });
      }
      console.log('Selected Country:', this.filterObject.countries);
    console.log('Selected Country Name:', selectedCountry.option, 'ID:', selectedCountry.id);
    this.showEnterpriseGroups = true;
    this.loadEnterpriseGroups(selectedCountry.option);
  }
}

  

  loadEnterpriseGroups(country: string): void {
  this.apollo.use('campAdminClient').watchQuery<any>({
    query: enterpisegropnameget,
    variables: { country }
  }).valueChanges.subscribe(({ data, error }) => {
    if (error) {
      console.error('Error fetching enterprise groups:', error);
      return;
    }

    if (data && data.EnterpriseGroup) {
      this.filterOptions[1].options = data.EnterpriseGroup
        .map((item: any) => ({
          option: item.Group_Name,
          id: item.id
        }))
        .sort((a: any, b: any) => a.option.localeCompare(b.option)); // Sort alphabetically
    }
  });
}


  onEnterpriseGroupChange(event: any) {
    const selectedGroup = this.filterOptions[1].options.find(group => group.id === event.value);
    if (selectedGroup) {
      const groupExists = this.filterObject.enterpriseGroups.some((group:any) => group.id === selectedGroup.id);
      if (!groupExists) {
        this.filterObject.enterpriseGroups.push({
          option: selectedGroup.option,
          id: selectedGroup.id
        });
      }
      console.log('Selected Enterprise Group:', this.filterObject.enterpriseGroups,this.filterObject);
      this.showSchools = true;
      this.loadSchools(selectedGroup.id!);
      
      console.log('Selected Enterprise Group:', selectedGroup.option, 'ID:', selectedGroup.id);
    }
  }



  loadSchools(groupId: string): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: enterpisenameQuery,
      variables: { enterprisegroup: parseInt(groupId, 10) }
    }).valueChanges.subscribe(({ data, error }) => {
      if (error) {
        console.error('Error fetching schools:', error);
        return;
      }
  
      if (data && data.EnterpriserDetails) {
        this.filterOptions[2].options = data.EnterpriserDetails
          .map((item: any) => ({
            option: item.Enterprise_Name,
            id: item.id
          }))
          .sort((a: any, b: any) => a.option.localeCompare(b.option)); // Sort alphabetically
        
        this.showStatusCategory = true;
      }
    });
  }
  

  onSchoolChange(event: any) {
    const selectedSchoolId = event.value;
    this.selectedSchoolId = event.value;
    const selectedSchool = this.filterOptions[2].options.find(school => school.id === selectedSchoolId);
    if (selectedSchool) {
      const schoolExists = this.filterObject.schools.some((school: any) => school.id === selectedSchool.id);
      if (!schoolExists) {
        this.filterObject.schools.push({
          option: selectedSchool.option,
          id: selectedSchool.id
        });
      }
      this.classandsectionsfilter = true;
      this.classandsection(selectedSchool.id!);
      console.log('Selected School:', this.filterObject.schools, this.filterObject);
    }
  }

  clearAll() {
    this.form.reset();
    this.initializeForm();
    this.showEnterpriseGroups = false;
    this.showSchools = false;
    this.classandsectionsfilter = false;

  }


  
  private getSelectedStatuses(): string[] {
    const statusGroup = this.form.get('Status') as FormGroup;
    const selectedStatuses = Object.keys(statusGroup.controls)
      .filter(status => statusGroup.get(status)?.value);
    console.log('Selected Statuses:', selectedStatuses); // Debugging
    return selectedStatuses;
  }
  
  
 

  // classandsection(): void {
  //   const classandsectionsml = {
  //     From: "Infoseek_Master",
  //     EnterpriseName:7 ,
  //   };
  //   this.apollo.use('campAdminClient').watchQuery<any>({
  //     query: classandsection,
  //     variables: classandsectionsml,
  //   }).valueChanges.subscribe({
  //     next: ({ data }: any) => {
  //       console.log('GraphQL response data:', data);
  //       if (data && data.InfoseekVerification && data.InfoseekVerification.length > 0) {
  //         const classSections = data.InfoseekVerification[0].class_section || [];
  //         this.classSectionOptions = classSections.map((section: string) => ({
  //           option: section
  //         })) .sort((a: any, b: any) => {
  //           const regex = /(\d+)|(\D+)/g;
  //           const aMatches = a.option.match(regex);
  //           const bMatches = b.option.match(regex);

  //           for (let i = 0; i < Math.min(aMatches.length, bMatches.length); i++) {
  //             const aPart = aMatches[i];
  //             const bPart = bMatches[i];

  //             if (aPart !== bPart) {
  //               if (!isNaN(aPart) && !isNaN(bPart)) {
  //                 return Number(aPart) - Number(bPart);
  //               }
  //               return aPart.localeCompare(bPart);
  //             }
  //           }

  //           return aMatches.length - bMatches.length;
  //         });
  //         console.log('Class & Section options:', this.classSectionOptions);
  //       } else {
  //         console.log('No data received or empty array');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   });
  // }
  // onClassSectionChange(event: any, option: { option: string }): void {
  //   const isChecked = event.checked;
  //   const selectedOption = option.option;
  
  //   if (isChecked) {
  
  //     if (!this.filterObject.classSections.some((section:any) => section.option === selectedOption)) {
  //       this.filterObject.classSections.push({ option: selectedOption });
  //     }
  //   } else {
  
  //     this.filterObject.classSections = this.filterObject.classSections.filter((section:any) => section.option !== selectedOption);
  //   }
  
  //   console.log('Updated Class Sections:', this.filterObject.classSections);
  // }
//   onClassSectionChange(event: any): void {
//   const selectedClassSectionOption = event.value;
//   console.log('Selected Class & Section:', selectedClassSectionOption);

//   const selectedClassSection = this.classSectionOptions.find(section => section.option === selectedClassSectionOption);
//   if (selectedClassSection) {
//     const classSectionExists = this.filterObject.classSections.some((section: any) => section.option === selectedClassSection.option);
//     if (!classSectionExists) {
//       this.filterObject.classSections.push({
//         option: selectedClassSection.option
//       });
//     }

//     console.log('Updated Class Sections:', this.filterObject.classSections);
//   }
// }

classandsection(id:any): void {

  const classandsectionsml = {
    from: "Infoseek_Master",
    enterpriseName:parseInt(this.selectedSchoolId ),
  };
 console.log('entirepriseclass and section get',classandsectionsml);
  this.apollo.use('campAdminClient').watchQuery<any>({
    query: classandsection,
    variables: classandsectionsml,
  }).valueChanges.subscribe({
    next: ({ data }: any) => {
      console.log('GraphQL response data:', data);
      if (data && data.InfoseekVerification && data.InfoseekVerification.length > 0) {
        const classSections = data.InfoseekVerification[0].class_section || [];
        this.classSectionOptions = [
          { option: 'All' }, 
          ...classSections.map((section: string) => ({ option: section })).sort((a: any, b: any) => {
            const regex = /(\d+)|(\D+)/g;
            const aMatches = a.option.match(regex);
            const bMatches = b.option.match(regex);

            for (let i = 0; i < Math.min(aMatches.length, bMatches.length); i++) {
              const aPart = aMatches[i];
              const bPart = bMatches[i];

              if (aPart !== bPart) {
                if (!isNaN(aPart) && !isNaN(bPart)) {
                  return Number(aPart) - Number(bPart);
                }
                return aPart.localeCompare(bPart);
              }
            }

            return aMatches.length - bMatches.length;
          })
        ];
        console.log('Class & Section options:', this.classSectionOptions);
      } else {
        console.log('No data received or empty array');
      }
    },
    error: (error) => {
      console.error('Error fetching data:', error);
    }
  });
}

onClassSectionChange(event: any, option: { option: string }): void {
  const isChecked = event.checked;
  const selectedOption = option.option;

  if (selectedOption === 'All') {

    this.classSectionOptions.forEach(opt => {
      opt.selected = isChecked;
    });

    if (isChecked) {
      this.filterObject.classSections = this.classSectionOptions.map(opt => ({ option: opt.option }));
    } else {
      this.filterObject.classSections = [];
    }
  } else {
    if (isChecked) {
      if (!this.filterObject.classSections.some((section: any) => section.option === selectedOption)) {
        this.filterObject.classSections.push({ option: selectedOption });
      }
      const allSelected = this.classSectionOptions.every(opt => opt.option === 'All' || this.filterObject.classSections.some((sec: { option: string; }) => sec.option === opt.option));
      if (allSelected) {
        const allOption = this.classSectionOptions.find(opt => opt.option === 'All');
        if (allOption) {
          allOption.selected = true;
        }
      }
    } else {
      this.filterObject.classSections = this.filterObject.classSections.filter((section: any) => section.option !== selectedOption);
      const allOption = this.classSectionOptions.find(opt => opt.option === 'All');
      if (allOption) {
        allOption.selected = false;
      }
    }
  }

  console.log('Updated Class Sections:', this.filterObject.classSections);
}

onstatusChange(status: string, isChecked: boolean): void {
  console.log('Checkbox change event:', status, 'Checked:', isChecked);
  if (status === 'All') {
    if (isChecked) {
      this.filterObject.statuses = [...this.statusOptions];
    } else {
      this.filterObject.statuses = [];
    }
    this.statusOptions.forEach(opt => {
      const control = this.form.get('Status')?.get(opt);
      if (control) {
        control.setValue(isChecked);
      }
    });
  } else {
    // Handle individual status selections
    if (isChecked) {
      if (!this.filterObject.statuses.includes(status)) {
        this.filterObject.statuses.push(status);
      }
    } else {
      this.filterObject.statuses = this.filterObject.statuses.filter((existingStatus: string) => existingStatus !== status);
    }
    
    // Check if all statuses are selected
    const allSelected = this.statusOptions.every(opt => this.filterObject.statuses.includes(opt));
    const allOptionControl = this.form.get('Status')?.get('All');
    
    if (allOptionControl) {
      if (allSelected) {
        allOptionControl.setValue(true);
      } else {
        allOptionControl.setValue(false);
      }
    }
  }

  console.log('Updated Statuses:', this.filterObject.statuses);
}




isChecked(category: string, option: string): boolean {
  return this.selectedOptions[category]?.includes(option) || false;
}

toggleSelection(category: string, option: string): void {
  if (!this.selectedOptions[category]) {
    this.selectedOptions[category] = [];
  }

  if (this.isChecked(category, option)) {
    this.selectedOptions[category] = this.selectedOptions[category].filter(opt => opt !== option);
  } else {
    this.selectedOptions[category].push(option);
  }
}

applyFilter() {
  if (this.form.valid) {
    this.dialogRef.close(this.filterObject);
  }
  
}


  
}
