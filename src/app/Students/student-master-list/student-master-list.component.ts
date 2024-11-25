import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { countryNameQuery, enterpisegropnameget,  enterpisenameQuery } from '../../Enterprise/graphql.enterprise';

import { MatDialog } from '@angular/material/dialog';
import { FilterSmlComponent } from '../filter-sml/filter-sml.component';
interface Filter {
  category: string;
  options: { option: string; id: string }[];
}
interface TimelineEvent {
  title: string;
  active: boolean;
}

@Component({
  selector: 'app-student-master-list',
  templateUrl: './student-master-list.component.html',
  styleUrl: './student-master-list.component.scss'
})
export class StudentMasterListComponent {
  
  displayName='Country';
  timelineSteps = [
    { title: 'Country', active: this.displayName === 'Country' },
    { title: 'Enterprise Groups', active: this.displayName === 'Enterprise Groups' },
    { title: 'Schools', active: this.displayName === 'Schools' }
  ];


  
  radioEGroup: string='';
  radioOptions: string='';
  filterOptions: Filter[] = [
    { category: 'Enterprise Group', options: [] },
    { category: 'School', options: [] }
  ];
  groupSearchQuery: string = '';
filteredGroupNames: any[] = [];

  selectedEnterprise: string = '';
  selectedOptionId: any;
  groupId: any;
  nameId: any;
  groupNames: { option: string, id: string }[] = [];
  enterpriseNames: { option: string, id: string }[] = [];
  enterpriseGroupId: any;
  countryNames: { option: string, id: string }[] = []; 
  countryNameId: any;
  spinnerLoading=true;
  filteredEnterpriseNames: { option: string; id: string }[] = [];
  searchQuery: string = '';
  schoolSearchQuery: string = ''
  // componentColor:string='#fff';
  // nextColor:string='primary';
  constructor(private routes:Router,private apollo:Apollo,private dialog:MatDialog){

  }
  ngOnInit(){
    this.getEnterpriseName
    this.radioOptions = 'United Arab Emirates';
    this.groupnameget();
    this.getCountryName();

  }
  updateDisplay(name: string) {
    this.displayName = name;
    this.updateTimeline();
  }

