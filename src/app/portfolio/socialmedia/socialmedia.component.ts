import { Component, EventEmitter, Injectable, OnInit, Output, TemplateRef, ViewChild  } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import {  FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpHeaders,  } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';

interface CardData {
  selectedOption: string;
  Link: string;
  Description: string;

}

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss']
})
export class SocialmediaComponent {


  telegramLinks: string[] = [
    'https://telegram.org/link1',
    'https://telegram.org/link2'
  ];

  twitterLinks: string[] = [
    'https://telegram.org/link1',
    'https://telegram.org/link2'
  ];
  

  linkedinLink = 'https://linkedin.com';
  linkedinDescription = 'Connect with us on LinkedIn';

  instagramLink = 'https://instagram.com';
  instagramDescription = 'Follow us on Instagram';

  facebookLink = 'https://facebook.com';
  facebookDescription = 'Like us on Facebook';

  youtubeLink = 'https://youtube.com';
  youtubeDescription = 'Subscribe to our YouTube channel';

  whatsappLink = 'https://whatsapp.com';
  whatsappDescription = 'Chat with us on WhatsApp';
  yourselfid: any;

  openLink(link: string): void {
    window.open(link, '_blank');
  }

  dialogRef!: MatDialogRef<any>;
  showPopupContentOutside=false;
  urllink = new FormControl();
  officeheld= new FormControl();
  Description= new FormControl();
  updateDescription= new FormControl();
  urllinkupdate= new FormControl();
  officeheldupdate= new FormControl();
  myloginId: any;
  socialMedData:any;
  socialdata: any;
  cardDataList: CardData[] = [];
  socialid: any;
  deltId: any;
  displayName='post';
  updatedid: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();
  constructor(private ivinService:IvinService,private router:Router,private http: HttpClient,private dialog: MatDialog,private _snackBar: MatSnackBar,){}

  ngOnInit(): void {
  }
  
// This is for popup
outcorrections(templateRef: TemplateRef<any>) {
  this.dialogRef = this.dialog.open(templateRef);
  this.showPopupContentOutside = true;
}

socialmediadetailsclose() {
  this.dialogRef.close();
  }

socialmediapost() {
  this.yourselfid = sessionStorage.getItem('yourselfid');
  if (!this.yourselfid) {
      console.error("No yourselfid found in session storage.");
      alert("Please complete the previous step before submitting.");
      return;
  }
  console.log("yourselfid-candida", this.yourselfid);

  const socialdata = {
    PortfolioProfileId: this.yourselfid,
    SocialMediaType: this.officeheld.value, // Access the value property of form controls
    SocialMediaLink: this.urllink.value,
    SocialMediaDescription: this.Description.value
  };
console.log('socialdata',socialdata)
  this.ivinService.socialmediapost(socialdata).subscribe((data: any) => {
    if (data["Status"] === 200) {
      this._snackBar.open('Posted successfully!', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000, // Duration in milliseconds
      });
      
      console.log('data', data);
      this.moveToTab.emit(4);
      // this.socialmediadetailsclose();
      // this.getsocialmedia();
    }else{
      // Handle known error conditions from the backend
      alert(`Error: ${data['Message'] || 'An unknown error occurred.'}`);
    }
  },
  (error: any) => {
      // Handle unexpected errors from the backend
      console.error('Error occurred:', error);
      const errorMessage = error.error?.Message || 'An unknown error occurred.';
      alert(`Error: ${errorMessage}`);
  }
  );
}


addCard() {
  let socialmediaObj: CardData = {
    selectedOption:  this.officeheld.value,
    Link: this.urllink.value,
    Description: this.Description.value
  };
  console.log(socialmediaObj,'syamala')
  this.cardDataList.push(socialmediaObj);
  this.socialmediapost();
}


openupdatename(each: any) {
  console.log(each, "each object"); // Log the 'each' object to verify its contents
  this.updatedid = each.id;
  this.officeheldupdate.setValue(each.SocialMediaType);
  console.log('each.SocialMediaType', each.SocialMediaType);
  console.log('this.officeheldupdate', this.officeheldupdate);
  this.urllinkupdate.setValue(each.SocialMediaLink);
  this.updateDescription.setValue(each.SocialMediaDescription);
  console.log('sdf', each);
  console.log('pavan', this.updatedid);
  this.displayName = 'update';
}



removesocial(each:any) {
  // event.stopPropagation();
  console.log('each', each);
  this.deltId=each.id;
  console.log('this.deltId', this.deltId);
  this.ivinService.deleteSocialMedia(this.deltId).subscribe((data:any)=>{
    if(data['Status'] === 200){
      console.log('Backend data', data);
      this.officeheldupdate.setValue('');
      this.urllinkupdate.setValue('');
      this.updateDescription.setValue('');

    }
  })
}




addCardupdate(){
  let socialmediaObj: CardData = {
    selectedOption:  this.officeheldupdate.value,
    Link: this.urllinkupdate.value,
    Description: this.updateDescription.value
  };
  console.log(socialmediaObj,'syamala')
  this.cardDataList.push(socialmediaObj);
  // this.socialmediapost();
}


}
