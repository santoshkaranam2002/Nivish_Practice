import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-morebuttoncharts',
  templateUrl: './morebuttoncharts.component.html',
  styleUrls: ['./morebuttoncharts.component.scss']
})
export class MorebuttonchartsComponent {
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

 constructor(
  private route: ActivatedRoute,
  private ivinService:IvinService,
  private apollo:Apollo, 
  private router: Router
){}

 ngOnInit(): void {
   this.getbannerimage();
   // this.screenWidth = window.innerWidth;
   this.usertype = sessionStorage.getItem('usertype');
   console.log('nav usertype',this.usertype);
   this.firstname = sessionStorage.getItem('firstname');
   this.description = sessionStorage.getItem('description');
   console.log('first name',this.firstname)
   console.log('description',this.description)
   this.aboutfirstname = sessionStorage.getItem('aboutfirstname');
   this.aboutpic = sessionStorage.getItem('aboutpic');
   this.aboutlastname = sessionStorage.getItem('aboutlastname');
   this.aboutyourself = sessionStorage.getItem('shortdescription');
   this.createdon = sessionStorage.getItem('updatedOn');
 }
 

 goBack() {
  window.history.back(); // Navigates to the home page or previous page
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