  updateTimeline() {
    this.timelineSteps = this.timelineSteps.map(step => ({
      ...step,
      active: step.title.trim().toLowerCase() === this.displayName.trim().toLowerCase()
    }));
  }
  onBreadcrumbClick(event: { label: string; url?: string }) {
    this.displayName = event.label;
    console.log(this.displayName, "bread");

    if (event.url) {
      this.routes.navigate([event.url]);
    }
  }
  groupnameget(): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: enterpisegropnameget
    }).valueChanges.subscribe(({ data, loading, error }) => {
      if (error) {
        console.error('Error fetching group names:', error);
        return;
      }
      if (loading) {
        return;
      }
      if (data && data.EnterpriseGroup) {
        this.groupNames = data.EnterpriseGroup
          .map((item: any) => ({
            option: item.Group_Name,
            id: item.id
          }))
          .sort((a: any, b: any) => a.option.localeCompare(b.option)); // Sort alphabetically initially
  
        // Initialize filteredGroupNames to display all initially
        this.filteredGroupNames = [...this.groupNames];
        console.log(this.groupNames, "groupNames");
      }
    });
  }
  
  
  filterGroupNames() {
    const query = this.groupSearchQuery.trim().toLowerCase();
    console.log('Group search query:', query); 
  
    if (query) {
      
      this.filteredGroupNames = this.groupNames.filter((group) => {
        const groupName = group.option.toLowerCase();
        const isMatch = groupName.includes(query);
        console.log(`Checking if "${groupName}" includes "${query}":`, isMatch); // Log each comparison
        return isMatch; // Only return matches
      });
  
      // Sort the filtered results alphabetically
      this.filteredGroupNames.sort((a, b) => a.option.localeCompare(b.option));
      console.log('Filtered and sorted group names:', this.filteredGroupNames); // Log the filtered and sorted results
    } else {
      // If the search query is empty, show all group names
      this.filteredGroupNames = [...this.groupNames]; // Reset to full list if query is empty
    }
  }
  

  filterSchoolNames() {
    const query = this.schoolSearchQuery.trim().toLowerCase();
    console.log('School search query:', query); 
    
    if (query) {
      // Filter and sort the matching results
      this.filteredEnterpriseNames = this.groupNames
        .filter((group) => group.option.toLowerCase().includes(query))
        .sort((a, b) => a.option.localeCompare(b.option));
  
      console.log('Filtered and sorted school names:', this.filteredEnterpriseNames);
    } else {
      // Show all group names when the search query is empty
      this.filteredEnterpriseNames = [...this.groupNames];
    }
  }
  getEnterpriseName() {
    const enterpisename = { enterprisegroup: parseInt(this.enterpriseGroupId) };
    this.apollo
      .use('campAdminClient')
      .watchQuery({
        query: enterpisenameQuery,
        variables: enterpisename,
      })
      .valueChanges.subscribe(({ data }: any) => {
        if (data && data.EnterpriserDetails) {
          this.enterpriseNames = data.EnterpriserDetails.map((item: any) => ({
            option: item.Enterprise_Name,
            id: Number(item.id),
          }));
          this.filteredEnterpriseNames = [...this.enterpriseNames]; // Ensure initial data is loaded
          console.log("Loaded enterprise names:", this.enterpriseNames); // Log to check values
        }
      });
  }

  filterEnterprises() {
    const query = this.searchQuery.trim().toLowerCase();
    console.log('Search query:', query); // Log normalized search query
    console.log('Enterprise names:', this.enterpriseNames); // Log the data to ensure it's populated
  
    if (query) {
      this.filteredEnterpriseNames = this.enterpriseNames.filter((enterprise) => {
        const enterpriseName = enterprise.option.toLowerCase(); // Convert option to lowercase
        const isMatch = enterpriseName.includes(query);
        console.log(`Checking if "${enterpriseName}" includes "${query}":`, isMatch); // Log each comparison
        return isMatch;
      });
      console.log('Filtered enterprise names:', this.filteredEnterpriseNames); // Log the filtered results
    } else {
      this.filteredEnterpriseNames = [...this.enterpriseNames]; // Reset to full list if query is empty
    }
  }
  

  getCountryName(): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: countryNameQuery
    }).valueChanges.subscribe(({ data, loading, error }) => {
      console.log(data,"country names");
      if (error) {
        console.error('Error fetching country names:', error);
        return;
      }
      
      if (loading) {
        
        return;
      }

      if (data && data.EnterpriseGroupAllCountry) {
        
        const countryData = data.EnterpriseGroupAllCountry;
        if (data && data.EnterpriseGroupAllCountry && Array.isArray(data.EnterpriseGroupAllCountry.Country)) {
          this.countryNames = data.EnterpriseGroupAllCountry.Country.map((country: string) => ({
            option: country,
            id: null 
          })) .sort((a: any, b: any) => a.option.localeCompare(b.option));
          this.spinnerLoading=false;
          console.log(this.countryNames, "country");
        } else {
          console.error('Country data is not in the expected format:', data);
        }
      }
    });
  }

  onRadioButtonChange(event: any): void {
    
    console.log('Selected radio option:', event.value);
    this.countryNameId = event.value;
  }

  onEnterpriseSelectionChange() {
    
    console.log('Selected enterprise changed.',this.selectedEnterprise);
  }


  onSubmitRadioGroup() { 
    console.log("onSubmitRadioGroup()");
    console.log("radios=" + this.radioOptions);
  
  }
  onRadioButtonChangeEgroup(event: { source: { id: string; }; value: string; }){
    console.log("onRadioButtonChangeEgroup()");
    console.log("event.source=" + event.source.id);
    console.log("event.value=" + event.value);
    this.enterpriseGroupId= event.value
    
    console.log( this.enterpriseGroupId,"name");
  }
 
  epGroup() {
    this.updateDisplay('Enterprise Groups');
  }

  entireprisename(){
    this.updateDisplay('Country');
  }
  epName(){
  }
  studentTable(){
    this.displayName='stTable';

  }
  egroupSubmit(){
    if(this.enterpriseGroupId){
      this.updateDisplay('Schools');
      this.getEnterpriseName();
    }
  }
  enameSubmit(){
    if(this.selectedEnterprise){
      sessionStorage.setItem("enterpriseGroupId",this.enterpriseGroupId);
      sessionStorage.setItem("enetrpriseNameId",this.selectedEnterprise);
      sessionStorage.setItem("countryNameId",this.countryNameId);
      this.displayName='stTable';
    }
  }

  breadcrumbs = [
    { label: 'Login', url: '/' },
    { label: 'Student Master List', url: '/StudnetMasterLIst' },
  ]
 
}
