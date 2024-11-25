import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTabGroup } from '@angular/material/tabs';
import { IvinService } from 'src/app/ivin.service';
import { NumberInput } from '@angular/cdk/coercion';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
@Injectable()
export class ProfileComponent implements OnInit {
  username: any;
  myloginId: any;
  activeTabIndex: NumberInput;
  generatedUrl: string = '';
  urlError: string = '';
  firstName: string = '';
  description: string = '';
  name: any;
  lastname: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 3;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  clickedid: any;
  aboutdata: any;
  firstname: any;
  digitalSignImageUrl: any;
  Upload_Your_Sign: any;
  fileTypeError: boolean=false;
  errorMessage: any;
  bannerfile: any;
  selectedImage: string = 'assets/images/profile/banner.jpg';
  bannerImageUrl:any;
  bannerid: any;


  constructor(
    private ivinService: IvinService,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Fetch the username, firstName, and description from localStorage/sessionStorage
    this.username = localStorage.getItem('username') || 'Default Name';
    this.firstName = sessionStorage.getItem('firstname') || 'Default Name';
    this.description = sessionStorage.getItem('description') || 'No Description';

    // Get person profile
    this.getpersonprofile();
    this.getbannerimage();
  }



  // Activate a tab in MatTabGroup
  activateTab(index: number) {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }

  // openNewWindow() {
  //   this.myloginId = localStorage.getItem('loginId');
  //   if (this.myloginId && this.username) {
  //     const url = '/publicpage/' + this.myloginId + '_' + this.username;
  //     window.open(url, '_blank');
  //   }
  // }

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


  getpersonprofile() {
    // Retrieve the clicked ID from session storage
    this.clickedid = sessionStorage.getItem('clickedid');
    console.log('clicked@@@', this.clickedid);
  
    if (this.clickedid) {
      this.ivinService.portfolioaboutget(this.clickedid).subscribe((data: any) => {
        if (data && data.Result) {
          this.aboutdata = data.Result;
          console.log('aboutdata', this.aboutdata);
          this.digitalSignImageUrl = data.Result[0]['ProfilePicture'];
          this.firstname = data.Result[0]['FirstName'];
          this.lastname = data.Result[0]['LastName'];
        }
      });
    } else {
      console.error('No clicked ID found in session storage');
    }
  }


  openNewWindow() {
    this.username = localStorage.getItem('username');
    this.myloginId=localStorage.getItem('loginId');
    const url = '/publicview_probite/' + this.myloginId + '_' +  this.username;
    console.log('aaaaa',this.username)
    window.open(url, '_blank');
  }

  bannerpicture(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= 1000 && img.height >= 300) {
            // Image size is valid, proceed with the selected image
            this.bannerfile = file;
            this.Upload_Your_Sign = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = e.target.result;
            this.bannerImageUrl = e.target.result;
            this.bannerupload();
          } else {
            // Image size is smaller than 1000x300 pixels, show error
            this.fileTypeError = true;
            this.errorMessage = 'Image Size Must be at least 1000x300 Pixels.';
            alert(this.errorMessage);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/profilepicture.png';
      this.bannerImageUrl = '/assets/images/profilepicture.png';
    }
  }
  

  bannerupload(){
    if(!this.bannerid){
    // Retrieve the clicked ID from session storage
    this.clickedid = sessionStorage.getItem('clickedid');
    console.log('clicked@@@', this.clickedid);

    const formData = new FormData();
    formData.append('PortfolioProfileId',this.clickedid);
    formData.append('BannerImage',this.bannerfile);

      this.ivinService.bannerpost(formData).subscribe((data:any)=>{
        if(data['Status']===200){
            this._snackBar.open('Record Has Been Saved Successfully', 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
            panelClass: 'Snackbar-green'
          });
          console.log('banner posted',data);
          this.getbannerimage();
        }
      })
    }else{
      this.updatebanner();
    }
  }


getbannerimage(){
    this.ivinService.bannerget(this.clickedid).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('banner getted',data);
        this.bannerImageUrl = data.Result[0].BannerImage;
        console.log('bannerr gette',this.bannerImageUrl);
        this.bannerid = data.Result[0].id
      }
    })
}    

updatebanner(){
  // Retrieve the clicked ID from session storage
  this.clickedid = sessionStorage.getItem('clickedid');
  console.log('clicked@@@', this.clickedid);

  const updateform = new FormData();
  // if (this.bannerfile) {
  //   updateform.append('BannerImage', this.bannerfile);
  //   console.log('BannerImage', this.bannerfile);
  // }
  updateform.append('PortfolioProfileId',this.clickedid);
  updateform.append('BannerImage',this.bannerfile);
  updateform.append('id',this.bannerid);
  this.ivinService.bannerupdate(this.bannerid,updateform).subscribe((data:any)=>{
    if(data['Status']===200){
      console.log('banner update',data);
      this._snackBar.open('Record Has Been Updated Successfully', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000,
        panelClass: 'Snackbar-green'
      });
    }
  })
}

}
