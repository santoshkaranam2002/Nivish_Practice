import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTabGroup } from '@angular/material/tabs';
import { IvinService } from 'src/app/ivin.service';
import { NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  username: any;
  myloginId: any;
  activeTabIndex: NumberInput;
  generatedUrl: string = '';
  urlError: string = '';
  firstName: string = '';
  description: string = '';
  name: any;
  lastname: any;


  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(
    private ivinService: IvinService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Fetch the username, firstName, and description from localStorage/sessionStorage
    this.username = localStorage.getItem('username') || 'Default Name';
    this.firstName = sessionStorage.getItem('firstname') || 'Default Name';
    this.description = sessionStorage.getItem('description') || 'No Description';

    // Get person profile
    this.getPersonProfile();
  }

  // Get person profile
  getPersonProfile() {
    this.myloginId = localStorage.getItem('loginId');
    this.ivinService.getUserProfile(this.myloginId).subscribe((data: any) => {
      if (data && data.Result) {
        this.username = data.Result[0].UserName; // Update the username from API
        this.name = data.Result[0]['Name'],
        this.lastname = data.Result[0]['LastName'],
        this.generateUrl(); // Generate URL after username is set
      }
    });
  }

  // Activate a tab in MatTabGroup
  activateTab(index: number) {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }

  openNewWindow() {
    this.myloginId = localStorage.getItem('loginId');
    if (this.myloginId && this.username) {
      const url = '/publicpage/' + this.myloginId + '_' + this.username;
      window.open(url, '_blank');
    }
  }

  generateUrl() {
    // Ensure that firstName is set correctly
    this.username = sessionStorage.getItem('username');

    // Check if firstName exists
    if (this.username && this.username !== 'Default Name') {
      this.generatedUrl = `pro.ivinstrategies.com/${this.username}`;
      this.urlError = ''; // Clear any previous errors
    } else {
      this.generatedUrl = '';
      this.urlError = 'Please create a username first.';
    }
  }




  
}