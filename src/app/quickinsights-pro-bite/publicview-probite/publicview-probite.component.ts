import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';

import { Apollo } from 'apollo-angular';
import { latestElectionResult } from '../probite.graphql';

@Component({
  selector: 'app-publicview-probite',
  templateUrl: './publicview-probite.component.html',
  styleUrls: ['./publicview-probite.component.scss']
})
export class PublicviewProbiteComponent {
  // lastUpdated: Date = new Date('2024-07-09T11:08:00');
  usertype:any;
  description: any;
  firstname:any;
  latestElectionResult: any;
  aboutfirstname: any;
  aboutpic: any;
  aboutlastname: any;
  aboutyourself: any;
  bannerImageUrl: any;
  myloginId: any;
  bannerid: any;
  createdon: any;
  shareUrl: string = window.location.href; // Dynamically gets the current page URL
 
  constructor(private route: ActivatedRoute,private ivinService:IvinService,private apollo:Apollo){}

  ngOnInit(): void {
    
  }

  getbannerimage(){
    this.myloginId = sessionStorage.getItem('loginid');
    this.ivinService.userbannerget(this.myloginId).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('banner getted',data);
        this.bannerImageUrl = data.Result[0].BannerImage;
        console.log('bannerr gette public page',this.bannerImageUrl);
        this.bannerid = data.Result[0].id
      }
    })
  } 

  copyToClipboard() {
    const urlField = document.getElementById('share-url') as HTMLInputElement;
    urlField.select();
    document.execCommand('copy');
    alert('URL copied to clipboard');
  }
 
}
