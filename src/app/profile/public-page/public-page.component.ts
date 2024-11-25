import { Component } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivatedRoute } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ transform: 'translateX(100%)' }),
        animate('3s ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class PublicPageComponent {
  profileData:any;
  myloginId: any;
  aboutdata: any;
  Candiatdata: any;
  name: any;
  candidatebrief: any;
  profilePicture: any;
  logo: any;
  partySymbol: any;
  manifestoImg:any;
  candidateinfo: any;
  politicaldata: any;
  candidaturesid: any;
  politicalid:any;
  id: any;
  multipleImages: any[] = [];
  defaultImage: any;
  multipleImagesArr: string[] = [];
  socialdata: any;
  socialid: any;

  constructor(private route: ActivatedRoute,private ivinService:IvinService){}


  ngOnInit(){
    this.myloginId = localStorage.getItem('loginId');
    // this.route.params.subscribe(params => {
    //   this.username = params['username'];
    // });  
    
    this.getUserProfile();
    this.getSocialMedias();
    // this.getAllMultiImages();
    this.getaboutdata();
    this.getcandidatedata();
    this.getAllMultiImages()
    this.getPoliticalHistorydata();
    // const idUsername = this.route.snapshot.paramMap.get('id_username');
    // const parts = idUsername?.split('_');
    // const id = parts?.[0];
    // const username = parts?.[1];
    setInterval(() => {
      this.triggerSlideAnimation();
    }, 3000);
  }
  
  triggerSlideAnimation() {
    // Trigger the slide animation by updating the array
    this.multipleImagesArr = [...this.multipleImagesArr.slice(1), this.multipleImagesArr[0]];
  
  }

  getUserProfile(){
    const userid = localStorage.getItem('loginId')
    this.ivinService.getProfileData(userid).subscribe((data:any)=>{
      // console.log(data.Result,"ram")
     this.aboutdata= data.Result
     console.log('syamala',this.aboutdata)
     
    })
  }

  getaboutdata(){
    this.ivinService.getUserProfile(this.myloginId).subscribe((data:any)=>{
      this.profileData = data.Result
      console.log('vasu',this.profileData)
      this.name = data.Result.map((item:any)=> item.Name)
      this.profilePicture = this.profileData[0]['ProfilePicture']
    })
  }

getcandidatedata(){
  this.ivinService.getCandiatureInfo(this.myloginId).subscribe((data:any)=>{
    this.candidateinfo = data.Result
    this.logo = data.Result[0]['PartyLogo'];
    this.partySymbol = data.Result[0]['PartySymbol'];
    this.manifestoImg = data.Result[0]['PartyManifesto'];
    console.log('wwwww', this.candidateinfo)

    
  })
}

getPoliticalHistorydata() {
  this.candidaturesid = localStorage.getItem("candid");
  console.log('id', this.candidaturesid);
  
  this.ivinService.getPoliticalHistory(this.candidaturesid).subscribe((data: any) => {
    if (data && data.Result && data.Result.length > 0) {
      this.politicaldata = data.Result;
      this.politicalid = data.Result[0]["id"];
      console.log('aaaaa',this.politicalid )
      console.log( this.politicaldata,"pdata");

      // Fetch party inclination data for each political item
      this.politicaldata.forEach((politicalItem: any) => {
        const politicalId = politicalItem.PartyName;
        console.log(politicalId,"pid");
        this.ivinService.partyinclinationgetbyid(politicalId).subscribe(
          (partyInclinationData: any) => {
            if (partyInclinationData && partyInclinationData.Result && partyInclinationData.Result.length > 0) {
              politicalItem.partyname = partyInclinationData.Result[0].PartyName;
             
              console.log(politicalItem.partyname, "pname");

            }
          },
          (error) => {
            console.error('Error fetching party inclination data:', error);
            // Handle error, show a message, or perform other actions as needed.
          }
        );
      });
    }
  });
}

getAllMultiImages() {
  this.ivinService.getallmultiimageprofile(this.myloginId).subscribe((data: any) => {
    // console.log(data.Result, "ramaaa");
    const newArr: any[] = [];
    for (let each of data.Result) {
      // console.log(each.multipleImages);

        // console.log(data.Result);
        newArr.push(each.multipleImages);

    }
    this.multipleImagesArr = newArr;
    console.log('array', this.multipleImagesArr)
  });
}

getSocialMedias(){
  this.myloginId = localStorage.getItem('loginId');
  console.log('loginid',this.myloginId)

  this.ivinService.getsocialmedia(this.myloginId).subscribe((data: any) =>{
    this.socialdata = data.Result;
    this.socialid = data.Result[0]["id"]
    console.log('socialdata', this.socialdata);
    console.log('socialid',this.socialid)
  })
}

}
